export interface Coordinates {
  x?: number;
  y?: number;
  z?: number;
}

export const enum Units {
  IN = 'G20',
  MM = 'G21'
}

export const enum Movement {
  Rapid = 'G00',
  Line = 'G01',
  ClockwiseArc = 'G02',
  CounterClockwiseArc = 'G03'
}

export const enum Plane {
  XY = 'G17',
  XZ = 'G18',
  YZ = 'G19'
}

export const enum Coolant {
  Mist,
  Flood
}

export const enum SpindleControlMode {
  SurfaceSpeed = 'G96',
  RPM = 'G97'
}

export const enum FeedRateMode {
  InverseTime = 'G93',
  UnitsPerMinute = 'G94',
  UnitsPerRevolution = 'G95'
}

export const enum CoreG {
  Dwell = 'G04',
  DisablePolarCoordinates = 'G15',
  EnablePolarCoordinates = 'G16',
  ReferencePointReturnCheck = 'G27', // TODO - grok
  ReturnHome = 'G28',
  ReturnFromReference = 'G29', // TODO - grok
  CancelWorkOffsets = 'G53',
  ResetAllScaleFactors = 'G50',
  ReturnToInitialZ = 'G98',
  ReturnToInitialR = 'G99'
}

export const enum CoreM {
  ProgramStop = 'M00',
  ProgramEnd = 'M02',
  SpindleOnClockwise = 'M03',
  SpindleOnCounterClockwise = 'M04',
  SpindleStop = 'M05',
  ToolChange = 'M06',
  MistCoolantOn = 'M07',
  FloodCoolantOn = 'M08',
  CoolantOff = 'M09'
}
