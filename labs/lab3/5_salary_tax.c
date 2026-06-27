#include <stdio.h>

int main() {
    float basic_salary, net_salary, tax;
    printf("Enter basic salary: ");
    scanf("%f", &basic_salary);

    if (basic_salary > 20000) {
        tax = 0.20 * basic_salary;
    } else {
        tax = 0.15 * basic_salary;
    }

    net_salary = basic_salary - tax;
    printf("Basic Salary: %.2f\n", basic_salary);
    printf("Tax Deducted: %.2f\n", tax);
    printf("Net Salary: %.2f\n", net_salary);
    return 0;
}
