# COS 436 Parallel & Distributed Computing

*class redacted from public repo to protect from cheating*

Instructor: Dr. Tom Nurkkala

Credits 3

Homework Time: 74 hours

> A study of concepts and models of distributed and parallel computing, including concurrency, synchronization, algorithms, hardware organization, and common programming environments. Implementation of parallel algorithms on multi-core CPUs and many-core GPUs.

## Skills

- Languages: C, python
- Multithreading (pthread)
- MPI
- GPU Programming

## Assignments

### [Genome](./genome/)

Homework Time: 12 hours

Searched for a DNA pattern in a large sequence using multiple concurrent threads.

### [Convolution](./convolution/)

Homework Time: 12 hours

Operated convolutions on images of various sizes, with various numbers of threads, and tested the runtime, speedup, and efficiency.

### [Distributed Matrix Addition (C)](./mat-add/)

Homework Time: 14 hours

Implemented a distributed master-slave system to calculate large matrix additions using MPI.

### [Distributed Matrix Addition (Python)](./py-add/)

Homework Time: 4 hours

Implemented a distributed master-slave system to calculate large matrix additions using `mpi4py`.

### [GPU Traveling Salesman Problem](./gpu-tsp/)

Homework Time: 17 hours

Implemented a GPU brute force implementation for the TSP that uses cuda.