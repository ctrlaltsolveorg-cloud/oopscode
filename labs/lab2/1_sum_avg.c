#include <stdio.h>

int main() {
    float num1, num2, sum, avg;
    printf("Enter two numbers: ");
    scanf("%f %f", &num1, &num2);
    sum = num1 + num2;
    avg = sum / 2;
    printf("Sum: %.2f\n", sum);
    printf("Average: %.2f\n", avg);
    return 0;
}