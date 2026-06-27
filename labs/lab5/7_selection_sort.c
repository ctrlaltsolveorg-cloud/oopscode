#include <stdio.h>

int main() {
    int n, i, j, min_idx;
    printf("Enter number of elements: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Invalid input.\n");
        return 1;
    }
    float arr[n], temp;
    printf("Enter elements:\n");
    for (i = 0; i < n; i++) {
        scanf("%f", &arr[i]);
    }
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
    printf("Sorted array (Selection Sort):\n");
    for (i = 0; i < n; i++) {
        printf("%.2f ", arr[i]);
    }
    printf("\n");
    return 0;
}
