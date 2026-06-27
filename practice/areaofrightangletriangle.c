#include<stdio.h>       //start
int main(){             // function
    int p, b;           //variables
    int area;           //variable


    printf("enter the p and b of the triangle : ");  //output     
    scanf("%d%d", &p, &b/* inline comment */);                           //input

    area = p*b/2;      //process

    printf("area of the triangle is : %d", area);    //main output
    
    
    return 0;          //end.


}