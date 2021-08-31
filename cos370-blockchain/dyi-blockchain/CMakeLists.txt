cmake_minimum_required(VERSION 3.16)
project(dyi_blockchain)

set(CMAKE_CXX_STANDARD 14)

add_executable(dyi_blockchain main.cpp)
include_directories("/usr/local/opt/jansson/include")
target_link_libraries(dyi_blockchain "/usr/local/opt/jansson/lib/libjansson.4.dylib")

include_directories("/usr/local/opt/libsodium/include")
target_link_libraries(dyi_blockchain "/usr/local/opt/libsodium/lib/libsodium.dylib")
