#include <stdio.h>

int main() {
    FILE *fptr;
    char name[50];
    int age;
    float salary;

    fptr = fopen("emp.txt", "w");
    if (fptr == NULL) {
        printf("Error opening file!\n");
        return 1;
    }

    printf("Enter name: ");
    scanf("%s", name);
    printf("Enter age: ");
    scanf("%d", &age);
    printf("Enter salary: ");
    scanf("%f", &salary);

    fprintf(fptr, "Name: %s\nAge: %d\nSalary: %.2f\n", name, age, salary);
    fclose(fptr);

    printf("Data successfully written to emp.txt\n");
    return 0;
}
