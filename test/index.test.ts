import Tcode from '../src';
import { Units, Plane } from '../src/gcodeTypes';
import * as basic from './samples/basic.gcode';

it('Will create a basic gcode program', () => {
  const program = new Tcode('test1', Units.MM);
  program.do('something');

  expect(program.gcode).toEqual(basic);
});
