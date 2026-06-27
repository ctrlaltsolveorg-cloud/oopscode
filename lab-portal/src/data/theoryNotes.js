export const theoryNotes = {
  "2": {
    "concept": "Variables & Arithmetic Expressions",
    "summary": "Variables are named memory locations used to store data that can be manipulated during program execution. In C, variables must be declared with a specific data type before use.",
    "keyPoints": [
      "Data Types: basic types include int (integers), float (single-precision decimal), double (double-precision decimal), and char (single characters).",
      "Arithmetic Operators: +, -, *, /, % (modulus: returns the remainder of division).",
      "Type Conversions: Implicit conversion (done automatically by compiler, e.g., float x = 5) and Explicit conversion (type casting, e.g., (float)a / b).",
      "Format Specifiers: %d for integers, %f for float, %c for char, and %lf for double."
    ],
    "explanation": "\n      <h4>Modulus Operator (%)</h4>\n      <p>The modulus operator is extremely useful for extracting digits. For example, <code>123 % 10</code> gives <code>3</code> (the last digit), and <code>123 / 10</code> gives <code>12</code> (removes the last digit).</p>\n      \n      <h4>Input/Output</h4>\n      <p><code>printf()</code> displays output on the screen, while <code>scanf()</code> reads formatted input from the keyboard. Always pass the memory address using the address-of operator (<code>&amp;</code>) in <code>scanf()</code> (e.g. <code>scanf(\"%d\", &amp;num)</code>).</p>\n    "
  },
  "3": {
    "concept": "Branching & Logical Expressions",
    "summary": "Branching allows a program to decide which path of execution to take based on logical conditions. In C, this is achieved using if, else if, else, and switch-case structures.",
    "keyPoints": [
      "if Statement: Executes a block of code if the condition evaluates to true (non-zero).",
      "if-else & Nested if: Provides alternative paths of execution.",
      "switch-case: Evaluates a variable against multiple constant values. Requires 'break' to prevent fall-through.",
      "Logical Operators: && (AND - both conditions true), || (OR - at least one true), and ! (NOT - negates condition)."
    ],
    "explanation": "\n      <h4>Switch vs If-Else</h4>\n      <p>Use <code>switch</code> when matching a single expression against discrete integer or character constants. It is often faster and cleaner than long <code>if-else if</code> chains.</p>\n      \n      <h4>Common Mistake: Assign vs Compare</h4>\n      <p>A classic bug in C is using single equals <code>=</code> (assignment) instead of double equals <code>==</code> (equality comparison) inside conditions (e.g., <code>if (x = 5)</code> will assign 5 to x and evaluate to true, whereas <code>if (x == 5)</code> compares x to 5).</p>\n    "
  },
  "4": {
    "concept": "Loops (Iterative Control)",
    "summary": "Loops repeat a block of statements until a termination condition is met. They are essential for handling collections, mathematical series, and repeating user-driven actions.",
    "keyPoints": [
      "while Loop: Pre-test loop. Evaluates condition before executing loop body.",
      "for Loop: Pre-test loop containing initialization, condition, and increment/decrement in one line.",
      "do-while Loop: Post-test loop. Executes the body at least once, evaluating the condition at the end.",
      "Loop Control: 'break' exits the loop immediately; 'continue' skips the rest of the current iteration and jumps to the next loop cycle."
    ],
    "explanation": "\n      <h4>Prime Check Algorithm</h4>\n      <p>To check if a number <code>n</code> is prime, we loop from <code>2</code> to <code>sqrt(n)</code> (or <code>n/2</code>). If <code>n</code> is divisible by any of these numbers, it is not prime. If we complete the loop without finding any factors, the number is prime.</p>\n      \n      <h4>Fibonacci Sequence</h4>\n      <p>A series where each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13... We keep track of the last two values (e.g., <code>t1 = 0, t2 = 1</code>) and compute <code>nextTerm = t1 + t2</code> in a loop.</p>\n    "
  },
  "5": {
    "concept": "1D Array Manipulation",
    "summary": "An array is a contiguous memory sequence storing multiple elements of the same data type. Elements are accessed using zero-based indexing.",
    "keyPoints": [
      "Declaration: e.g., <code>int numbers[10];</code> reserves space for 10 integers.",
      "Indexing: Ranges from <code>0</code> to <code>size - 1</code>.",
      "Linear Search: Scanning each element sequentially (Time Complexity: O(N)).",
      "Binary Search: Highly efficient search on *sorted* arrays by repeatedly halving the search range (Time Complexity: O(log N))."
    ],
    "explanation": "\n      <h4>Array Sorting Algorithms</h4>\n      <ul>\n        <li><strong>Bubble Sort:</strong> Repeatedly swaps adjacent elements if they are in the wrong order. Time Complexity: O(N²).</li>\n        <li><strong>Selection Sort:</strong> Finds the smallest element from the unsorted part and swaps it to the front. Time Complexity: O(N²).</li>\n        <li><strong>Insertion Sort:</strong> Builds the sorted array element by element, shifting unsorted items into their correct position. Time Complexity: O(N²).</li>\n      </ul>\n      \n      <h4>Array Boundaries Warning</h4>\n      <p>C does not check array bounds. Reading or writing beyond <code>size - 1</code> results in undefined behavior, which can overwrite other variables or cause segmentation faults.</p>\n    "
  },
  "6": {
    "concept": "2D Arrays & String Manipulation",
    "summary": "2D arrays model grids/matrices. Strings in C are 1D character arrays terminated by a special null character '\\0' which signals the end of the string.",
    "keyPoints": [
      "Matrix Subscripts: Access via row and column indexes: <code>matrix[row][col]</code>.",
      "Null Terminator: All strings must end with <code>'\\0'</code>. A string 'Hi' occupies 3 bytes: 'H', 'i', '\\0'.",
      "String Functions (string.h): strlen() for length, strcmp() for comparisons, strcat() for joining strings, and strcpy() for copying."
    ],
    "explanation": "\n      <h4>Matrix Multiplication Rule</h4>\n      <p>To multiply two matrices <code>A[r1][c1]</code> and <code>B[r2][c2]</code>, the number of columns in A must equal the number of rows in B (<code>c1 == r2</code>). The resulting matrix will have size <code>r1 x c2</code>.</p>\n      \n      <h4>Reading Strings with Spaces</h4>\n      <p>Standard <code>scanf(\"%s\", str)</code> stops reading at spaces. To read a line with spaces, use <code>fgets(str, sizeof(str), stdin)</code> or the scan-set expression <code>scanf(\"%[^\\n]\", str)</code>.</p>\n    "
  },
  "7": {
    "concept": "Functions & Call by Value",
    "summary": "Functions are modular blocks of reusable code designed to perform specific operations. They help break down complex tasks, making code readable and maintainable.",
    "keyPoints": [
      "Prototype: Tells the compiler the function name, arguments, and return type (e.g., <code>int sum(int a, int b);</code>).",
      "Call by Value: Sends copies of arguments to the function parameters. Modifying parameters inside the function does not change the original arguments.",
      "Return Statement: Passes a value back to the caller and terminates the function's execution."
    ],
    "explanation": "\n      <h4>Benefits of Modularity</h4>\n      <p>Functions prevent copy-pasting of code, allow individual components to be debugged separately, and create clean interfaces where implementation details are hidden behind simple name inputs.</p>\n    "
  },
  "8": {
    "concept": "Numerical Methods",
    "summary": "Numerical methods are algorithms used to approximate mathematical solutions (like roots of equations, derivatives, or integrations) where exact algebraic answers are difficult to obtain.",
    "keyPoints": [
      "Bisection Method: Repeatedly halves an interval containing a root. Safe and slow.",
      "Newton-Raphson: Approximates roots using derivatives: <code>x_new = x - f(x)/f'(x)</code>. Fast convergence near the root.",
      "Numerical Integration: Calculates area under a curve. Examples: Trapezoidal Rule (linear slices) and Simpson's Rule (parabolic fits)."
    ],
    "explanation": "\n      <h4>Choosing root-finding algorithms</h4>\n      <p>Bisection is guaranteed to converge if the function is continuous and signs at endpoints differ. Newton-Raphson is much faster (quadratic convergence) but requires knowing the mathematical derivative and a good initial guess close to the root.</p>\n    "
  },
  "9": {
    "concept": "Recursive Functions",
    "summary": "Recursion is a programming technique where a function calls itself directly or indirectly. It breaks a problem down into smaller sub-problems of the same type.",
    "keyPoints": [
      "Base Case: The condition that terminates recursion and prevents infinite execution.",
      "Recursive Case: The part where the function calls itself with a simplified argument.",
      "Stack Memory: Each recursive call adds a frame to the system call stack. Too many calls lead to a stack overflow."
    ],
    "explanation": "\n      <h4>Recursion vs Iteration</h4>\n      <p>Recursion provides clean, elegant code for naturally recursive problems (like tree traversals, factorials, and Fibonacci). However, recursion consumes more memory (due to stack frames) and overhead than simple loops.</p>\n    "
  },
  "10": {
    "concept": "Pointers & Structures",
    "summary": "Pointers store the memory addresses of other variables. Structures group variables of different data types under a single user-defined record type.",
    "keyPoints": [
      "Pointer Operators: <code>&amp;</code> (address-of, gets memory location) and <code>*</code> (dereference/value-at-address, accesses values stored at location).",
      "Dynamic Memory: Using <code>malloc()</code> or <code>calloc()</code> to allocate memory at runtime, and <code>free()</code> to release it.",
      "Structures: Declared with <code>struct</code> keyword. Members are accessed using the dot (<code>.</code>) operator, or arrow (<code>-&gt;</code>) when using structural pointers."
    ],
    "explanation": "\n      <h4>Passing Pointers to Functions</h4>\n      <p>Pointers enable **Call by Reference**. By passing addresses (e.g. <code>swap(&amp;a, &amp;b)</code>), functions can modify the original variables directly in the caller's stack frame.</p>\n      \n      <h4>Dynamic Memory Allocation Flow</h4>\n      <p>Always check if memory allocation succeeded: <code>int *arr = malloc(n * sizeof(int)); if(arr == NULL) { /* exit */ }</code>. Always free dynamic allocations to avoid memory leaks.</p>\n    "
  },
  "11": {
    "concept": "File Operations in C",
    "summary": "File handling enables a program to store data permanently on disk, reading from and writing to files so data persists after the program terminates.",
    "keyPoints": [
      "File Pointer: Declared as <code>FILE *fptr;</code> to keep track of the file state.",
      "Modes: <code>\"r\"</code> (read), <code>\"w\"</code> (write, overwrites existing), and <code>\"a\"</code> (append, adds to end).",
      "File I/O: <code>fgetc()</code> / <code>fputc()</code> for chars, <code>fprintf()</code> / <code>fscanf()</code> for formatted text."
    ],
    "explanation": "\n      <h4>Safe File Closing</h4>\n      <p>Always close a file using <code>fclose(fptr)</code> after processing. Closing flushes buffers and saves changes, freeing resources back to the OS.</p>\n      \n      <h4>Checking EOF</h4>\n      <p>Use <code>feof(fptr)</code> or check if reading returns <code>EOF</code> (End Of File) to safely loop through files without crash risks.</p>\n    "
  }
};
