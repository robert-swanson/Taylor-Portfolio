# COS 381: Computer Architecture

Instructor: **Dr. Jonathan Geisler**

Credits: **3**

Homework Time: **86 hours**

> A study of the hardware structure of computer systems, including arithmetic/logic units, memory organization, control unit design, pipelining, and instruction set design. A brief introduction to advanced topics, such as out-of-order execution, branch prediction, multi-core systems, and parallel processing cache coherency will prepare the student for graduate level courses in architecture. Prerequisites: COS 284.

## Skills

- Risc V
- Reading and Writing Assembly
- Understanding CPU design and impacts on performnce
- Pipelining
- Created a complete [CPU](./hw4-cpu) in a C++ simulator
- Created an [Assembler](https://repo.cse.taylor.edu/rswanson/assembler) to test the cpu

## Assignments

### [Mux](./hw0-mux)

Homework Time: 2hr

This first assignment is designed to introduce you to key components of the simulation framework you will be using through the rest of the semester. 

### [ALU](./hw1-alu)

Homework Time: 7hr

The second object you will build is an ALU class that can do all the computation for your processor. Again, we will build the pieces that depend on the framework together in this document, but more quickly and succinctly than with the last assignment.

### [Register File](./hw2-register)

Homework Time: 5 hr

The third object you will build is a `RegisterFile` class that can manage all the state for your processor. Since we are learning new pieces of the framework, we will continue to build the pieces incrementally.

### [Control Unit](./hw3-control-unit)

Homework Time: 5 hr

Create a control unit that can send control signals to the components of the CPU

### [CPU](./hw4-cpu)

Homework Time: 35 hr

This fourth assignment is designed to build a fully functioning CPU. Your task is to take all the modules you’ve built and combine them with several additional modules that I’m providing you. At the end of this assignment, you will be simulating the CPU and testing your implementation using simulated executables.

The object that you will build is CPU .

### [Assembler](https://repo.cse.taylor.edu/rswanson/assembler)

Homework Time: 2 hr

Created to test the CPU. I developed and shared with the class who used and debugged
