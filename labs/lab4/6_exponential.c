#include <stdio.h>
#include <math.h>

// Implementing e^x using Taylor series: 1 + x + x^2/2! + x^3/3! + ...
double exponential(float x, int n) {
    double sum = 1.0;
    double term = 1.0;
    for (int i = 1; i < n; i++) {
        term = term * x / i;
        sum += term;
    }
    return sum;
}

int main() {
    float x;
    int n = 20; // precision
    printf("Enter the value of x for e^x: ");
    scanf("%f", &x);
    printf("e^%.2f = %lf\n", x, exponential(x, n));
    return 0;
}
