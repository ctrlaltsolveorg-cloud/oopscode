#include <stdio.h>

struct Student {
    char name[50];
    int marks[5];
    int total;
    float percentage;
};

int main() {
    int n;
    printf("Enter number of students: ");
    scanf("%d", &n);
    struct Student students[n];

    for (int i = 0; i < n; i++) {
        printf("\nEnter name of student %d: ", i + 1);
        scanf("%s", students[i].name);
        printf("Enter marks in 5 subjects:\n");
        students[i].total = 0;
        for (int j = 0; j < 5; j++) {
            scanf("%d", &students[i].marks[j]);
            students[i].total += students[i].marks[j];
        }
        students[i].percentage = (float)students[i].total / 5;
    }

    printf("\nStudent Performance:\n");
    printf("Name\t\tTotal\tPercentage\n");
    for (int i = 0; i < n; i++) {
        printf("%s\t\t%d\t%.2f%%\n", students[i].name, students[i].total, students[i].percentage);
    }

    return 0;
}
