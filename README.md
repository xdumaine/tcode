# TCode

TCode is a library for writing gcode programs using typescript. It is not yet (and likely never will be) feature complete, but it is designed for convenience and should be capable of generating any gcode program.

### Easier to read and write

Gcode is complex and arcane, and includes many simple codes that do basic operations. Instead of writing `G00 X1 Y2 Z3` you could write `g.moveRapid({ x: 1, y: 2, z: 3})` while the number of characters is more, it's much easier to read, and because it's typed, it's much easier to write (without making errors).

### Typechecking

Fat fingering codes in a text file are is too easy to do. This library lets you write strongly typed (and tested) code, which guarantees output.

### Convenience

Many Gcode systems have convenience methods, but you have to check references, verify output, and run your programs to test them. With this library I intend to implement convenience methods for things like programming circles with a single command, instead of multiple complex commands.

### Learning

I'll admit that I'm writing this because I

1. Want to learn Gcode
2. Don't want to learn Gcode
