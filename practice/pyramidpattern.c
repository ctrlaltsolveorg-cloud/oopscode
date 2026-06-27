#include<stdio.h>

int main() {

    int i, j, a = 4, t;

    for(i = 1; i <= a; i++) {


        for(t = 1; t <= a - i; t++) {
            printf("\t");
        }


        for(j = 1; j <= (2*i - 1); j++) {
            printf("*\t");
        }

        printf("\n");
    }

    return 0;
}
