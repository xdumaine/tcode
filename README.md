# TCode

TCode is a library for writing gcode programs using typescript. It is not yet (and likely never will be) feature complete, but it is designed for convenience and should be capable of generating any gcode program.

### Easier to read and write

Gcode is complex and arcane, and includes many simple codes that do basic operations. Instead of writing `G00 X1 Y2 Z3` you could write `g.moveRapid({ x: 1, y: 2, z: 3})` while the number of characters is more, it's much easier to read, and because it's typed, it's much easier to write (without making errors).

### Typechecking

Fat fingering codes in a text file are is too easy to do. This library lets you write strongly typed (and tested) code, which guarantees output.

### Convenience

Many Gcode systems have convenience methods, but you have to check references, verify output, and run your programs to test them. With this library I intend to implement convenience methods for things like programming circles with a single command, instead of multiple complex commands.

I'd love to get to the point where I could even configure feeds and speeds from a lookup based on materials and machine, possibly by integrating with some known/existing references or calculators like gcode wizard or Provencut.

### Learning

I'll admit that I'm writing this because I

1. Want to learn Gcode (actually programming this library will help me to learn gcode)
2. Don't want to learn Gcode (having this library exist will help me not have to write gcode for basic cuts and such in the future.)

### Limitations (many) and warranties (none)

1. If this message is still here, this is not ready for use. Any GCode exported from this library could damage your materials, tools, or machine. Sofware is provided As-IS with no warranty.
2. I'm writing this primarily for 3-Axis CNC mills. If there's interest from myself or the community, I'd love to add additional support for 4-axis, 5-axis, 3d printers, or lathes. When any of the afforementioned setups are supported, limitation #1 will be modified or removed.
3. This is not intended to be used as a post-processor, though in the future, making the use of one could be pretty cool.
4. Some validation of inputs and boundaries may be supported, but all outputs should be validated with your mill control software prior to running any job.
