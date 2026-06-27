#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE *source, *dest;
    char source_name[100], dest_name[100], ch;

    printf("Enter source file name: ");
    scanf("%s", source_name);
    source = fopen(source_name, "r");
    if (source == NULL) {
        printf("Could not open source file %s\n", source_name);
        return 1;
    }

    printf("Enter destination file name: ");
    scanf("%s", dest_name);
    dest = fopen(dest_name, "w");
    if (dest == NULL) {
        printf("Could not open destination file %s\n", dest_name);
        fclose(source);
        return 1;
    }

    while ((ch = fgetc(source)) != EOF) {
        fputc(ch, dest);
    }

    printf("File copied successfully.\n");

    fclose(source);
    fclose(dest);
    return 0;
}
