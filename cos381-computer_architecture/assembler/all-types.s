// R Type
add x1, x2, x3
slt x1, x2, x3
and x1, x2, x3
or x1, x2, x3
xor x1, x2, x3
sll x1, x2, x3
srl x1, x2, x3
sub x1, x2, x3
sra x1, x2, x3

// I Type
addi x1, x2, 0xFF
slti x1, x2, 0b101
andi x1, x2, 1
ori x1, x2, 1
xori x1, x2, 1
slli x1, x2, 1
srli x1, x2, 1
srai x1, x2, 1
jalr x1, x2, 1
lw x1, x2, 1

// S Type
sw 123456, x2, x3

// SB Type
beq 2, x2, x3
bne 2, x2, x3
blt 2, x2, x3
bge 2, x2, x3

// U Type
lui x1, 1
auipc x1, 1


// UJ Type
jal x1, 1

halt

