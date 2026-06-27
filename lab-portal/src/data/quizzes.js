export const quizzes = {
  "2": [
    {
      "question": "Which of the following data types in C usually occupies 4 bytes of memory?",
      "options": [
        "char",
        "int",
        "double",
        "float"
      ],
      "answer": 1,
      "explanation": "On most modern systems, 'int' occupies 4 bytes (32 bits), 'char' occupies 1 byte, 'double' occupies 8 bytes, and 'float' occupies 4 bytes. In multiple choice, 'int' and 'float' both do, but 'int' is the standard primary integer type."
    },
    {
      "question": "What will be the result of the arithmetic expression 17 % 5 in C?",
      "options": [
        "3.4",
        "3",
        "2",
        "0"
      ],
      "answer": 2,
      "explanation": "The modulus operator (%) returns the remainder of integer division. 17 divided by 5 is 3 with a remainder of 2."
    },
    {
      "question": "How do you cast an integer variable 'sum' to float in C?",
      "options": [
        "(float)sum",
        "float(sum)",
        "cast<float>(sum)",
        "sum(float)"
      ],
      "answer": 0,
      "explanation": "In C, explicit type casting is done by placing the target type name in parentheses before the expression: (float)sum."
    }
  ],
  "3": [
    {
      "question": "Which logical operator represents logical AND in C?",
      "options": [
        "&",
        "&&",
        "|",
        "||"
      ],
      "answer": 1,
      "explanation": "&& is the logical AND operator. & is the bitwise AND operator."
    },
    {
      "question": "What is the purpose of the 'break' statement in a switch block?",
      "options": [
        "To terminate the entire program",
        "To skip the next statement and continue evaluating case statements",
        "To prevent fall-through and exit the switch block immediately",
        "To restart the switch block evaluation"
      ],
      "answer": 2,
      "explanation": "Without a break statement, control falls through to the next case block regardless of whether it matches, executing subsequent cases. 'break' exits the switch block immediately."
    },
    {
      "question": "What is the value of a condition in C if it evaluates to true?",
      "options": [
        "Any non-zero value",
        "Only 1",
        "Any positive number",
        "true keyword"
      ],
      "answer": 0,
      "explanation": "In C, there was historically no native boolean type. Any non-zero value (including negative values) represents 'true', and zero represents 'false'."
    }
  ],
  "4": [
    {
      "question": "Which loop structure in C is guaranteed to execute at least once?",
      "options": [
        "for",
        "while",
        "do-while",
        "None of the above"
      ],
      "answer": 2,
      "explanation": "A do-while loop evaluates its condition at the end of the loop, meaning the loop body executes at least once before checking the condition."
    },
    {
      "question": "What is the difference between 'break' and 'continue' in loops?",
      "options": [
        "break restarts the loop, continue exits it",
        "break exits the loop completely, continue skips the rest of the current iteration and jumps to the next cycle",
        "break skips the current iteration, continue exits the loop",
        "There is no difference"
      ],
      "answer": 1,
      "explanation": "break terminates the loop immediately, whereas continue skips the remaining code in the loop body for the current cycle and goes directly to the increment/condition step."
    },
    {
      "question": "What is the output of the loop: for(int i=0; i<5; i+=2) console printf?",
      "options": [
        "0 1 2 3 4",
        "0 2 4",
        "0 2 4 6",
        "2 4"
      ],
      "answer": 1,
      "explanation": "The loop starts at i = 0, increments by 2 each iteration (i += 2), and runs as long as i < 5. The values printed are 0, 2, and 4. When i becomes 6, the condition i < 5 is false, and the loop terminates."
    }
  ],
  "5": [
    {
      "question": "If an array 'arr' has size 10, what is the valid index range of its elements?",
      "options": [
        "1 to 10",
        "0 to 10",
        "0 to 9",
        "-1 to 9"
      ],
      "answer": 2,
      "explanation": "In C, arrays are zero-indexed. An array of size N has indices ranging from 0 to N-1. Therefore, for size 10, the range is 0 to 9."
    },
    {
      "question": "What is the time complexity of the binary search algorithm in the worst case?",
      "options": [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      "answer": 1,
      "explanation": "Binary search divides the search range in half in each step. This leads to a logarithmic time complexity of O(log N). However, it requires the array to be sorted beforehand."
    },
    {
      "question": "Which sorting algorithm repeatedly compares adjacent elements and swaps them if they are in the wrong order?",
      "options": [
        "Selection Sort",
        "Insertion Sort",
        "Bubble Sort",
        "Quick Sort"
      ],
      "answer": 2,
      "explanation": "Bubble sort works by bubbling up the largest values to the end of the array by comparing and swapping adjacent items in multiple passes."
    }
  ],
  "6": [
    {
      "question": "How does C mark the end of a string in memory?",
      "options": [
        "With a period '.'",
        "With a newline character '\\n'",
        "With a null terminator character '\\0'",
        "With an EOF marker"
      ],
      "answer": 2,
      "explanation": "Strings in C are character arrays that use the null character '\\0' (ASCII code 0) to signal the end of the character sequence."
    },
    {
      "question": "If char s[] = \"Hello\"; what is the size of the array 's' in bytes?",
      "options": [
        "5",
        "6",
        "4",
        "Undefined"
      ],
      "answer": 1,
      "explanation": "Although 'Hello' has 5 letters, C automatically appends the null character '\\0' at the end, so the total array size allocated is 6 bytes."
    },
    {
      "question": "If matrix is declared as 'int m[3][4]', how many integers can it store?",
      "options": [
        "7",
        "12",
        "16",
        "3"
      ],
      "answer": 1,
      "explanation": "A 2D array m[3][4] has 3 rows and 4 columns, which stores 3 * 4 = 12 integer values in contiguous memory."
    }
  ],
  "7": [
    {
      "question": "What happens when you pass arguments in a 'Call by Value' function in C?",
      "options": [
        "The function receives the memory addresses of the original variables",
        "The function receives copies of the variables, and changes do not affect the original variables",
        "The program automatically crashes if variables are changed",
        "The function returns multiple values"
      ],
      "answer": 1,
      "explanation": "In call by value, copies of the values of the arguments are passed to the function parameters. Modifying these parameters inside the function only changes the local copies and does not modify the variables in the calling function."
    },
    {
      "question": "What is a function prototype in C?",
      "options": [
        "The original design document of the function",
        "The definition block containing the code",
        "A declaration that informs the compiler about the function's name, return type, and arguments before its definition",
        "The line of code that calls the function"
      ],
      "answer": 2,
      "explanation": "A function prototype (or declaration) tells the compiler what type of values the function returns and what parameters it accepts. This allows the function to be called before its full definition is compiled."
    }
  ],
  "8": [
    {
      "question": "In the Newton-Raphson method for root finding, what is the formula to compute the next approximation?",
      "options": [
        "x_new = (x_old + f(x_old)) / 2",
        "x_new = x_old - f(x_old) / f'(x_old)",
        "x_new = x_old - f'(x_old) / f(x_old)",
        "x_new = x_old + f(x_old) * f'(x_old)"
      ],
      "answer": 1,
      "explanation": "The Newton-Raphson formula is x_{n+1} = x_n - f(x_n)/f'(x_n). It uses the derivative at the current guess to project a tangent line to the x-axis."
    },
    {
      "question": "Which integration rule is based on approximating the area under curves using trapezoids instead of rectangles?",
      "options": [
        "Simpson's 1/3 Rule",
        "Simpson's 3/8 Rule",
        "Trapezoidal Rule",
        "Euler's Method"
      ],
      "answer": 2,
      "explanation": "The Trapezoidal Rule divides the area under a curve into multiple trapezoids, calculating their heights based on function values at grid boundaries."
    }
  ],
  "9": [
    {
      "question": "What happens if a recursive function does not have a base case?",
      "options": [
        "It will compile but throw a warning",
        "It will run in an infinite loop (and eventually crash due to stack overflow)",
        "It will execute once and terminate safely",
        "The compiler will fail to build the program"
      ],
      "answer": 1,
      "explanation": "Without a base case to terminate recursive calls, the function will call itself infinitely. Each call uses memory on the execution stack, which eventually leads to a 'Stack Overflow' crash."
    },
    {
      "question": "What data structure is used by the system memory to keep track of recursive function calls?",
      "options": [
        "Queue",
        "Tree",
        "Stack",
        "Linked List"
      ],
      "answer": 2,
      "explanation": "The system call stack is used. Every time a function is called, its state (local variables, parameters, return address) is pushed onto the stack. When the function returns, its frame is popped."
    }
  ],
  "10": [
    {
      "question": "What is the value of the pointer dereference expression '*ptr' if ptr contains the address of 'int x = 20'?",
      "options": [
        "The address of x",
        "20",
        "ptr value",
        "NULL"
      ],
      "answer": 1,
      "explanation": "The dereference operator (*) accesses the value stored at the address contained in the pointer. If ptr points to x, *ptr evaluates to the value of x, which is 20."
    },
    {
      "question": "Which C standard library function is used to dynamically allocate memory at runtime and initializes it to zero?",
      "options": [
        "malloc()",
        "calloc()",
        "realloc()",
        "free()"
      ],
      "answer": 1,
      "explanation": "calloc() allocates memory and automatically initializes all bytes to 0, whereas malloc() leaves the allocated memory uninitialized (containing garbage values)."
    },
    {
      "question": "Which operator is used to access structure members when working with a pointer to a structure?",
      "options": [
        "The dot operator (.)",
        "The asterisk operator (*)",
        "The arrow operator (->)",
        "The ampersand operator (&)"
      ],
      "answer": 2,
      "explanation": "The arrow operator (->) is syntactic shorthand for dereferencing a structure pointer and accessing a member: e.g., ptr->member is equivalent to (*ptr).member."
    }
  ],
  "11": [
    {
      "question": "What does the file mode 'a' represent in fopen()?",
      "options": [
        "Read-only mode",
        "Write-only mode (overwriting existing content)",
        "Append mode (writing data at the end of the file)",
        "Binary read-write mode"
      ],
      "answer": 2,
      "explanation": "The 'a' mode stands for append. If the file exists, written data is added to the end. If the file does not exist, a new file is created."
    },
    {
      "question": "What value does fopen() return if it fails to open a file (e.g., file not found in read mode)?",
      "options": [
        "-1",
        "0",
        "NULL",
        "EOF"
      ],
      "answer": 2,
      "explanation": "If fopen() fails, it returns a NULL pointer, which can be checked to ensure the file pointer is safe to use: if (fptr == NULL) { /* handle error */ }."
    }
  ]
};
