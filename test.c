#include <stdio.h>

int main() {
    int n = 5;
    int k;

    for (int i = 1; i <= n; i++) {
        k = i;
        for (int space = 0; space < i - 1; space++) {
            printf(" ");
        }
        for (int j = i; j <= n; j++) {
            printf("%d ", k);
            k = k + i;
        }
        printf("\n");
    }

    return 0;
}
