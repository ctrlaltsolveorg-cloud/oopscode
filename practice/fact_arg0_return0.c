#include <stdio.h>
void fact();
int main() {
    fact();
    return 0;
}

void fact(){
    int a;
    printf("enter a value : ");
    scanf("%d", &a);
    int factorial = 1;
    for(int i=a; i>0; i--){
        factorial = factorial * i;
    }
    printf("%d",factorial);
    return;
}