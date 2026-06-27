#include <stdio.h>

int main() {
    FILE *fptr;
    char filename[100];
    long size;

    printf("Enter filename to find its size: ");
    scanf("%s", filename);

    fptr = fopen(filename, "r");
    if (fptr == NULL) {
        printf("Could not open file %s\n", filename);
        return 1;
    }

    fseek(fptr, 0, SEEK_END);
    size = ftell(fptr);
    fclose(fptr);

    printf("Size of file %s is %ld bytes.\n", filename, size);

    return 0;
}
