#include <stdio.h>
#include <math.h>

double f(double x) {
    return x * x * x + 2 * x * x + 3 * x + 5; // Example function: f(x) = x^3 + 2x^2 + 3x + 5
}

int main() {
    double x, h;
    printf("Enter the value of x at which derivative is to be calculated: ");
    scanf("%lf", &x);
    printf("Enter the step size h: ");
    scanf("%lf", &h);

    double forward = (f(x + h) - f(x)) / h;
    double backward = (f(x) - f(x - h)) / h;
    double central = (f(x + h) - f(x - h)) / (2 * h);

    printf("\nNumerical Differentiation Results at x = %.4lf with h = %.4lf:\n", x, h);
    printf("Forward Difference: %.6lf\n", forward);
    printf("Backward Difference: %.6lf\n", backward);
    printf("Central Difference: %.6lf\n", central);

    // Exact derivative for x^3 + 2x^2 + 3x + 5 is 3x^2 + 4x + 3
    double exact = 3 * x * x + 4 * x + 3;
    printf("Exact Derivative:    %.6lf\n", exact);

    return 0;
}
