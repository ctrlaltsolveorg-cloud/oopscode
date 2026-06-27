#include <stdio.h>

int main() {

    int n, i, pos;
    float element;


    printf("Enter number of elements: ");
    scanf("%d", &n);

    float arr[n + 1];


    printf("Enter elements:\n");

    for(i = 0; i < n; i++) {
        scanf("%f", &arr[i]);
    }


    printf("Enter position to insert element: ");
    scanf("%d", &pos);


    printf("Enter new element: ");
    scanf("%f", &element);


    for(i = n; i >= pos; i--) {
        arr[i] = arr[i - 1];
    }

  
    arr[pos - 1] = element;

    n++;

    printf("Array after insertion:\n");

    for(i = 0; i < n; i++) {
        printf("%.2f ", arr[i]);
    }

    return 0;
}
