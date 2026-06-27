//write program to find exponential function
#include<stdio.h>
#include<math.h>
int main(){
    int a, i;
    float e=2.71828, b=1.0;
    printf("enter the power of e : ");
    scanf("%d", &a);
    
    for(i=1; i<=a; i++){
        b = b*e;
    }
    printf("%f", b);
    return 0;
}