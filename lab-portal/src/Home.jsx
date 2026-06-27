import React, { useState, useEffect, useMemo } from 'react';
import { 
  Terminal, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  Tv, 
  BookOpen, 
  X, 
  Code, 
  GraduationCap, 
  Trophy, 
  Cpu, 
  Flame, 
  Database, 
  Award, 
  Info, 
  Star, 
  Clock, 
  Sparkles,
  Laptop
} from 'lucide-react';

const COURSES = [
  {
    id: 'c',
    name: 'C Programming',
    icon: 'Terminal',
    description: 'Foundations of procedural programming, memory pointers, structures, recursion, and file system mechanics.',
    difficulty: 'Beginner',
    moduleCount: '11 Labs',
    problemCount: '50+ Problems',
    status: 'active',
    brandClass: 'course-card-c',
    categories: ['Core Systems', 'All'],
    estimatedHours: '20 Hours',
    progress: 100,
    helloWorldCode: `#include <stdio.h>\n\nint main() {\n    // Procedural C execution\n    printf("Hello, C-Lab Portal!\\n");\n    return 0;\n}`,
    prerequisites: ['Basic logical thinking', 'No prior coding experience needed'],
    learningOutcomes: [
      'Understand compiled binaries & execution flow',
      'Manage computer memory directly using pointer arithmetic',
      'Handle strings and multi-dimensional matrices',
      'Read and write persistent files safely'
    ],
    interviewTopics: ['Pointers & Addresses', 'Pass by Reference vs Value', 'Recursion Stack Overflow', 'Struct Memory Padding'],
    syllabus: [
      { num: 1, title: 'Basics of C & Arithmetic', topics: ['Variable types', 'Format specifiers', 'Type conversions', 'printf/scanf'] },
      { num: 2, title: 'Control Flow & Logic', topics: ['Conditional structures', 'Logical operations', 'Nested if-else', 'Switch cases'] },
      { num: 3, title: 'Loops & Iterations', topics: ['while loops', 'for loops', 'do-while loops', 'Break & Continue statements'] },
      { num: 4, title: 'Arrays & Memory Blocks', topics: ['1D Array manipulation', 'Searching algorithms', 'Bubble/Selection/Insertion sorting'] },
      { num: 5, title: 'Matrices & String Buffers', topics: ['Matrix calculations', 'String functions', 'ASCII table mapping', 'Vowels count'] },
      { num: 6, title: 'Functions & Scope', topics: ['Function declaration', 'Parameters passing', 'Local vs global scopes'] },
      { num: 7, title: 'Numerical Calculations', topics: ['Newton-Raphson root finding', 'Numerical differentiation', 'Numerical integration'] },
      { num: 8, title: 'Recursive Call Stacks', topics: ['Recursive functions', 'Stack frame allocation', 'Fibonacci sequence'] },
      { num: 9, title: 'Pointers & Dynamic Storage', topics: ['Swapping using pointers', 'Array pointers passing', 'Dynamic memory allocation'] },
      { num: 10, title: 'Structures & Data Records', topics: ['Struct definitions', 'Employee/Student records data structures'] },
      { num: 11, title: 'File Operations & I/O', topics: ['fopen/fclose file descriptors', 'File copying', 'Case transformation', 'File size check'] }
    ]
  },
  {
    id: 'cpp',
    name: 'Object-Oriented C++',
    icon: 'Cpu',
    description: 'Master classes, object models, inheritance trees, virtual polymorphism, templates, and the Standard Template Library (STL).',
    difficulty: 'Intermediate',
    moduleCount: '10 Labs',
    problemCount: '40+ Problems',
    status: 'preview',
    brandClass: 'course-card-cpp',
    categories: ['Core Systems', 'Enterprise & OOPs', 'All'],
    estimatedHours: '25 Hours',
    progress: 45,
    helloWorldCode: `#include <iostream>\nusing namespace std;\n\nclass Developer {\nprivate:\n    string name;\npublic:\n    Developer(string n) : name(n) {}\n    void code() {\n        cout << name << " codes in C++!\\n";\n    }\n};\n\nint main() {\n    Developer dev("Piyush");\n    dev.code();\n    return 0;\n}`,
    prerequisites: ['Basic C programming', 'Variable scopes understanding'],
    learningOutcomes: [
      'Design software components using Class & Objects structure',
      'Optimize code reusability using Multiple & Virtual Inheritance',
      'Implement polymorphism for runtime method dispatch',
      'Utilize generic programming via templates & STL'
    ],
    interviewTopics: ['Virtual Destructors', 'Diamond Problem in Inheritance', 'VTABLE and VPTR mechanics', 'RAII & Smart Pointers'],
    syllabus: [
      { num: 1, title: 'Classes and Objects', topics: ['Data encapsulation', 'Access specifiers', 'Object instantiation'] },
      { num: 2, title: 'Constructors & Destructors', topics: ['Default constructors', 'Parameterized constructors', 'Copy constructors', 'Memory deallocation'] },
      { num: 3, title: 'Operator Overloading', topics: ['Unary & Binary operators', 'Friend functions', 'Stream extraction/insertion'] },
      { num: 4, title: 'Inheritance Schemes', topics: ['Single inheritance', 'Multilevel inheritance', 'Multiple inheritance', 'Protected access'] },
      { num: 5, title: 'Polymorphism & Virtuals', topics: ['Function overriding', 'Virtual methods', 'Abstract base classes', 'Pure virtual interfaces'] },
      { num: 6, title: 'Templates & Generics', topics: ['Function templates', 'Class templates', 'Specializations'] },
      { num: 7, title: 'Standard Template Library', topics: ['Vectors, Lists, Deques', 'Maps, Sets, Unordered maps', 'Algorithms (sort, search)'] },
      { num: 8, title: 'Exception Handlers', topics: ['try-catch statements', 'Custom exceptions', 'Stack unwinding'] },
      { num: 9, title: 'File Streams & I/O', topics: ['ifstream and ofstream', 'Binary file serialization', 'State flags'] },
      { num: 10, title: 'Modern C++ Concepts', topics: ['Smart pointers', 'Lambda expressions', 'Move semantics', 'Rvalue references'] }
    ]
  },
  {
    id: 'python',
    name: 'Python Programming',
    icon: 'Flame',
    description: 'Learn script-writing, dynamic data structures, list comprehensions, functional programming, file APIs, and AI/Data Science libraries.',
    difficulty: 'Beginner',
    moduleCount: '12 Labs',
    problemCount: '60+ Problems',
    status: 'coming_soon',
    brandClass: 'course-card-python',
    categories: ['Scripting & Data', 'All'],
    estimatedHours: '15 Hours',
    progress: 0,
    helloWorldCode: `def greet_developer(name: str) -> None:\n    # Python Dynamic Scripting\n    message = f"Welcome back, {name}! Ready to code?"\n    print(message)\n\nif __name__ == "__main__":\n    greet_developer("Admin")`,
    prerequisites: ['No prior programming background needed'],
    learningOutcomes: [
      'Write clean, readable PEP 8 style Python scripts',
      'Use fast comprehensions and generator functions',
      'Read, process, and analyze CSV/JSON datasets',
      'Build basic automation scripts & fetch APIs'
    ],
    interviewTopics: ['Python GIL (Global Interpreter Lock)', 'List vs Tuple Memory Allocation', 'Decorators & Generators', 'Mutable vs Immutable Default Args'],
    syllabus: [
      { num: 1, title: 'Python Syntax & Variables', topics: ['Dynamic typing', 'Basic I/O', 'Indentation rules'] },
      { num: 2, title: 'Conditionals & Loop Control', topics: ['if-elif-else', 'for-in loop', 'while loops', 'range generator'] },
      { num: 3, title: 'Built-in Collections', topics: ['List operations', 'Tuple immutability', 'Set operations', 'Dictionary lookups'] },
      { num: 4, title: 'Functions & Scoping', topics: ['def statement', 'Arbitrary arguments (*args, **kwargs)', 'Lambda expressions'] },
      { num: 5, title: 'Modules & Libraries', topics: ['import syntax', 'pip package manager', 'Standard library math/random/datetime'] },
      { num: 6, title: 'File Streams & Formatting', topics: ['with open syntax', 'JSON serialization', 'CSV data reading'] },
      { num: 7, title: 'Object Oriented Python', topics: ['self variable', 'init constructor', 'Methods overriding', 'Properties decorators'] },
      { num: 8, title: 'Error Handlers & Debug', topics: ['try-except-finally', 'Raising exceptions', 'Custom exceptions'] },
      { num: 9, title: 'Data Processing Basics', topics: ['NumPy array operations', 'Pandas DataFrame manipulation', 'Visualizations'] },
      { num: 10, title: 'Network API Requests', topics: ['Requests library', 'JSON REST API consumption', 'Status codes'] },
      { num: 11, title: 'Automation Scripts', topics: ['System subprocesses', 'Filesystem scanning', 'Regex operations'] },
      { num: 12, title: 'Advanced Generators', topics: ['yield statement', 'Iterators protocols', 'Decorators writing'] }
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: 'GraduationCap',
    description: 'Analyze time/space complexities, build linked structures, trees, dynamic hash tables, sorting routines, and dynamic solutions.',
    difficulty: 'Advanced',
    moduleCount: '15 Labs',
    problemCount: '80+ Problems',
    status: 'coming_soon',
    brandClass: 'course-card-dsa',
    categories: ['Core Systems', 'All'],
    estimatedHours: '40 Hours',
    progress: 0,
    helloWorldCode: `#include <iostream>\n\n// Singly Linked List node\nstruct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};\n\nint main() {\n    Node* head = new Node(10);\n    std::cout << "Node created with value " << head->data << "\\n";\n    return 0;\n}`,
    prerequisites: ['C/C++ basics', 'Pointers logic understanding'],
    learningOutcomes: [
      'Measure time & space complexity using Big-O metrics',
      'Implement Dynamic Arrays, Lists, Stacks, & Queues from scratch',
      'Perform quick tree traversals and balanced graph searches',
      'Solve recursive patterns using Dynamic Programming'
    ],
    interviewTopics: ['Time/Space tradeoffs', 'Array vs Linked List search cost', 'BST balancing & AVL rotations', 'Memoization vs Tabulation'],
    syllabus: [
      { num: 1, title: 'Algorithmic Complexity', topics: ['Big-O notation', 'Time complexity analysis', 'Space complexity metrics'] },
      { num: 2, title: 'Array Sequences', topics: ['Dynamic resizing', 'Subarray windows', 'Two-pointer methods'] },
      { num: 3, title: 'Linked Lists Structures', topics: ['Singly linked nodes', 'Doubly linked lists', 'Circular buffers'] },
      { num: 4, title: 'Stack & Queue ADTs', topics: ['Stack LIFO queue', 'Queue FIFO structure', 'Deconstruct recursion'] },
      { num: 5, title: 'Recursion Backtrack', topics: ['Base conditions', 'Call-stack visualizer', 'N-Queens solver'] },
      { num: 6, title: 'Advanced Sorting', topics: ['QuickSort partitions', 'MergeSort divide-and-conquer', 'HeapSort heapify'] },
      { num: 7, title: 'Hash Map Tables', topics: ['Hash functions', 'Collision resolutions', 'Load factor balance'] },
      { num: 8, title: 'Binary Tree Nodes', topics: ['Pre/In/Post order traversals', 'Binary Search Tree searches', 'DFS & BFS'] },
      { num: 9, title: 'Self-Balancing Trees', topics: ['AVL self-rotation', 'Red-Black tree properties'] },
      { num: 10, title: 'Priority Queues & Heaps', topics: ['Max-Heap/Min-Heap arrays', 'Heapify sorting details'] },
      { num: 11, title: 'Graph Foundations', topics: ['Adjacency list representations', 'DFS traversal stack', 'BFS traversal queue'] },
      { num: 12, title: 'Shortest Path Graphs', topics: ['Dijkstra algorithm', 'Bellman-Ford checks'] },
      { num: 13, title: 'Minimum Spanning Tree', topics: ['Kruskal disjoint sets', 'Prim key updates'] },
      { num: 14, title: 'Greedy & Divide-Conquer', topics: ['Fractional knapsack', 'Binary search trees'] },
      { num: 15, title: 'Dynamic Programming', topics: ['Fibonacci memoization', 'Knapsack solver', 'Longest Common Subsequence'] }
    ]
  },
  {
    id: 'java',
    name: 'Java Development',
    icon: 'Laptop',
    description: 'Learn class hierarchies, Java Virtual Machine (JVM) compilation, exception architectures, multi-threading, and backend systems.',
    difficulty: 'Intermediate',
    moduleCount: '10 Labs',
    problemCount: '35+ Problems',
    status: 'coming_soon',
    brandClass: 'course-card-java',
    categories: ['Enterprise & OOPs', 'All'],
    estimatedHours: '30 Hours',
    progress: 0,
    helloWorldCode: `public class Main {\n    public static void main(String[] args) {\n        // JVM Object Oriented execution\n        System.out.println("Hello, Java Portal!");\n    }\n}`,
    prerequisites: ['Logical control structures (loops, branches)'],
    learningOutcomes: [
      'Compile and run bytecode on Java Virtual Machine (JVM)',
      'Design clean architectures using Inheritance & Interfaces',
      'Resolve exceptions gracefully using structured try-catch hierarchy',
      'Write safe multi-threaded task worker pools'
    ],
    interviewTopics: ['JVM Memory: Heap vs Stack', 'Java Garbage Collection sweeps', 'Abstract Class vs Interface', 'Checked vs Unchecked Exceptions'],
    syllabus: [
      { num: 1, title: 'JVM Architecture', topics: ['Bytecode compilation', 'JVM JRE JDK difference', 'Data types'] },
      { num: 2, title: 'OOP Foundations', topics: ['Class schemas', 'Access modifiers', 'this reference'] },
      { num: 3, title: 'Inheritance & Abstract Classes', topics: ['super constructor', 'Method overriding', 'Abstract classes'] },
      { num: 4, title: 'Interfaces & Polymorphism', topics: ['Multiple interfaces implement', 'Default interface methods', 'Runtime binds'] },
      { num: 5, title: 'Packages & Visibility', topics: ['Import statements', 'CLASSPATH variables', 'Access control scoping'] },
      { num: 6, title: 'Exception Safety', topics: ['try-catch-finally block', 'throw vs throws keywords', 'Custom exception writing'] },
      { num: 7, title: 'String APIs & Buffers', topics: ['String pool references', 'StringBuilder vs StringBuffer'] },
      { num: 8, title: 'Java Collections Framework', topics: ['List ArrayList', 'Set HashSet', 'Map HashMap table lookup'] },
      { num: 9, title: 'Threads & Concurrency', topics: ['Runnable implementation', 'synchronized block locks', 'Thread life cycle states'] },
      { num: 10, title: 'File Streams & Java IO', topics: ['File streams I/O', 'Reader and Writer objects', 'NIO modern path operations'] }
    ]
  },
  {
    id: 'sql',
    name: 'SQL & Database Design',
    icon: 'Database',
    description: 'Master relational schema designs, tables normalization, query syntax, aggregations, database joins, and performance indexing.',
    difficulty: 'Intermediate',
    moduleCount: '8 Labs',
    problemCount: '30+ Problems',
    status: 'coming_soon',
    brandClass: 'course-card-sql',
    categories: ['Scripting & Data', 'All'],
    estimatedHours: '12 Hours',
    progress: 0,
    helloWorldCode: `-- SQL Relational Query\nSELECT student_name, score\nFROM lab_records\nWHERE language = 'C'\n  AND score >= 90\nORDER BY score DESC;`,
    prerequisites: ['Basic set logic', 'Elementary tabular structures'],
    learningOutcomes: [
      'Draft normalized Relational Schemas (1NF, 2NF, 3NF)',
      'Query databases using conditional filters and sorted arrays',
      'Join multiple relation tables using INNER/LEFT/RIGHT syntax',
      'Speed up query processing using indexes and partitions'
    ],
    interviewTopics: ['SQL Joins: Inner vs Left Outer', 'Normal Forms benefits', 'Index lookup trees (B-Trees)', 'ACID Transactions safety'],
    syllabus: [
      { num: 1, title: 'Relational Model Basics', topics: ['Tables, Columns, Primary keys', 'Foreign key references'] },
      { num: 2, title: 'Basic SQL Query SELECT', topics: ['WHERE conditional matches', 'ORDER BY sorting', 'LIMIT partitions'] },
      { num: 3, title: 'Aggregations & Groupings', topics: ['SUM, AVG, COUNT, MIN, MAX', 'GROUP BY groupings', 'HAVING filter states'] },
      { num: 4, title: 'SQL Joins Mechanics', topics: ['INNER JOIN match', 'LEFT JOIN outer match', 'RIGHT JOIN outer match', 'CROSS JOIN product'] },
      { num: 5, title: 'Subqueries & Views', topics: ['Subquery filters', 'CTE Common Table Expressions', 'CREATE VIEW mapping'] },
      { num: 6, title: 'Data Mutator DML Statements', topics: ['INSERT statements', 'UPDATE queries', 'DELETE statements'] },
      { num: 7, title: 'Schema Definition DDL', topics: ['CREATE TABLE schemas', 'ALTER COLUMN definitions', 'DROP elements'] },
      { num: 8, title: 'Indexing & Performance', topics: ['Indexes execution plan', 'Query cost analysis', 'Transaction locks'] }
    ]
  }
];

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getCourseIcon(iconName, size = 20) {
  switch (iconName) {
    case 'Terminal': return <Terminal size={size} />;
    case 'Cpu': return <Cpu size={size} />;
    case 'Flame': return <Flame size={size} />;
    case 'GraduationCap': return <GraduationCap size={size} />;
    case 'Laptop': return <Laptop size={size} />;
    case 'Database': return <Database size={size} />;
    default: return <Code size={size} />;
  }
}

function highlightCode(code, lang) {
  if (!code) return '';
  const escaped = escapeHtml(code);
  
  if (lang === 'c' || lang === 'cpp' || lang === 'dsa') {
    const keywords = /\b(const|int|float|double|char|void|class|public|private|protected|struct|new|delete|return|if|else|while|for|using|namespace|string|std|cout|cin|include|typedef|struct|nullptr)\b/g;
    const directives = /(#include.*|#define.*)/g;
    const strings = /("[^"]*")/g;
    const comments = /(\/\/.*)/g;
    const numbers = /\b(\d+)\b/g;
    
    return escaped
      .replace(comments, '<span class="code-comment">$1</span>')
      .replace(directives, '<span class="code-include">$1</span>')
      .replace(strings, '<span class="code-string">$1</span>')
      .replace(keywords, '<span class="code-keyword">$1</span>')
      .replace(numbers, '<span class="code-number">$1</span>');
  } else if (lang === 'python') {
    const keywords = /\b(def|class|return|if|elif|else|while|for|in|import|from|print|__name__|__main__|str|None)\b/g;
    const strings = /("[^"]*"|'[^']*')/g;
    const comments = /(#.*)/g;
    const numbers = /\b(\d+)\b/g;
    
    return escaped
      .replace(comments, '<span class="code-comment">$1</span>')
      .replace(strings, '<span class="code-string">$1</span>')
      .replace(keywords, '<span class="code-keyword">$1</span>')
      .replace(numbers, '<span class="code-number">$1</span>');
  } else if (lang === 'java') {
    const keywords = /\b(public|class|static|void|main|String|System|out|println|new|return|int|double|float)\b/g;
    const strings = /("[^"]*")/g;
    const comments = /(\/\/.*)/g;
    const numbers = /\b(\d+)\b/g;
    
    return escaped
      .replace(comments, '<span class="code-comment">$1</span>')
      .replace(strings, '<span class="code-string">$1</span>')
      .replace(keywords, '<span class="code-keyword">$1</span>')
      .replace(numbers, '<span class="code-number">$1</span>');
  } else if (lang === 'sql') {
    const keywords = /\b(SELECT|FROM|WHERE|AND|OR|ORDER BY|DESC|LIMIT|CREATE TABLE|ALTER COLUMN|DROP|INSERT|UPDATE|DELETE)\b/g;
    const strings = /('[^']*')/g;
    const comments = /(--.*)/g;
    const numbers = /\b(\d+)\b/g;
    
    return escaped
      .replace(comments, '<span class="code-comment">$1</span>')
      .replace(strings, '<span class="code-string">$1</span>')
      .replace(keywords, '<span class="code-keyword">$1</span>')
      .replace(numbers, '<span class="code-number">$1</span>');
  }
  
  return escaped;
}

function SyllabusAccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="syllabus-accordion-item">
      <button className="syllabus-accordion-trigger" type="button" onClick={onToggle}>
        <div className="syllabus-trigger-left">
          <span className="syllabus-trigger-number">Mod {item.num}</span>
          <span className="syllabus-trigger-title">{item.title}</span>
        </div>
        <div className="syllabus-trigger-meta">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>
      {isOpen && (
        <div className="syllabus-accordion-content">
          <div className="syllabus-topics-tags">
            {item.topics.map((topic, idx) => (
              <span key={idx} className="syllabus-topic-tag">{topic}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SyllabusModal({ course, onClose, onNotify }) {
  const [openAccordionIndex, setOpenAccordionIndex] = useState(0);

  if (!course) return null;

  return (
    <div className="syllabus-modal-overlay" onClick={onClose}>
      <div className="syllabus-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="syllabus-modal-header">
          <div className="syllabus-modal-title-area">
            <div className="syllabus-modal-icon">
              {getCourseIcon(course.icon, 22)}
            </div>
            <div>
              <h2>{course.name}</h2>
              <p>{course.estimatedHours} &bull; {course.difficulty} Level</p>
            </div>
          </div>
          <button className="syllabus-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="syllabus-modal-body">
          <div className="syllabus-section-block">
            <h3>Prerequisites</h3>
            <div className="syllabus-pills-list">
              {course.prerequisites.map((prereq, i) => (
                <span key={i} className="syllabus-prereq-pill">{prereq}</span>
              ))}
            </div>
          </div>

          <div className="syllabus-section-block">
            <h3>What You'll Learn</h3>
            <ul className="syllabus-outcomes-list">
              {course.learningOutcomes.map((outcome, i) => (
                <li key={i}>{outcome}</li>
              ))}
            </ul>
          </div>

          <div className="syllabus-section-block">
            <h3>Course Syllabus ({course.syllabus.length} Labs)</h3>
            <div className="syllabus-accordion-list">
              {course.syllabus.map((item, index) => (
                <SyllabusAccordionItem 
                  key={index}
                  item={item}
                  isOpen={openAccordionIndex === index}
                  onToggle={() => setOpenAccordionIndex(openAccordionIndex === index ? -1 : index)}
                />
              ))}
            </div>
          </div>

          <div className="syllabus-section-block">
            <h3>Viva &amp; Interview Focus</h3>
            <div className="syllabus-topics-tags">
              {course.interviewTopics.map((topic, i) => (
                <span key={i} className="syllabus-topic-tag" style={{ border: '1px solid var(--primary-glow)', color: 'var(--primary)' }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="syllabus-modal-footer">
          <div className="syllabus-footer-meta">
            <span><Clock size={14} /> {course.moduleCount}</span>
            <span><Award size={14} /> Certified Syllabus</span>
          </div>
          {course.status === 'active' ? (
            <button className="syllabus-enroll-btn" onClick={onNotify}>
              <Play size={14} />
              <span>Resume Coding</span>
            </button>
          ) : (
            <button className="syllabus-enroll-btn" onClick={onNotify}>
              <Sparkles size={14} />
              <span>Enroll / Notify Me</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home({ setViewMode }) {
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [syllabusModalCourse, setSyllabusModalCourse] = useState(null);
  const [activeCodePreview, setActiveCodePreview] = useState('c');
  const [showNotifyToast, setShowNotifyToast] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // Keyboard Shortcuts (Esc close modal)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSyllabusModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.05 }
    );
    
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Testimonials auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeCodeCourse = useMemo(() => {
    return COURSES.find(c => c.id === activeCodePreview) || COURSES[0];
  }, [activeCodePreview]);

  const triggerNotifyToast = () => {
    setShowNotifyToast(true);
    setTimeout(() => {
      setShowNotifyToast(false);
    }, 3000);
  };

  const handleCardClick = (course) => {
    if (course.status === 'active') {
      setViewMode('workspace');
    } else {
      setSyllabusModalCourse(course);
      setSyllabusModalOpen(true);
    }
  };

  const testimonials = [
    {
      quote: "The C Programming workspace is a lifesaver. Watching step-by-step videos and reading high-quality diagrams got me an A in my lab exam!",
      author: "Aryan K. (CS Sophomore)"
    },
    {
      quote: "I love the code copy & download features. Highly visual, very clean, and structured. Can't wait for C++ and Python courses to go live!",
      author: "Sneha M. (ECE Junior)"
    },
    {
      quote: "The RLS policies, clean segmented controls, and overall aesthetic make this feel like a premium dev dashboard. Best academic portal ever!",
      author: "Devanshu S. (Admin User)"
    }
  ];

  return (
    <div className="landing-container">
      {/* 1. Animated Hero Section */}
      <section className="landing-hero reveal-on-scroll revealed">
        <div className="landing-hero-overlay"></div>
        <div className="hero-tag">
          <Sparkles size={14} />
          <span>Academic Developer Hub</span>
        </div>
        <h1>Master Programming, One Lab at a Time</h1>
        <p>
          Choose a course below to explore interactive code workspaces, step-by-step revision videos, visual concept notes, and test preparation viva summaries.
        </p>

        {/* Stats Counters */}
        <div className="hero-stats-strip">
          <div className="hero-stat-box">
            <span className="hero-stat-num">6</span>
            <span className="hero-stat-lbl">Languages</span>
          </div>
          <div className="hero-stat-box">
            <span className="hero-stat-num">50+</span>
            <span className="hero-stat-lbl">Solutions</span>
          </div>
          <div className="hero-stat-box">
            <span className="hero-stat-num">11</span>
            <span className="hero-stat-lbl">C-Lab Modules</span>
          </div>
          <div className="hero-stat-box">
            <span className="hero-stat-num">100%</span>
            <span className="hero-stat-lbl">Open Source</span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Code Previewer Section */}
      <section className="reveal-on-scroll">
        <h3 className="previewer-section-title">
          <Code size={20} className="text-highlight" />
          <span>Interactive Code Preview</span>
        </h3>
        <div className="code-previewer-panel">
          <div className="previewer-selector-list">
            {COURSES.map((course) => (
              <button
                key={course.id}
                type="button"
                className={`previewer-selector-card ${activeCodePreview === course.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveCodePreview(course.id)}
                onClick={() => setActiveCodePreview(course.id)}
              >
                <div className="previewer-selector-info">
                  <div className="lang-preview-icon">
                    {getCourseIcon(course.icon, 18)}
                  </div>
                  <div className="previewer-selector-details">
                    <h4>{course.name}</h4>
                    <span>{course.difficulty} &bull; {course.moduleCount}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="previewer-arrow" />
              </button>
            ))}
          </div>

          <div className="previewer-editor-mock">
            <div className="editor-mock-header">
              <div className="editor-window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="editor-mock-tab">
                {getCourseIcon(activeCodeCourse.icon, 13)}
                <span>
                  {activeCodeCourse.id === 'c' ? 'main.c' : 
                   activeCodeCourse.id === 'cpp' ? 'Developer.cpp' : 
                   activeCodeCourse.id === 'python' ? 'script.py' : 
                   activeCodeCourse.id === 'java' ? 'Main.java' : 
                   activeCodeCourse.id === 'dsa' ? 'linked_list.cpp' : 'query.sql'}
                </span>
              </div>
              <span className="search-shortcut-badge" style={{ textTransform: 'uppercase' }}>
                {activeCodeCourse.id}
              </span>
            </div>
            <div className="editor-mock-body">
              <pre dangerouslySetInnerHTML={{ __html: highlightCode(activeCodeCourse.helloWorldCode, activeCodeCourse.id) }} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Course Grid */}
      <section className="reveal-on-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <h2 style={{ textAlign: 'center', margin: '24px 0 8px 0', fontSize: '2rem', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Explore Our Courses &amp; Learning Tracks
        </h2>
        <div className="course-cards-grid">
          {COURSES.map((course) => {
            const isC = course.id === 'c';
            return (
              <div 
                key={course.id} 
                className={`course-card ${course.brandClass}`}
                onClick={() => handleCardClick(course)}
                style={{ cursor: 'pointer' }}
              >
                <div className="course-card-header">
                  <div className="course-card-icon">
                    {getCourseIcon(course.icon, 22)}
                  </div>
                  {course.status === 'active' && (
                    <span className="course-status-badge active">
                      <span className="badge-pulse-dot"></span>
                      <span>Active</span>
                    </span>
                  )}
                  {course.status === 'preview' && (
                    <span className="course-status-badge preview">Preview</span>
                  )}
                  {course.status === 'coming_soon' && (
                    <span className="course-status-badge coming_soon">Coming Soon</span>
                  )}
                </div>

                <div>
                  <h3 className="course-card-title">{course.name}</h3>
                  <p className="course-card-desc">{course.description}</p>
                </div>

                <div className="course-meta-pills">
                  <span className="meta-pill">{course.difficulty}</span>
                  <span className="meta-pill">{course.moduleCount}</span>
                  <span className="meta-pill">{course.estimatedHours}</span>
                </div>

                {/* Progress */}
                <div className="course-card-progress">
                  <div className="course-progress-header">
                    <span>Syllabus Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="course-progress-track">
                    <div className="course-progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>

                <div className="course-card-footer">
                  {isC ? (
                    <button
                      type="button"
                      className="course-cta-btn primary-cta"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode('workspace');
                      }}
                    >
                      <Play size={14} />
                      <span>Enter Workspace</span>
                    </button>
                  ) : course.status === 'preview' ? (
                    <button
                      type="button"
                      className="course-cta-btn secondary-cta"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSyllabusModalCourse(course);
                        setSyllabusModalOpen(true);
                      }}
                    >
                      <BookOpen size={14} />
                      <span>Explore Syllabus</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="course-cta-btn disabled-cta"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSyllabusModalCourse(course);
                        setSyllabusModalOpen(true);
                      }}
                    >
                      <Info size={14} />
                      <span>Syllabus Outline</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Features Showcase Grid */}
      <section className="features-section reveal-on-scroll">
        <h2>Centralized Visual Learning Core</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Terminal size={20} />
            </div>
            <h3>Live Workspace</h3>
            <p>Compile, edit, run, and save your code scripts with zero setup configuration overhead.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Tv size={20} />
            </div>
            <h3>Video Solutions</h3>
            <p>Step-by-step solution recordings describing logic walkthroughs for every laboratory program.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <BookOpen size={20} />
            </div>
            <h3>Concept Notes</h3>
            <p>Handwritten visual flowcharts, execution stack diagrams, and clear theory explanations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Trophy size={20} />
            </div>
            <h3>Viva Prep</h3>
            <p>Commonly asked lab exam questions, dynamic quiz systems, and logic testing tools.</p>
          </div>
        </div>
      </section>

      {/* 5. Quick-Start Wizard Strip */}
      <section className="start-wizard-section reveal-on-scroll">
        <h2>Interactive Quick-Start Guide</h2>
        <div className="wizard-row">
          <div className="wizard-step">
            <div className="wizard-number-circle">1</div>
            <h4>Choose Language</h4>
            <p>Select any active programming card from the course registry grid above.</p>
          </div>
          <div className="wizard-step">
            <div className="wizard-number-circle">2</div>
            <h4>Open Workspace</h4>
            <p>Examine problem lists, download files, and watch walkthrough playlists.</p>
          </div>
          <div className="wizard-step">
            <div className="wizard-number-circle">3</div>
            <h4>Complete Viva</h4>
            <p>Study visual diagrams and take practice quizzes to test concept retention.</p>
          </div>
        </div>
      </section>

      {/* 6. Rotating Student Testimonials Section */}
      <section className="testimonials-section reveal-on-scroll">
        <h2>What Developers Say</h2>
        <div className="testimonials-wrapper">
          <div className="testimonial-slide" key={activeTestimonialIndex}>
            <div className="testimonial-stars">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <p className="testimonial-quote">
              "{testimonials[activeTestimonialIndex].quote}"
            </p>
            <span className="testimonial-author">
              - {testimonials[activeTestimonialIndex].author}
            </span>
          </div>
          <div className="testimonials-indicators">
            {testimonials.map((_, idx) => (
              <span
                key={idx}
                className={`indicator-dot ${activeTestimonialIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveTestimonialIndex(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer Section */}
      <footer className="landing-footer reveal-on-scroll">
        <div className="footer-logo">
          <Terminal size={22} className="text-highlight" />
          <span>DevLabs Academy Portal</span>
        </div>
        <div className="footer-links">
          <button type="button" className="footer-link-btn" onClick={() => setViewMode('home')}>Home</button>
          <button type="button" className="footer-link-btn" onClick={() => setViewMode('workspace')}>C Workspace</button>
          <button type="button" className="footer-link-btn" onClick={() => setViewMode('revision')}>Video Revision</button>
          <button type="button" className="footer-link-btn" onClick={() => setViewMode('notes')}>Notes Revision</button>
          <button type="button" className="footer-link-btn" onClick={() => setViewMode('admin')}>Admin Panel</button>
        </div>
        <div className="footer-credit">
          Built with &hearts; for developers &bull; &copy; {new Date().getFullYear()} Piyush Kumar
        </div>
        <div className="footer-tech-stack">
          <span className="meta-pill">React</span>
          <span className="meta-pill">Vite</span>
          <span className="meta-pill">Supabase</span>
        </div>
      </footer>

      {/* Syllabus Modal Popup */}
      {syllabusModalOpen && (
        <SyllabusModal 
          course={syllabusModalCourse} 
          onClose={() => setSyllabusModalOpen(false)}
          onNotify={() => {
            if (syllabusModalCourse?.status === 'active') {
              setViewMode('workspace');
              setSyllabusModalOpen(false);
            } else {
              triggerNotifyToast();
            }
          }}
        />
      )}

      {/* Notify Toast */}
      <div className={`notify-toast ${showNotifyToast ? 'show' : ''}`}>
        <Sparkles size={16} style={{ color: 'var(--secondary)' }} />
        <span>You will be notified as soon as this course is released!</span>
      </div>
    </div>
  );
}
