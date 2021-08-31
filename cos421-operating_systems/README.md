# COS 421: Operating Systems

*class redacted from public repo to protect from cheating*

Instructor: Dr. Jonathan Geisler

Credits: 3

Homework Time: 118 hours

> This course covers the foundations of how operating systems are designed. We will look view this from the lens of three big ideas: virtualization, concurrency, and persistence. From there, we will discover how the operating system acts a virtual machine, standard library, and resource manager. We will explore the differences between policy and mechanism to understand an effective way of layering the OS for use by applications and other parts of the OS. Finally, we will see that even though the OS provides abstractions that are meant to hide device details and the device driver implementations from applications, but that these abstractions are influenced by hardware. The hardware influence is essential to provide acceptable performance from the hardware to the applications without having the OS cause unnecessary overhead. Finally, we will see how the OS provides protection through isolation and reliability to applications in the face of malicious code and unreliable hardware.

## Skills

- Languages: C, C++
- Virtualization
- Concurrency
- Persistence (File Systems)

## Assignments

### [Shell](./rsh/)

Homework Time: 16 hours

Created a shell that could spawn processes, background them, redirect standard IO, and pipe them.

### [Swap Page Replacement](./page-replacement/)

Homework Time: 14 hours

Implemented two page replacement policies (FIFO and clock) and tested how faults related to the number of pages.

### [FAT File System](./file-system/)

Homework Time:  31 hours

Reads and writes to a FAT filesystem image using mmap.

