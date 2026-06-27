// Write a program to print numbers from 1 to 10 but stop when number becomes
#include<stdio.h>
int main(){
    for(int i=1; i<=10; i++){
        printf("%d \n", i);
        if(i==6){
            break;
        }
    }
    return 0;
}