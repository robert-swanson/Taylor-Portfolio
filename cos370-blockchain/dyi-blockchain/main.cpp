// Created by Robert Swanson 2/12/2021

#ifndef JGG
#include <cstring>
#endif
#include <iostream>
#include <sodium.h>
#include <jansson.h>
#include <getopt.h>
#include <time.h>
#include <cstring>

#ifdef JGG
#define RANDOM_NONCE true
#else
#define RANDOM_NONCE false
#endif
#define VERBOSE false

#define MAX_DIGITS 20
#define MAX_HASH_BIN crypto_generichash_BYTES
#define MAX_HASH_HEX crypto_generichash_BYTES*2+1
#define MAX_DATA 1024
#define MAX_PKEY_HEX crypto_sign_PUBLICKEYBYTES*2+8
#define MAX_SKEY_HEX crypto_sign_SECRETKEYBYTES*2+8
#define SIG_HEX crypto_sign_BYTES*2+8

struct KeyPair {
    char *secretKey, *publicKey;
    unsigned char *secretKeyBinary, *publicKeyBinary;
};

char* createBlock(char *data, int difficulty, int isGenesis, char *prevHash, char *signature, char *publicKey);
json_t* createJSON(char *data, int isGenesis, int nonce, char *prevHash, char *signature, char *publicKey);
void validateBlockchain(const char *startingBlockHash);
void parseValues(int argc, char **argv, char **data, int *difficulty, int *generateKeys, int *isGenesis, int *numBlocks, char **prevHash, KeyPair *keyPair, int *verifyBlockchain);
void getHash(char *data, char *hex, unsigned char *binary);
int checkHash(unsigned char *binary, int difficulty);
void signData(char *data, KeyPair *keyPair, char **signature);
void verifyBlockSignature(json_t *jsonBlock, char *currentHash);
void generateKeyPair(KeyPair *keyPair);
void calculateBinaryKeys(KeyPair *keyPair);

int main(int argc, char *argv[]) {
    char uniqueData[MAX_DATA], *data, *prevHash, *signature, *currentVerify;
    KeyPair keyPair;
    int isGenesis = 0, difficulty = 0, numblocks = 0, generateKeys = 0, verifyBlockchain = 0;
    clock_t start, stop;

    if (sodium_init() < 0) {
        printf("ERROR: Couldn't initialize sodium\n");
        exit(1);
    }

    parseValues(argc, argv, &data, &difficulty, &generateKeys, &isGenesis, &numblocks, &prevHash, &keyPair, &verifyBlockchain);

    if (verifyBlockchain) {
        validateBlockchain(prevHash);
    }


    if (generateKeys) {
        generateKeyPair(&keyPair);
        printf("Generated\n  Secret Key: %s\n  Public Key: %s\n", keyPair.secretKey, keyPair.publicKey);
    } else if (keyPair.secretKey != NULL && keyPair.publicKey != NULL) {
        calculateBinaryKeys(&keyPair);
        printf("Using\n  Secret Key: %s\n  Public Key: %s\n", keyPair.secretKey, keyPair.publicKey);
    }

    start = clock();
    for (int i = 0; i < numblocks; i++) {
        sprintf(uniqueData, "%d: %s", i, data);
        signData(uniqueData, &keyPair, &signature);
        prevHash = createBlock(uniqueData, difficulty, isGenesis, prevHash, signature, keyPair.publicKey);
        isGenesis = false;
        if (VERBOSE) {
            printf("%d: %s\n", i, prevHash);
        }
    }
    stop = clock();

    if (numblocks > 0) {
        printf("Blocks = %d,\tDifficulty = %d,\tTime = %.4fs\n", numblocks, difficulty, ((double)(stop-start))/CLOCKS_PER_SEC);
    }

    return 0;
}

char* createBlock(char *data, int difficulty, int isGenesis, char *prevHash, char *signature, char *publicKey) {
    json_t *json;
    char *jsonDump, *hexHash;
    unsigned char binary[MAX_HASH_BIN];
    int nonce = 0;

    hexHash = (char*)malloc(MAX_HASH_HEX);

    do {
        if (RANDOM_NONCE) {
            nonce = rand();
        } else {
            nonce++;
        }

        json = createJSON(data, isGenesis, nonce, prevHash, signature, publicKey);
        jsonDump = json_dumps(json,  JSON_INDENT(2));
        getHash(jsonDump, hexHash, binary);
    } while (!checkHash(binary, difficulty));

    if (VERBOSE) {
        printf("%s\n", jsonDump);
    }

    FILE *file = fopen(hexHash, "w");
    fputs(jsonDump, file);
    return hexHash;
}

