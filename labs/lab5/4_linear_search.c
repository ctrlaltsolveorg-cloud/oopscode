#include <stdio.h>

int main() {

    int n, i;
    int found = 0;
    float target;

    printf("Enter number of elements: ");
    scanf("%d", &n);

    int arr[n];

    printf("Enter elements:\n");

    for(i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    printf("Enter number to search: ");
    scanf("%d", &target);

    for(i = 0; i < n; i++) {

        if(arr[i] == target) {
            printf("Element found at position %d", i + 1);
            found = found + 1;
        }
        else{
            found = 0;
        }

    }

    if(found == 0) {
        printf("not found");
    }

    return 0;
}