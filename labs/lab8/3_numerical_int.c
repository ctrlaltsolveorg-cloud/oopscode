#include <stdio.h>
#include <math.h>

double f(double x) {
    return 1 / (1 + x * x); // Example function: f(x) = 1 / (1 + x^2)
}

int main() {
    double a, b;
    int n;
    printf("Enter lower limit of integration a: ");
    scanf("%lf", &a);
    printf("Enter upper limit of integration b: ");
    scanf("%lf", &b);
    printf("Enter number of sub-intervals n (even for Simpson's 1/3 rule): ");
    scanf("%d", &n);

    double h = (b - a) / n;
    double sum_trap = f(a) + f(b);
    double sum_simp = f(a) + f(b);

    for (int i = 1; i < n; i++) {
        double x = a + i * h;
        sum_trap += 2 * f(x);
        
        if (i % 2 == 0) {
            sum_simp += 2 * f(x);
        } else {
            sum_simp += 4 * f(x);
        }
    }

    double result_trap = (h / 2) * sum_trap;
    double result_simp = (h / 3) * sum_simp;

    printf("\nNumerical Integration Results:\n");
    printf("Trapezoidal Rule Result: %.6lf\n", result_trap);
    if (n % 2 == 0) {
        printf("Simpson's 1/3 Rule Result: %.6lf\n", result_simp);
    } else {
        printf("Simpson's 1/3 Rule cannot be applied (n is odd).\n");
    }

    return 0;
}
