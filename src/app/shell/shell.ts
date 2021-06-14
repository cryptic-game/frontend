import {BUILTINS} from './builtins/builtins';
import {IOHandler, Command} from './command';
import {ShellApi} from './shellapi';

export class Shell {
  private history: string[] = [];
  public commands: Map<string, Command> = new Map();
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

  execute(cmd: string) {
    let commands = cmd.trim().split(';');
    commands = [].concat(...commands.map((command) => command.split('\n')));
    commands.forEach((command_) => {
    const command = command_.trim().split(' ');
    const iohandler: IOHandler = {stdout: this.stdoutHandler.bind(this), stdin: this.stdinHandler.bind(this), stderr: this.stderrHandler.bind(this), positionalArgs: command.slice(1)};
     this.executeCommand(command[0], iohandler)
    });
    if (cmd) {
      this.history.unshift(cmd);
    }
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
