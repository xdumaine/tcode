import * as fs from 'fs';

export const writeToFile = async (contents: string) => {
  const buffer = new Buffer(contents);
  await new Promise((resolve, reject) => {
    fs.writeFile(
      `${this.outputPath}/${this.programName}.gcode`,
      buffer,
      err => {
        if (err) {
          return reject(err);
        }

        return resolve();
      }
    );
  });
};
