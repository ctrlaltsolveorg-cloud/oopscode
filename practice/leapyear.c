#include<stdio.h>
int main(){
    int a;
    printf("enter a year : ");
    scanf("%d", &a);
    a = a - (a % 10);
    printf("%d", a);
    return 0;
}