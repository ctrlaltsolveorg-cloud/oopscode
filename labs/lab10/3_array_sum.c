#include <stdio.h>

int calculateSum(int *ptr, int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += *(ptr + i);
    }
    return sum;
}

int main() {
    int n;
    printf("Enter number of elements: ");
    scanf("%d", &n);
    int arr[n];
    printf("Enter %d elements:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    int totalSum = calculateSum(arr, n);
    printf("Sum of all elements: %d\n", totalSum);

    return 0;
}
