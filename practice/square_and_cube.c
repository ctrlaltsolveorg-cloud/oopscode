//program to find square and cube of number 1 to 10
#include<stdio.h>
#include<math.h>
int main(){
    int i, a, b;

    printf("THE SQUARE AND CUBE OF NUMNER FROM 1 TO 10");
    for(i=1; i<=10; i++){
        a = i*i;
        printf("square of %d is %d", i, a);
    }
    return 0;
}

