#include <stdio.h>
#include <math.h>

void circle() {
    float r;
    printf("Enter radius of circle: ");
    scanf("%f", &r);
    printf("Circle Area: %.2f, Perimeter: %.2f\n", 3.14159 * r * r, 2 * 3.14159 * r);
}

void rectangle() {
    float l, b;
    printf("Enter length and breadth of rectangle: ");
    scanf("%f %f", &l, &b);
    printf("Rectangle Area: %.2f, Perimeter: %.2f\n", l * b, 2 * (l + b));
}

void square() {
    float s;
    printf("Enter side of square: ");
    scanf("%f", &s);
    printf("Square Area: %.2f, Perimeter: %.2f\n", s * s, 4 * s);
}

void triangle() {
    float a, b, c, s, area;
    printf("Enter three sides of triangle: ");
    scanf("%f %f %f", &a, &b, &c);
    if (a + b > c && a + c > b && b + c > a) {
        s = (a + b + c) / 2;
        area = sqrt(s * (s - a) * (s - b) * (s - c));
        printf("Triangle Area: %.2f, Perimeter: %.2f\n", area, a + b + c);
    } else {
        printf("Invalid triangle sides!\n");
    }
}

int main() {
    int choice;
    do {
        printf("\n--- Area and Perimeter Menu ---\n");
        printf("1. Circle\n2. Rectangle\n3. Square\n4. Triangle\n5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);
        switch (choice) {
            case 1: circle(); break;
            case 2: rectangle(); break;
            case 3: square(); break;
            case 4: triangle(); break;
            case 5: printf("Exiting...\n"); break;
            default: printf("Invalid choice!\n");
        }
    } while (choice != 5);
    return 0;
}
