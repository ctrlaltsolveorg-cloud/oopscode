// Fibonacci series 
#include <stdio.h>

int fibb(int a);

int main() {
    int n, i;
    printf("enter a number : ");
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        printf("%d\t", fibb(i));
    }
    printf("\n");
    return 0;
}

int fibb(int a) {
    if (a == 0) {
        return 0;
    }
    else if (a == 1) {
        return 1;
    }
    else {
        return fibb(a - 1) + fibb(a - 2);
    }
}
