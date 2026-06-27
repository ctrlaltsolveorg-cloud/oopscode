#include<stdio.h>
int main(){
    int a;
    printf("enter your age : ");
    scanf("%d", &a);
    if(a>=18){
        printf("you're eligible to vote");
    }
    else{
        printf("you're not eligible to vote");
    }
    return 0;
}