#include<stdio.h>
int main(){
    int a, b;
    printf("enter two numbers : ");
    scanf("%d %d", &a, &b);
    if(a>b){
        printf("%d is the greater then %d", a, b);
    }
    else if(a<b){
        printf("%d is the smaller then %d", a, b);
    }
    else{
        printf("both numbers %d and %d are equal", a, b);
    }
    return 0;
}