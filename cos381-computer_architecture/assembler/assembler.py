# usage: `python3 main.py <assembly input file> <binary output>`

import json
import re
import struct
import sys

assemblyFilePath = sys.argv[1]
binaryOutputPath = sys.argv[2]

binaryFile = open(binaryOutputPath, "wb")
START_OFFSET = 0x1000
for i in range(START_OFFSET):
    binaryFile.write(struct.pack('x'))

assemblyFile = open(assemblyFilePath, "r")
instructs = json.loads(open("instructionInfo.json", "r").read())


def addInstruct(*instructionParts):
    strInstruction = ""
    for component in instructionParts:
        strInstruction += component

    if len(strInstruction) != 32:
        print("Instruction should be 32 bits: {}".format(strInstruction))
        exit(-1)

    print("{} | {:10} |".format(strInstruction, int(strInstruction, 2)), end="")
    binaryFile.write(struct.pack('<I', int(strInstruction, 2)))


def register(regString):
    p = re.compile('x(\\d\\d?)')
    m = p.match(regString)
    regValue = int(m.group(1))
    if 0 <= regValue <= 31:
        return '{0:05b}'.format(regValue)
    else:
        print("Bad register value: '{}'".format(regValue))
        exit(-1)


def immediate(immString):
    decimalM = re.match('^-?\\d+$', immString)
    hexM = re.match('^0x([0-9A-F]+)$', immString)
    binM = re.match('^0b([01]+)$', immString)

    if decimalM:
        return int(immString)
    elif hexM:
        return int(hexM.group(1), 16)
    elif binM:
        return int(binM.group(1), 2)
    else:
        print("Unrecognized immediate: {}".format(immString))
        exit(-1)


def getBinDigits(value, msd, lsd):
    v = (value % (2 ** (msd + 1))) >> lsd
    formatStr = '{{:0{}b}}'.format(msd - lsd + 1)
    return formatStr.format(v)


def handleRType(parts, instruction, message):
    rd = register(parts[1])
    rs1 = register(parts[2])
    rs2 = register(parts[3])
    addInstruct(instruction['func7'], rs2, rs1, instruction['func3'], rd, instruction['opcode'])
    print("{:30}\t| [R]\t".format(message))


def handleIType(parts, instruction, message):
    rd = register(parts[1])
    rs1 = register(parts[2])
    imm = immediate(parts[3])
    addInstruct(getBinDigits(imm, 11, 0), rs1, instruction['func3'], rd, instruction['opcode'])
    print("{:30}\t| [I]\timm = {}".format(message, imm))


def handleSType(parts, instruction, message):
    imm = immediate(parts[1])
    rs1 = register(parts[2])
    rs2 = register(parts[3])
    addInstruct(getBinDigits(imm, 11, 5), rs2, rs1, instruction['func3'], getBinDigits(imm, 4, 0), instruction['opcode'])
    print("{:30}\t| [S]\timm = {}".format(message, imm))


def handleSBType(parts, instruction, message):
    imm = immediate(parts[1])
    rs1 = register(parts[2])
    rs2 = register(parts[3])
    addInstruct(getBinDigits(imm, 12, 12), getBinDigits(imm, 10, 5), rs2, rs1, instruction['func3'], getBinDigits(imm, 4, 1), getBinDigits(imm, 11, 11), instruction['opcode'])
    print("{:30}\t| [SB]\timm = {}".format(message, imm))


def handleUType(parts, instruction, message):
    rd = register(parts[1])
    imm = immediate(parts[2])
    addInstruct(getBinDigits(imm, 31, 12), rd, instruction['opcode'])
    print("{:30}\t| [U]\timm = {}".format(message, imm))


def handleUJType(parts, instruction, message):
    rd = register(parts[1])
    imm = immediate(parts[2])
    addInstruct(getBinDigits(imm, 20, 20), getBinDigits(imm, 10, 1), getBinDigits(imm, 11, 11), getBinDigits(imm, 19, 12), rd, instruction['opcode'])
    print("{:30}\t| [UJ]\timm = {}".format(message, imm))


def parseAssembly():
    print("{:^32} | {:^10} | {:^31} | Diagnostic Info".format("Binary Instruction", "Dec Instr", "Assembly Instruction"))
    print("-"*97)
    for lineNumber, line in enumerate(assemblyFile.readlines()):
        if line.startswith("//") or line == "\n":
            continue

        parts = line.strip().replace(",", "").split(" ")
        instruction = instructs[parts[0]]
        message = "\t{}: {}".format(lineNumber+1, line.strip())

        if instruction["format"] == "R":
            handleRType(parts, instruction, message)
        elif instruction["format"] == "I":
            handleIType(parts, instruction, message)
        elif instruction["format"] == "S":
            handleSType(parts, instruction, message)
        elif instruction["format"] == "SB":
            handleSBType(parts, instruction, message)
        elif instruction["format"] == "U":
            handleUType(parts, instruction, message)
        elif instruction["format"] == "UJ":
            handleUJType(parts, instruction, message)
        elif parts[0] == "halt":
            #addInstruct("11010110000000000000000000000000")
            addInstruct("00000000000000000000000001101011")
            print(message)


if __name__ == '__main__':
    parseAssembly()
