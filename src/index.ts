import { writeToFile } from './utils/files';
import {
  Coordinates,
  Plane,
  Units,
  Movement,
  Coolant,
  CoreM,
  CoreG,
  FeedRateMode,
  SpindleControlMode
} from './gcodeTypes';
import { mapCoordinates, warn } from './utils/lines';

type Speed = {
  value: number;
  mode: SpindleControlMode;
  maxRpm?: number;
};
type Feedrate = {
  value: number;
  mode: FeedRateMode;
};

export default class TCode {
  constructor(
    protected programName: string,
    protected initialUnits: Units,
    protected initialPlane = Plane.XY,
    config?: {
      outputPath?: string;
      spacer?: string;
      lineNumbers?: boolean;
      machineDimensions?: Coordinates;
    }
  ) {
    this.lines = ['%', `(${programName})`, initialPlane, initialUnits];
    this.config = Object.assign({ spacer: ' ', lineNumbers: false }, config);
  }

  public config: {
    outputPath?: string;
    spacer: string;
    lineNumbers: boolean;
    machineDimensions?: Coordinates; // used for validation warnings
  };

  protected lastModalCommand: null | Movement;
  protected lastSpeed?: Speed;
  protected lastFeedrate?: Feedrate;

  public setProgramName(name: string) {
    this.programName = name;
    this.lines[1] = name;
  }

  protected lines: string[];
  public get gcode() {
    return this.lines
      .map((v, i) => {
        if (i < 2 || !this.config.lineNumbers) {
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

  public setSpindleSurfaceSpeed(unitsPerMinute: number, maxRpm?: number) {
    const mode = SpindleControlMode.SurfaceSpeed;
    if (unitsPerMinute < 0) {
      const units =
        this.initialUnits === Units.IN
          ? 'feet per minute'
          : 'meters per minute';
      throw new Error(
        `Invalid spindle surface speed "${unitsPerMinute}${units}". Use a positive number.`
      );
    }
    this.lastSpeed = { value: unitsPerMinute, mode, maxRpm };
    this.do(`${mode} ${maxRpm && `D${maxRpm}`} S${unitsPerMinute}`);
  }

  public setSpindleRpm(rpm: number) {
    const mode = SpindleControlMode.RPM;
    if (rpm < 0) {
      throw new Error(
        `Invalid spindle speed "${rpm} rpm. Use a 0 or positive number.`
      );
    }
    this.lastSpeed = { value: rpm, mode };
    this.do(`${mode} S${rpm}`);
  }

  public setSpindleSpeed(speed: Speed) {
    if (speed.mode === SpindleControlMode.SurfaceSpeed) {
      this.setSpindleSurfaceSpeed(speed.value, speed.maxRpm);
    } else {
      this.setSpindleRpm(speed.value);
    }
  }

  public setFeedrate(value: number, mode = FeedRateMode.UnitsPerMinute) {
    if (value <= 0) {
      throw new Error(
        `Invalid feedrate "${value}${this.initialUnits}". Use a positive number.`
      );
    }
    this.lastFeedrate = { value, mode };
    this.do(`F${value}`);
  }

  public changeTool(toolNumber: number) {
    if (toolNumber < 0) {
      throw new Error(
        `Invalid tool number "${toolNumber}". Use a positive integer.`
      );
    }
    this.do(`T${toolNumber} ${CoreM.ToolChange}`);
  }

  public moveLinear(
    destination: Coordinates,
    type?: Movement.Line | Movement.Rapid
  ) {
    if (!type && !this.lastModalCommand) {
      warn('No previous modal command known, using rapid movement');
      type = Movement.Rapid;
    }

    this.do(`${type} ${mapCoordinates(destination, this.config.spacer)}`);
  }

  public moveArcWithRadius(
    destination: Coordinates,
    type: Movement.ClockwiseArc | Movement.CounterClockwiseArc,
    radius: number
  ) {
    if (radius <= 0) {
      throw new Error(`Invalid arc radius "${radius}. Use a positive integer.`);
    }
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

  public doWithCoolant(coolant: Coolant, fn: () => void) {
    if (coolant === Coolant.Flood) {
      this.do(CoreM.FloodCoolantOn);
    } else if (coolant === Coolant.Mist) {
      this.do(CoreM.MistCoolantOn);
    }
    fn();
    this.do(CoreM.CoolantOff);
  }

  public doWithSpeedsAndFeeds(
    opts: { speed?: Speed; feedrate?: Feedrate },
    fn: () => void
  ) {
    const currentSpeed = this.lastSpeed;
    const currentFeedrate = this.lastFeedrate;
    opts.speed && this.setSpindleSpeed(opts.speed);
    opts.feedrate && this.setFeedrate(opts.feedrate.value, opts.feedrate.mode);
    fn();

    currentSpeed && this.setSpindleSpeed(currentSpeed);
    currentFeedrate &&
      this.setFeedrate(currentFeedrate.value, currentFeedrate.mode);
  }

  public pause(milliseconds: number) {
    this.do(`${CoreG.Dwell} P${milliseconds}`);
  }

  public dwell(milliseconds: number) {
    this.pause(milliseconds);
  }

  public async export() {
    await writeToFile(this.gcode);
  }
}
