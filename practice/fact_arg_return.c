#include <stdio.h>
int fact(int);
int main() {
    
    int n; int f;
    printf("enter a value : ");
    scanf("%d", &n);
    f = fact(n);
    printf("%d", f);
    return 0;
}

int fact(int a){
    int factorial = 1;
    for(int i=a; i>0; i--){
        factorial = factorial * i;
    }
    
    return factorial;
}