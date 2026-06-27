#include <stdio.h>

int main() {
    int n, i, j;
    float key;
    printf("Enter number of elements: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Invalid input.\n");
        return 1;
    }
    float arr[n];
    printf("Enter elements:\n");
    for (i = 0; i < n; i++) {
        scanf("%f", &arr[i]);
    }
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    printf("Sorted array (Insertion Sort):\n");
    for (i = 0; i < n; i++) {
        printf("%.2f ", arr[i]);
    }
    printf("\n");
    return 0;
}
