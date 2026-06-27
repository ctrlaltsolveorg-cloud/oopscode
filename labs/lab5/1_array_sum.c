#include <stdio.h>

int main() {
    int n, i;
    float sum = 0;
    printf("Enter the number of elements in the array: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Invalid input.\n");
        return 1;
    }
    float arr[n];
    printf("Enter %d elements:\n", n);
    for (i = 0; i < n; i++) {
        if (scanf("%f", &arr[i]) != 1) {
            printf("Invalid input.\n");
            return 1;
        }
        sum += arr[i];
    }
    printf("Sum of elements = %.2f\n", sum);
    return 0;
}
