export class TerminalPrograms {
  static programs = {
    'ping': (args: string[], output: (html: string) => void) => {
      console.log('hi');
      output('pong');
    },
    'echo': (args: string[], output: (html: string) => void) => {
      output(args.join(' '));
    }
  };
}
