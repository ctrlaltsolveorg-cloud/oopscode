#include <stdio.h>

int main() {
    int a[5], max, i;
    printf("Enter 5 numbers: ");
    for (i = 0; i < 5; i++) {
        scanf("%d", &a[i]);
    }
    max = a[0];
    for (i = 1; i < 5; i++) {
        if (a[i] > max)
            max = a[i];
    }
    printf("Greatest number is: %d\n", max);
    return 0;
}
