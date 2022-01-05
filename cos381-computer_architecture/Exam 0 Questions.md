# Exam 0 Questions

## Question 5 [2/7 pts]

What is the SPEC benchmark and why is it useful?

> The SPEC benchmark is a standardized performance benchmark that tests various properties of a CPU that impact overall performance and consolidates them reasonably into a compact report of that CPU's performance. It is useful because single properties such as clock speed, instruction throughput, instruction latency, and instruction count can't single-handedly describe a comparable performance for two different CPUS.

Texbook:

> SPEC (System Performance Evaluation Cooperative) is an effort funded and supported by a number of computer vendors to create standard sets of benchmarks for modern computer systems. (P47)
>

![image-20211011121833413](/Users/robertswanson/Library/Application Support/typora-user-images/image-20211011121833413.png)

- What were you looking for here? The wording of the question didn’t really point me to any specific things you wanted my answer to discuss besides is usefulness (which I thought I answered)
- What about my answer was insufficient?
- I read through the book’s commentary on SPEC and felt like what I explained about SPEC was accurate and covered the important ideas about what SPEC is and what its for. 

## Question 10 [7.5/8]

Which RISC-V instructions are necessary to support multicore processors? Why are these instructions necessary?

> Atomic operations are necessary to support multiple threads of execution that can access the same memory. This is necessary to avoid race conditions that can result in indeterminate program behavior.
>
> 1. Load Word Reserved
> 2. Store Word Reserved
> 3. Conditional Branch
>
> The first instruction is intended to begin operations that need to be functionally atomic. It loads a value into a register from memory as normal. Instructions can follow to implement the atomic operation, maybe including more loads. Once the results are known, the store word reserved instruction will attempt to store the value into memory, *but only if the destination has not been modified since the load word reserved instruction was called*. If it was modified, the memory is not modified and a condition flag is set. The following instruction will branch back to the load word instruction in the case of this failure to attempt the operation again with the new value loaded from memory

- Just curious what I missed out on here