#include <stdio.h>

double power(double x, int y) {
    if (y == 0)
        return 1;
    if (y > 0)
        return x * power(x, y - 1);
    else
        return 1 / power(x, -y);
}

int main() {
    double x;
    int y;
    printf("Enter base (x): ");
    scanf("%lf", &x);
    printf("Enter exponent (y): ");
    scanf("%d", &y);
    printf("%.2lf raised to the power %d is %.4lf\n", x, y, power(x, y));
    return 0;
}
