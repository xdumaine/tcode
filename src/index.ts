import fs from 'fs';
import { writeToFile } from './utils/files';
import { Coordinates, Plane, Units, Movement } from './gcodeTypes';
import { mapCoordinates } from './utils/lines';

export default class TCode {
  constructor(
    protected programName: string,
    protected initialUnits: Units,
    protected initialPlane = Plane.XY,
    config?: {
      outputPath?: string;
      spacer?: string;
      skipLineNumbers?: boolean;
    }
  ) {
    this.lines = ['%', `0${programName}`, initialPlane, initialUnits];
    this.config = Object.assign(
      { spacer: ' ', skipLineNumbers: false },
      config
    );
  }

  public config: {
    outputPath?: string;
    spacer: string;
    skipLineNumbers: boolean;
  };

  protected lastModalCommand: null | Movement;

  public setProgramName(name: string) {
    this.programName = name;
    this.lines[1] = name;
  }

  protected lines: string[];
  protected get gcode() {
    return this.lines
      .map((v, i) => {
        if (i < 2 || this.config.skipLineNumbers) {
          return v;
        }
        return `N${i} ${v}`;
      })
      .join('\n');
  }

  public do(command: string) {
    const lines = command.split(/\r?\n/);
    lines.forEach(l => this.lines.push(l));
  }

  public moveLinear(
    destination: Coordinates,
    type?: Movement.Line | Movement.Rapid
  ) {
    if (!type && !this.lastModalCommand) {
      console.warn('No previous modal command known, using rapid movement');
      type = Movement.Rapid;
    }

    this.do(`${type} ${mapCoordinates(destination, this.config.spacer)}`);
  }

  public moveArcWithRadius(
    destination: Coordinates,
    type: Movement.ClockwiseArc | Movement.CounterClockwiseArc,
    radius: number
  ) {
    return this.do(
      `${type} ${mapCoordinates(destination, this.config.spacer)} R${radius}`
    );
  }

  public moveArcWithCenter(
    destination: Coordinates,
    type: Movement.ClockwiseArc | Movement.CounterClockwiseArc,
    center: Coordinates
  ) {
    return this.do(
      `${type} ${mapCoordinates(
        destination,
        this.config.spacer
      )} ${mapCoordinates(center, this.config.spacer, true)}`
    );
  }

  public async export() {
    await writeToFile(this.gcode);
  }
}
