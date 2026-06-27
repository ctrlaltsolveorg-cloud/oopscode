#include <stdio.h>

int main() {
    char str[100];
    int length = 0;
    printf("Enter a string: ");
    scanf("%s", str);
    while (str[length] != '\0') {
        length++;
    }
    printf("Length of the string (without strlen): %d\n", length);
    printf("String passed to characters: ");
    for (int i = 0; i < length; i++) {
        printf("'%c' ", str[i]);
    }
    printf("\n");
    return 0;
}
