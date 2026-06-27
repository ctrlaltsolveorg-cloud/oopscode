#include <stdio.h>
int main() {
    int num, sum = 0, temp;
    printf("Enter a 5-digit number: ");
    scanf("%d", &num);
    temp = num;
    while (temp > 0) {
        sum += temp % 10;
        temp /= 10;
    }
    printf("Sum of digits of %d is %d\n", num, sum);
    return 0;
}
