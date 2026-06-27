#include <stdio.h>

struct Employee {
    int id;
    char name[50];
    float salary;
};

int main() {
    int n;
    printf("Enter number of employees: ");
    scanf("%d", &n);
    struct Employee employees[n];

    for (int i = 0; i < n; i++) {
        printf("\nEnter details for employee %d:\n", i + 1);
        printf("ID: ");
        scanf("%d", &employees[i].id);
        printf("Name: ");
        scanf("%s", employees[i].name);
        printf("Salary: ");
        scanf("%f", &employees[i].salary);
    }

    printf("\nEmployee Details:\n");
    printf("ID\tName\t\tSalary\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%s\t\t%.2f\n", employees[i].id, employees[i].name, employees[i].salary);
    }

    return 0;
}
