#include <stdio.h>

void displayDigit(int digit) {
    switch (digit) {
        case 0: printf("Zero "); break;
        case 1: printf("One "); break;
        case 2: printf("Two "); break;
        case 3: printf("Three "); break;
        case 4: printf("Four "); break;
        case 5: printf("Five "); break;
        case 6: printf("Six "); break;
        case 7: printf("Seven "); break;
        case 8: printf("Eight "); break;
        case 9: printf("Nine "); break;
    }
}

int main() {
    int n, rev = 0, digit, temp, count = 0, zeros = 0;
    printf("Enter an integer: ");
    if (scanf("%d", &n) != 1) {
        printf("Invalid input.\n");
        return 1;
    }
    
    if (n < 0) {
        printf("Minus ");
        n = -n;
    }

    if (n == 0) {
        printf("Zero\n");
        return 0;
    }

    temp = n;
    // Count trailing zeros that might be lost in reversal
    while (temp > 0 && temp % 10 == 0) {
        zeros++;
        temp /= 10;
    }

    // Reverse the number
    temp = n;
    while (temp > 0) {
        rev = rev * 10 + (temp % 10);
        temp /= 10;
        count++;
    }

    // Print digits from reversed number
    while (rev > 0) {
        digit = rev % 10;
        displayDigit(digit);
        rev /= 10;
    }
    
    // Print the trailing zeros
    for (int i = 0; i < zeros; i++) {
        displayDigit(0);
    }
    
    printf("\n");
    return 0;
}
