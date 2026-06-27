#include <stdio.h>

int main() {
    char op;
    float num1, num2;
    printf("Enter an operator (+, -, *, /): ");
    scanf(" %c", &op);
    printf("Enter two operands: ");
    scanf("%f %f", &num1, &num2);

    switch (op) {
        case '+':
            printf("%f + %f = %f\n", num1, num2, num1 + num2);
            break;
        case '-':
            printf("%f - %f = %.2f\n", num1, num2, num1 - num2);
            break;
        case '*':
            printf("%f * %f = %f\n", num1, num2, num1 * num2);
            break;
        case '/':
            if (num2 != 0)
                printf("%f / %f = %f\n", num1, num2, num1 / num2);
            else
                printf("Error! Division by zero.\n");
            break;
        default:
            printf("Error! operator is not correct\n");
    }
    return 0;
}
