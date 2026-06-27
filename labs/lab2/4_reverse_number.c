#include <stdio.h>

int main() {
    int num, rev = 0, temp;
    printf("Enter a 5-digit number: ");
    scanf("%d", &num);
    temp = num;
    while (temp > 0) {
        rev = rev * 10 + (temp % 10);
        temp /= 10;
    }
    printf("Reverse of %d is %d\n", num, rev);
    return 0;
}