import readline from 'readline';

/**
 * Asks for a secret without echoing what is typed.
 * Returns an empty string when there is no interactive terminal (CI, pipes).
 */
export const promptHidden = (question: string): Promise<string> =>
  new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      resolve('');
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    // readline echoes every typed character through _writeToOutput; mute it after the question.
    const internal = rl as unknown as { _writeToOutput: (text: string) => void };
    const originalWrite = internal._writeToOutput.bind(rl);
    let muted = false;
    internal._writeToOutput = (text: string) => {
      if (!muted) originalWrite(text);
    };

    rl.question(question, (answer) => {
      muted = false;
      process.stdout.write('\n');
      rl.close();
      resolve(answer.trim());
    });
    muted = true;
  });
