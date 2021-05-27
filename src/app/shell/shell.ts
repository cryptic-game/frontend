import {BUILTINS} from './builtins/builtins';
import {IOHandler, Command} from './command';
import {ShellApi} from './shellapi';

export class Shell {
  private history: string[] = [];
  public commands: Map<string, Command> = new Map();
  private variables: Map<string, string> = new Map();
  private aliases: Map<string, string> = new Map();

  constructor(
    private stdoutHandler: (stdout: string) => void,
    private stdinHandler: (callback: (stdin: string) => void) => void,
    private stderrHandler: (stderr: string) => void,
    public api: ShellApi,
  ) {
    BUILTINS.forEach((command) => {
      const cmd = new command(this.api);
      this.commands.set(cmd.name, cmd);
    });
    this.aliases.set('l', 'ls');
    this.aliases.set('dir', 'ls');
    this.aliases.set('quit', 'exit');
  }

  async executeCommand(command: string, io: IOHandler = null): Promise<number> {
    const iohandler = io ? io : {
      stdout: this.stdoutHandler.bind(this),
      stdin: this.stdinHandler.bind(this),
      stderr: this.stderrHandler.bind(this),
      positionalArgs: [],
    };
    command = command.toLowerCase();
    if (this.commands.has(command)) {
      return await this.commands.get(command).execute(iohandler);
    } else if (this.aliases.has(command)) {
      const cmd = this.aliases.get(command);
      return await this.commands.get(cmd).execute(iohandler);
    } else if (command === 'help') {
      return await this.help(iohandler);
    } else if (command !== '') {
      iohandler.stderr('Command could not be found.\nType `help` for a list of commands.');
      return 127;
    }
  }

  async executeCommandChain(
    commands: string[],
    previousStdout: string = null
  ): Promise<number> {
    let stdoutText = '';

    const pipedStdout = (output: string) => {
      stdoutText = stdoutText + output + '\n';
    };

    const pipedStdin = (callback: (input: string) => void) => {
      callback(previousStdout);
    };

    let command = commands[0].trim().split(' ');
    if (command.length === 0) {
      return await this.executeCommandChain(commands.slice(1));
    }
    // replace variables with their values
    command = command.map((arg) => {
      if (arg.startsWith('$')) {
        const name = arg.slice(1);
        if (this.variables.has(name)) {
          return this.variables.get(name);
        }
        return '';
      }
      return arg;
    });

    const stdout = commands.length > 1 ? pipedStdout : this.stdoutHandler.bind(this);
    const stdin = previousStdout ? pipedStdin : this.stdinHandler.bind(this);
    const iohandler: IOHandler = {stdout: stdout, stdin: stdin, stderr: this.stderrHandler.bind(this), positionalArgs: command.slice(1)};
    await this.executeCommand(command[0], iohandler);
    if (commands.length > 1) {
      this.executeCommandChain(commands.slice(1), stdoutText);
    }
  }

  execute(cmd: string) {
    let commands = cmd.trim().split(';');
    commands = [].concat(...commands.map((command) => command.split('\n')));
    commands.forEach((command) => {
      const pipedCommands = command.trim().split('|');
      this.executeCommandChain(pipedCommands).then((exitCode) => {
        this.variables.set('?', String(exitCode));
      });
    });
    if (cmd) {
      this.history.unshift(cmd);
    }
  }

  getExitCode(): number {
    return Number(this.variables.get('?'));
  }

  getHistory(): string[] {
    return this.history;
  }

  async autocomplete(content: string): Promise<string> {
    const words = content.split(' ');
    if (this.commands.has(words[0])) {
        const sub = await this.commands.get(words[0]).autocomplete(words.slice(1));
        return `${words[0]} ${sub}`;
    }
    return content
      ? [...this.commands]
        .filter(command => !command[1].hidden)
        .map(([name]) => name)
        .sort()
        .find(n => n.startsWith(content))
      : '';
  }


  // help command has to be here because
  // help has to be able to access all commands
  async help(iohandler: IOHandler): Promise<number> {
    const args = iohandler.positionalArgs;
    if (args.length === 0) {
      this.commands.forEach((cmd, name) => {
        iohandler.stdout(`${name} -      ${cmd.description}`);
      });
      return 0;
    } else {
      if (this.commands.has(args[0])) {
        this.commands.get(args[0]).showHelp(iohandler.stdout);
        return 0;
      } else {
        iohandler.stderr(`help: no help topics match '${args[0]}'.`);
        return 1;
      }
    }
  }
}
