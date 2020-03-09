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
  XY = 'G16',
  XZ = 'G17',
  YZ = 'G19'
}
