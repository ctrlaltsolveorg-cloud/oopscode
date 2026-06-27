#include <stdio.h>
#include <math.h>

void decimalToBinary(int n) {
    long long binary = 0;
    int rem, i = 1;
    int temp = n;
    while (n != 0) {
        rem = n % 2;
        n /= 2;
        binary += rem * i;
        i *= 10;
    }
    printf("Decimal %d to Binary: %lld\n", temp, binary);
}

void binaryToDecimal(long long n) {
    int decimal = 0, i = 0, rem;
    long long temp = n;
    while (n != 0) {
        rem = n % 10;
        n /= 10;
        decimal += rem * pow(2, i);
        ++i;
    }
    printf("Binary %lld to Decimal: %d\n", temp, decimal);
}

int main() {
    int dec;
    long long bin;
    int choice;
    printf("1. Decimal to Binary\n2. Binary to Decimal\nEnter choice: ");
    scanf("%d", &choice);
    if (choice == 1) {
        printf("Enter decimal: ");
        scanf("%d", &dec);
        decimalToBinary(dec);
    } else if (choice == 2) {
        printf("Enter binary: ");
        scanf("%lld", &bin);
        binaryToDecimal(bin);
    }
    return 0;
}
