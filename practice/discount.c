#include<stdio.h>
int main(){
    int nitem, price, discount, mrp, totalprice;
    printf("hii");
    scanf("%d%d%d", &nitem, &price, &discount);

    mrp = nitem * price;
    totalprice = mrp - mrp*discount/100;

    printf("%d", totalprice);

    return 0;
}