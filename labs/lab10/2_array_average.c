#include <stdio.h>
#include <stdlib.h>

double* calculateAverage(int *arr, int size) {
    static double avg;
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += *(arr + i);
    }
    avg = (double)sum / size;
    return &avg;
}

int main() {
    int n;
    printf("Enter number of elements: ");
    scanf("%d", &n);
    int *arr = (int*)malloc(n * sizeof(int));
    printf("Enter %d elements:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", arr + i);
    }

    double *result = calculateAverage(arr, n);
    printf("Average: %.2lf\n", *result);

    free(arr);
    return 0;
}
