#include <stdio.h>
#include <ctype.h>

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
        if (islower(ch)) {
            ch = toupper(ch);
        }
        fputc(ch, dest);
    }

    printf("File processed and case converted successfully.\n");

    fclose(source);
    fclose(dest);
    return 0;
}
