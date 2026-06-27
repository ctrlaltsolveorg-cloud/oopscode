#include <stdio.h>
int fact();
int main() {
    int f = fact();
    //printf("%d",f);
    return 0;
}

int fact(){
    int a;
    printf("enter a value : ");
    scanf("%d", &a);
    int factorial = 1;
    for(int i=a; i>0; i--){
        factorial = factorial * i;
    }
    return factorial;
}