int checkHash(unsigned char *binary, int difficulty) {
    int i = 0, zeroBytes = difficulty / 8;
    for (; i < zeroBytes && i < MAX_HASH_BIN; i++) {
        if (binary[i] != (unsigned char)0) {
            return false;
        }
    }
    if (i < MAX_HASH_BIN) {
        return (binary[i] & (255 << (8 - difficulty%8))) == 0;
    } else {
        return false;
    }
}

void getHash(char *data, char *hex, unsigned char *binaryOut) {
    int length;
    unsigned char binary[crypto_generichash_BYTES];

    length = std::strlen(data);
    if (crypto_generichash(binary, sizeof(binary), (unsigned char *) data, length, NULL, 0)) {
        perror("Hashing");
    }
    sodium_bin2hex(hex, MAX_HASH_HEX, binary, sizeof(binary));
    memcpy(binaryOut, binary, MAX_HASH_BIN);
}

void generateKeyPair(KeyPair *keyPair) {
    keyPair->secretKey = (char *)malloc(MAX_SKEY_HEX);
    keyPair->publicKey = (char *)malloc(MAX_PKEY_HEX);
    keyPair->secretKeyBinary = (unsigned char*) malloc(crypto_sign_SECRETKEYBYTES);
    keyPair->publicKeyBinary = (unsigned char*) malloc(crypto_sign_PUBLICKEYBYTES);

    crypto_sign_keypair(keyPair->publicKeyBinary,keyPair->secretKeyBinary);

    sodium_bin2hex(keyPair->secretKey, MAX_SKEY_HEX, keyPair->secretKeyBinary, crypto_sign_SECRETKEYBYTES);
    sodium_bin2hex(keyPair->publicKey, MAX_PKEY_HEX, keyPair->publicKeyBinary, crypto_sign_PUBLICKEYBYTES);
}

void calculateBinaryKeys(KeyPair *keyPair) {
    keyPair->secretKeyBinary = (unsigned char*) malloc(crypto_sign_SECRETKEYBYTES);
    keyPair->publicKeyBinary = (unsigned char*) malloc(crypto_sign_PUBLICKEYBYTES);
    sodium_hex2bin(keyPair->publicKeyBinary, crypto_sign_PUBLICKEYBYTES, keyPair->publicKey, strlen(keyPair->publicKey), "", NULL, NULL);
    sodium_hex2bin(keyPair->secretKeyBinary, crypto_sign_SECRETKEYBYTES, keyPair->secretKey, strlen(keyPair->secretKey), "", NULL, NULL);
}

void signData(char *data, KeyPair *keyPair, char **signature) {
    unsigned char signatureBinary[crypto_sign_BYTES];
    *signature = (char*)malloc(SIG_HEX);

    crypto_sign_detached(signatureBinary, NULL, (unsigned char *)data, strlen(data), keyPair->secretKeyBinary);
    sodium_bin2hex(*signature, SIG_HEX, signatureBinary, crypto_sign_BYTES);
}

void verifyBlockSignature(json_t *jsonBlock, char *currentHash) {
    json_t *jsonData, *jsonSignature, *jsonPublicKey;
    const char *blockData, *blockSignature, *blockPublicKey;
    unsigned char signatureBinary[crypto_sign_BYTES], publicKeyBinary[crypto_sign_PUBLICKEYBYTES];

    jsonData = json_object_get(jsonBlock, "data");
    jsonSignature = json_object_get(jsonBlock, "signature");
    jsonPublicKey = json_object_get(jsonBlock, "public-key");
    blockData = json_string_value(jsonData);
    blockSignature = json_string_value(jsonSignature);
    blockPublicKey = json_string_value(jsonPublicKey);

    sodium_hex2bin(signatureBinary, crypto_sign_BYTES, blockSignature, strlen(blockSignature), "", NULL, NULL);
    sodium_hex2bin(publicKeyBinary, crypto_sign_PUBLICKEYBYTES, blockPublicKey, strlen(blockPublicKey), "", NULL, NULL);

    if (crypto_sign_verify_detached(signatureBinary, (unsigned char *) blockData, strlen(blockData), publicKeyBinary)) {
        fprintf(stderr, "ERROR: Validation failed, invalid signature for given data\nBlock ID: %s\n", currentHash);
        exit(-1);
    }

}

