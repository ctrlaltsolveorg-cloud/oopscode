#include <stdio.h>
#include <ctype.h>

int main() {
    char str[100];
    int count = 0, i = 0;
    printf("Enter a string: ");
    scanf("%s", str);
    while (str[i] != '\0') {
        char ch = tolower(str[i]);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            count++;
        }
        i++;
    }
    printf("Number of vowels in the string: %d\n", count);
    return 0;
}
