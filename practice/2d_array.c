#include<stdio.h>
int main(){
    int a[10][10];
    int b[10][10];
    int i, j, k;
    printf("enter values in 2d array : ");
    for(i=0; i<10; i++){
        for (j=0; j<10; j++){
            scanf("%d", &a[i][j]);
        }
    }
    for(i=0; i<10; i++){
        for(j=0; j<10; j++){
            printf("%d\t", a[i][j]);
        }
    }
}
