#include <stdio.h>
#include <math.h>
#include <stdlib.h>

double f(double x) {
    return x * x - 4; // Example function f(x) = x^2 - 4
}

double df(double x) {
    return 2 * x; // Derivative f'(x) = 2x
}

void bisection() {
    double a, b, x, tol;
    int iter = 0;
    printf("Enter interval [a, b]: ");
    scanf("%lf %lf", &a, &b);
    printf("Enter tolerance: ");
    scanf("%lf", &tol);

    if (f(a) * f(b) >= 0) {
        printf("Bisection method fails. f(a) and f(b) must have opposite signs.\n");
        return;
    }

    printf("\nIter\t a\t\t b\t\t x\t\t f(x)\n");
    do {
        x = (a + b) / 2;
        printf("%d\t %.6lf\t %.6lf\t %.6lf\t %.6lf\n", iter++, a, b, x, f(x));
        if (f(a) * f(x) < 0)
            b = x;
        else
            a = x;
    } while (fabs(f(x)) > tol);

    printf("\nRoot: %.6lf\n", x);
}

void newtonRaphson() {
    double x0, x1, tol;
    int iter = 0;
    printf("Enter initial guess: ");
    scanf("%lf", &x0);
    printf("Enter tolerance: ");
    scanf("%lf", &tol);

    printf("\nIter\t x0\t\t f(x0)\t\t x1\n");
    do {
        if (df(x0) == 0) {
            printf("Derivative is zero. Newton-Raphson fails.\n");
            return;
        }
        x1 = x0 - f(x0) / df(x0);
        printf("%d\t %.6lf\t %.6lf\t %.6lf\n", iter++, x0, f(x0), x1);
        x0 = x1;
    } while (fabs(f(x1)) > tol);

    printf("\nRoot: %.6lf\n", x1);
}

void secant() {
    double x0, x1, x2, tol;
    int iter = 0;
    printf("Enter two initial guesses: ");
    scanf("%lf %lf", &x0, &x1);
    printf("Enter tolerance: ");
    scanf("%lf", &tol);

    printf("\nIter\t x0\t\t x1\t\t x2\t\t f(x2)\n");
    do {
        if (f(x1) - f(x0) == 0) {
            printf("Division by zero. Secant method fails.\n");
            return;
        }
        x2 = x1 - (f(x1) * (x1 - x0)) / (f(x1) - f(x0));
        printf("%d\t %.6lf\t %.6lf\t %.6lf\t %.6lf\n", iter++, x0, x1, x2, f(x2));
        x0 = x1;
        x1 = x2;
    } while (fabs(f(x2)) > tol);

    printf("\nRoot: %.6lf\n", x2);
}

int main() {
    int choice;
    while (1) {
        printf("\n--- Root Finding Methods ---\n");
        printf("1. Bisection Method\n");
        printf("2. Newton-Raphson Method\n");
        printf("3. Secant Method\n");
        printf("4. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: bisection(); break;
            case 2: newtonRaphson(); break;
            case 3: secant(); break;
            case 4: exit(0);
            default: printf("Invalid choice!\n");
        }
    }
    return 0;
}
