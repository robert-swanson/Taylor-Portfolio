addi x3, x0, 42
// 42

addi x1, x0, 3
addi x2, x0, 4
add x3, x1, x2
// 7

addi x1, x0, 3
addi x2, x0, 5
and x3, x1, x2
// 1

addi x1, x0, 3
andi x3, x1, 5
// 1

addi x1, x0, 3
addi x2, x0, 5
or x3, x1, x2
// 7

addi x1, x0, 3
ori x3, x3, 5
// 7

addi x1, x0, 7
addi x2, x0, 2
sll x4, x1, x2
// 28

addi x1, x0, 7
slli x4, x1, 2
// 28

addi x1, x0, 3
addi x2, x0, 4
slt x3, x1, x2
// 1


addi x1, x0, 4
slti x3, x1, 3
// 0

addi x1, x0, 7
addi x2, x0, 2
srl x3, x1, x2
// 1

addi x1, x0, 7
srli x6, x1, 2
// 1

addi x1, x0, 7
addi x2, x0, 5
sub x3, x1, x2
// 2

addi x1, x0, 3
addi x2, x0, 5
xor x3, x1, x2
or x3, x1, x2
// 6

addi x1, x0, 3
xori x3, x1, 5
// 6

halt
