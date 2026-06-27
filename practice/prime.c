#include<stdio.h>
int main(){
    int i, j, a, b, d, n;
    printf("E N T E R   A   R A N G E ");
    printf("\nfrom : ");
    scanf("%d", &a);
    printf("to : ");
    scanf("%d", &b);
    
    d = 0;
    n = 0;
    for(i=a; i<=b; i++){
        d=0;
        for(j=1; j<=i; j++){
            if(i%j==0){
                d++;
            }
        }
        if(d==2){
            printf("%d\n", i);
            n++;
        }
        
    }

    printf("There are total %d prime numbers between %d and %d\n\n", n, a, b);

    return 0;
}