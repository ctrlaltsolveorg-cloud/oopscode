#include <stdio.h>

int main() {
    char *names[] = {
        "Alice",
        "Bob",
        "Charlie",
        "Diana"
    };
    int count = sizeof(names) / sizeof(names[0]);

    printf("Array of pointers (strings):\n");
    for (int i = 0; i < count; i++) {
        printf("Name[%d]: %s, stored at address: %p\n", i, names[i], (void*)names[i]);
    }

    return 0;
}
