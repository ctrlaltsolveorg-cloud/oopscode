#include <stdio.h>

int main() {
    int n, i, low, high, mid, target, found = 0;
    printf("Enter number of elements: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Invalid input.\n");
        return 1;
    }
    int arr[n];
    printf("Enter %d sorted elements:\n", n);
    for (i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    printf("Enter number to search: ");
    scanf("%d", &target);
    
    low = 0;
    high = n - 1;
    while (low <= high) {
        mid = (low + high) / 2;
        if (arr[mid] == target) {
            printf("Element found at position %d\n", mid + 1);
            found = 1;
            break;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    if (!found) {
        printf("Element not found.\n");
    }
    return 0;
}