void parseValues(int argc, char **argv, char **data, int *difficulty, int *generateKeys, int *isGenesis, int *numBlocks, char **prevHash, KeyPair *keyPair, int *verifyBlockchain) {
    int opt, optionIndex = 0;


    static struct option longOptions[] = {
            {"data", required_argument, nullptr, 0},
            {"difficulty", required_argument, nullptr, 0},
            {"generate-keys", no_argument, nullptr, 0},
            {"genesis", no_argument, nullptr, 0},
            {"num-blocks", required_argument, nullptr, 0},
            {"prev-hash", required_argument, nullptr, 0},
            {"public-key", required_argument, nullptr, 0},
            {"secret-key", required_argument, nullptr, 0},
            {"verify-blockchain", no_argument, nullptr, 0}

    };

    while ((opt = getopt_long(argc, argv, "", longOptions, &optionIndex)) != -1) {
        switch (optionIndex) {
            case 0:
                *data = optarg;
                break;
            case 1:
                *difficulty = std::stoi(optarg);
                break;
            case 2:
                *generateKeys = 1;
                break;
            case 3:
                *isGenesis = 1;
                break;
            case 4:
                *numBlocks = std::stoi(optarg);
                break;
            case 5:
                *prevHash = optarg;
                break;
            case 6:
                keyPair->publicKey = optarg;
                break;
            case 7:
                keyPair->secretKey = optarg;
                break;
            case 8:
                *verifyBlockchain = 1;
                break;

            default:
                break;
        }
    }

//    if (*data == nullptr || *difficulty == 0 || *numBlocks == 0 || *prevHash == nullptr) {
//        printf("ERROR: Missing required argument\n");
//        exit(-1);
//    }
}

json_t* createJSON(char *data, int isGenesis, int nonce, char *prevHash, char *signature, char *publicKey) {
    char nonceS[MAX_DIGITS];

    sprintf(nonceS, "%d", nonce);
    json_t *root = json_object();
    json_object_set_new( root, "data", json_string(data));
    json_object_set_new( root, "nonce", json_string(nonceS));

    if (isGenesis) {
        json_object_set_new( root, "genesis", json_boolean(1));
    } else {
        json_object_set_new( root, "prev-hash", json_string(prevHash));
    }

    json_object_set_new( root, "signature", json_string(signature));
    json_object_set_new( root, "public-key", json_string(publicKey));

    return root;
}

void validateBlockchain(const char *startingBlockHash) {
    json_error_t error;
    json_t *jsonBlock;
    char currentHash[MAX_HASH_HEX], computedHash[MAX_HASH_HEX], *fileData;
    unsigned char binary[MAX_HASH_BIN];
    FILE *file;
    size_t fileSize;
    int count = 0;

    strcpy(currentHash, startingBlockHash);

    while ( 1 ) {
        file = fopen(currentHash, "r");
        fseek(file, 0, SEEK_END);
        fileSize = ftell(file);
        fseek(file, 0, SEEK_SET);
        fileData = (char*)malloc(fileSize+1);
        if (fileData) {
            fread(fileData, sizeof(char), fileSize, file);
            fileData[fileSize] = '\0';
        }

        if ((jsonBlock = json_loads(fileData, 0, &error)) == NULL) {
            fprintf(stderr, "ERROR: Validation failed, JSON parsing error at %d:%d of file: \"%s\"\n%s\n",error.line, error.column, error.text, currentHash);
            exit(-1);
        }

        getHash(fileData, computedHash, binary);
        if (strcmp(currentHash, computedHash) != 0) {
//            fprintf(stderr, "ERROR: Validation failed, block does not match block ID:\nBlock ID: \t\t %s\nComputed Hash: \t %s\n",currentHash, computedHash);
//            exit(-1);
        }

        verifyBlockSignature(jsonBlock, currentHash);

        free(fileData);
        count++;

        if (json_boolean_value(json_object_get(jsonBlock, "genesis"))) {
            printf("Blockchain of length %d Verified\n", count);
            break;
        } else {
            strcpy(currentHash, json_string_value(json_object_get(jsonBlock, "prev-hash")));
        }

    }
}
