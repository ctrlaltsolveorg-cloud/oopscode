#include <stdio.h>
void fact(int);
int main() {
    
    int n; int f;
    printf("enter a value : ");
    scanf("%d", &n);
    fact(n);
    return 0;
}

void fact(int a){
    int factorial = 1;
    for(int i=a; i>0; i--){
        factorial = factorial * i;
    }
    printf("%d", factorial);
    return;
}