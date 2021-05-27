import {ShellApi} from './shellapi';

export enum ArgType {
  RAW,       // just a String
  PATH,      // FILE or DIRECTORY
  FILE,      // only FILE
  DIRECTORY  // only DIRECTORY
}

export interface PositionalArgument {
  name: string;
  optional?: boolean;
  captures?: boolean;
  argType?: ArgType;
}

export abstract class Command {
  public description = '';
  private positionalArgs: PositionalArgument[] = [];
  public optionalArgs = 0;
  public capturesAllArgs = false;
  private subcommands: Map<string, Command> = new Map();

  // TODO add named arguments
  constructor(public name: string, protected shellApi: ShellApi, public hidden: boolean = false) {
  }

  // this weird parameter is necessary so that the following works if SubCommand is a Command:
  // someCommand.addSubcommand(SubCommand);
  //
  // This removes avoidable code duplication of calling the constructor
  // for every subcommand in the supercommand class
  addSubcommand<T extends Command>(command: new (shellApi: ShellApi) => T) {
    const cmd = new command(this.shellApi);
    const name = cmd.name;
    this.subcommands.set(name, cmd);
  }

  addDescription(description: string) {
    this.description = description;
  }

  addPositionalArgument({name, optional = false, captures = false, argType = ArgType.RAW}: PositionalArgument) {
    if (this.capturesAllArgs) {
      throw Error('only the last argument can capture multiple words');
    } else if (this.optionalArgs > 0 && !optional) {
      throw Error('optional args must be last');
    }
    if (optional) {
      this.optionalArgs++;
    }
    this.capturesAllArgs = captures;
    this.positionalArgs.push({name, optional, captures, argType});
  }

  showHelp(stdout: (text: string) => void) {
    const positionalArgText = this.positionalArgs.map((arg) => arg.optional ? `[${arg.name}]` : arg.name).join(' ');
    stdout(`usage: ${this.name} ${positionalArgText}`);
    stdout(this.description);
    if (this.subcommands.size > 0) {
      stdout('subcommands:');
      this.subcommands.forEach((subcommand: Command, name: string) => {
        // TODO use \t
        // TODO align the descriptions
        stdout(`    ${name} - ${subcommand.description}`);
      });
    }
  }

  /** will be executed by the shell
   * @returns the exit code once the command is completed
   */
  public async execute(iohandler: IOHandler): Promise<number> {
    const args = iohandler.positionalArgs;
    const subcommand = this.subcommands.get(args[0]);
    if (subcommand !== undefined) {
      // remove the subcommand name
      iohandler.positionalArgs = args.slice(1);
      return await subcommand.execute(iohandler);
    }
    if (args.length > 0 && args.find((arg) => arg === '--help')) {
      this.showHelp(iohandler.stdout);
      return 0;
    }
    const posArgsLen = this.positionalArgs.length;
    if (posArgsLen < args.length && this.capturesAllArgs
      || args.length <= posArgsLen && args.length >= posArgsLen - this.optionalArgs
    ) {
      return await this.run(iohandler);
    }
    this.showHelp(iohandler.stdout);
    return 1;
  }


  /** will be called with the arguments only if there is no subcommand matching
   * @returns the exit code once the command is completed
   */
  abstract async run(iohandler: IOHandler): Promise<number>;


  reportError(error: any) {
    console.warn(new Error(error.message));
  }

  async autocomplete(words: string[]): Promise<string> {
    if (words.length === 0) {
      return '';
    }
    if (this.subcommands.has(words[0])) {
      const sub = this.subcommands.get(words[0]).autocomplete(words.slice(1));
      return `${words[0]} ${sub}`;
    }
    let found: any = [...this.subcommands]
      .filter(command => !command[1].hidden)
      .map(([name]) => name)
      .sort()
      .find(n => n.startsWith(words[0]));
    if (found) {
      return found;
    }
    // autocomplete the last word if its type is a file or directory
    const arg = this.positionalArgs[words.length - 1];
    let files: any;
    if (arg.argType === ArgType.DIRECTORY || arg.argType === ArgType.PATH) {
      files = await this.shellApi.listFilesOfWorkingDir();
      found = files.filter(n => n.is_directory).find(n => n.filename.startsWith(words[0]));
      if (found) {
        return found.filename;
      }
    }
    if (arg.argType === ArgType.FILE || arg.argType === ArgType.PATH) {
      files = await this.shellApi.listFilesOfWorkingDir();
      found = files.filter(n => !n.is_directory).find(n => n.filename.startsWith(words[0]));
      if (found) {
        return found.filename;
      }
    }
    // if there is nothing to complete, just give the input unchanged back
    return words.join(' ');
  }
}


export class IOHandler {
  stdout: (stdout: string) => void;
  stdin: (callback: (stdin: string) => void) => void;
  stderr: (stderr: string) => void;
  positionalArgs: string[];
}

