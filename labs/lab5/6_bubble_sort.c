#include <stdio.h>

int main() {
    int n, i, j;
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
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    printf("Sorted array (Bubble Sort):\n");
    for (i = 0; i < n; i++) {
        printf("%.2f ", arr[i]);
    }
    printf("\n");
    return 0;
}
