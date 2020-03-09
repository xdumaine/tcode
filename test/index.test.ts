import Tcode from '../src';
import { Units, Plane } from '../src/gcodeTypes';

it('Will create a basic gcode program', () => {
  const program = new Tcode('test1', Units.MM);
  program.do('something');

  expect(program.gcode).toEqual(`%
0test1
G16
G21`);
});
