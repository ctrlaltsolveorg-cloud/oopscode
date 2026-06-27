// #include <stdio.h>

// int main() {
//     int n, i, count = 0;
//     float target;
//     printf("Enter number of elements: ");
//     if (scanf("%d", &n) != 1 || n <= 0) {
//         printf("Invalid input.\n");
//         return 1;
//     }
//     float arr[n];
//     printf("Enter elements:\n");
//     for (i = 0; i < n; i++) {
//         scanf("%f", &arr[i]);
//     }
//     printf("Enter the element to find frequency: ");
//     scanf("%f", &target);
//     for (i = 0; i < n; i++) {
//         if (arr[i] == target) {
//             count++;
//         }
//     }
//     printf("Element %.2f exists %d times.\n", target, count);
//     return 0;
// }

#include <stdio.h>

int main() {

    int n, i;
    int count = 0;
    float victm;

    printf("Enter number of elements: ");
    scanf("%d", &n);

    int arr[n];


    printf("Enter elements:\n");

    for(i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }


    printf("Enter element to find: ");
    scanf("%d", &victm);


    for(i = 0; i < n; i++) {

        if(arr[i] == victm) {
            count++;
        }

    }

    printf("Element %d occurs %d times", victm, count);

    return 0;
}
