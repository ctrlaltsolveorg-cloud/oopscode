import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Terminal,
  Search,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Download,
  Menu,
  X,
  Sun,
  Moon,
  Play,
  Pause,
  FastForward,
  Rewind,
  Volume2,
  VolumeX,
  Tv,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Settings,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Upload,
  Image,
  Home,
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
  Zap,
  ExternalLink,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import labsData from './data/labsData.json';
import { theoryNotes } from './data/theoryNotes';
import { quizzes } from './data/quizzes';
import { supabase } from './utils/supabaseClient';


// A tokenizer-based C syntax highlighter
function highlightCSyntax(code) {
  if (!code) return "";

  const tokenRegex = /(\/\/.*|\/\*[\s\S]*?\*\/|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|#include\s*<[^>]+>|#include\s*"[^"]+"|\b\w+\b|[^\w\s]+|\s+)/g;

  const keywords = new Set([
    'int', 'float', 'double', 'char', 'void', 'struct', 'typedef', 'union',
    'if', 'else', 'while', 'for', 'do', 'switch', 'case', 'default',
    'break', 'continue', 'return', 'sizeof', 'const', 'extern', 'static'
  ]);

  const stdFunctions = new Set([
    'main', 'printf', 'scanf', 'fopen', 'fclose', 'malloc', 'calloc', 'free',
    'strlen', 'strcpy', 'strcat', 'strcmp', 'exit', 'sqrt', 'pow', 'abs', 'fgets'
  ]);

  let html = "";
  let match;

  tokenRegex.lastIndex = 0;
  while ((match = tokenRegex.exec(code)) !== null) {
    const token = match[0];

    if (token.startsWith('//') || token.startsWith('/*')) {
      html += `<span class="code-comment">${escapeHtml(token)}</span>`;
    } else if (token.startsWith('"') || token.startsWith("'")) {
      html += `<span class="code-string">${escapeHtml(token)}</span>`;
    } else if (token.startsWith('#')) {
      html += `<span class="code-include">${escapeHtml(token)}</span>`;
    } else if (/^\d+$/.test(token)) {
      html += `<span class="code-number">${token}</span>`;
    } else if (/^[a-zA-Z_]\w*$/.test(token)) {
      if (keywords.has(token)) {
        html += `<span class="code-keyword">${token}</span>`;
      } else if (stdFunctions.has(token)) {
        html += `<span class="code-function">${token}</span>`;
      } else {
        html += escapeHtml(token);
      }
    } else {
      html += escapeHtml(token);
    }
  }

  return html;
}

function escapeHtml(text) {
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
          {/* Prerequisites */}
          <div className="syllabus-section-block">
            <h3>Prerequisites</h3>
            <div className="syllabus-pills-list">
              {course.prerequisites.map((prereq, i) => (
                <span key={i} className="syllabus-prereq-pill">{prereq}</span>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="syllabus-section-block">
            <h3>What You'll Learn</h3>
            <ul className="syllabus-outcomes-list">
              {course.learningOutcomes.map((outcome, i) => (
                <li key={i}>{outcome}</li>
              ))}
            </ul>
          </div>

          {/* Course Syllabus Accordion */}
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

          {/* Interview Topics */}
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

function AdminLoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg("Supabase client is not configured.");
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data?.session) {
        onLoginSuccess(data.session);
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon-bg">
            <Settings className="admin-login-icon" size={32} />
          </div>
          <h2>Admin Console Authentication</h2>
          <p>Please log in using your Supabase credentials to manage lab content safely.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {errorMsg && (
            <div className="admin-login-error">
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="admin-email">Admin Email Address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="e.g. admin@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="admin-login-submit" disabled={loading}>
            {loading ? (
              <span className="spinner">Authenticating...</span>
            ) : (
              <span>Authenticate Session</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function ImageUploaderModal({ isOpen, onClose, supabase, targetProblemTitle, onInsertLink }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setUploadedUrl(null);
      setError(null);
      setCopied(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalPaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const pastedFile = item.getAsFile();
          if (pastedFile) {
            e.preventDefault();
            setFile(pastedFile);
            setError(null);
            setUploadedUrl(null);

            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(pastedFile);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setError(null);
        setUploadedUrl(null);

        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(droppedFile);
      } else {
        setError("Please drop an image file.");
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      setUploadedUrl(null);

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const executeUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to upload image to host.");
      }

      const result = await response.json();
      if (!result.url) {
        throw new Error("No URL returned from server");
      }

      setUploadedUrl(result.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="img-uploader-overlay" onClick={onClose}>
      <div className="img-uploader-card" onClick={(e) => e.stopPropagation()}>
        <div className="img-uploader-header">
          <div className="img-uploader-title-wrapper">
            <Image className="img-uploader-icon" size={20} />
            <h3>Image to Link Converter</h3>
          </div>
          <button className="img-uploader-close" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="img-uploader-body">
          {!uploadedUrl ? (
            <div className="uploader-work-area">
              <div
                className={`dropzone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="preview-container">
                    <img src={preview} alt="Upload preview" className="uploader-preview-img" />
                    <button className="remove-preview-btn" onClick={() => { setFile(null); setPreview(null); }} title="Remove file">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="dropzone-label">
                    <Upload className="dropzone-icon" size={32} />
                    <span className="dropzone-title">Drag & Drop Image Here</span>
                    <span className="dropzone-subtitle">or click to browse files</span>
                    <span className="dropzone-hint">Tip: Paste a screenshot directly using Ctrl+V / Cmd+V</span>
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden-file-input" />
                  </label>
                )}
              </div>

              {error && (
                <div className="uploader-error-box">
                  <p>{error}</p>
                </div>
              )}

              <button
                className="uploader-action-btn"
                disabled={!file || uploading}
                onClick={executeUpload}
              >
                {uploading ? (
                  <>
                    <span className="spinner" style={{ marginRight: '8px' }}></span>
                    Uploading to Supabase...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    Upload Image
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="uploader-success-area">
              <div className="success-icon-badge">
                <Check size={28} />
              </div>
              <h4>Image Uploaded Successfully!</h4>

              <div className="success-preview-container">
                <img src={uploadedUrl} alt="Uploaded success" className="uploader-success-img" />
              </div>

              <div className="uploader-url-field">
                <label>Direct Image Link</label>
                <div className="url-input-wrapper">
                  <input type="text" readOnly value={uploadedUrl} onClick={(e) => e.target.select()} />
                  <button className="url-copy-btn" onClick={handleCopy}>
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="uploader-success-actions">
                {onInsertLink && targetProblemTitle !== null && (
                  <button
                    className="uploader-insert-btn"
                    onClick={() => {
                      onInsertLink(uploadedUrl);
                      onClose();
                    }}
                  >
                    Insert Link into "{targetProblemTitle}"
                  </button>
                )}

                <button
                  className="uploader-reset-btn"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setUploadedUrl(null);
                  }}
                >
                  Upload Another Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
      { num: 10, title: 'File Streams & NIO', topics: ['File streams I/O', 'Reader and Writer objects', 'NIO modern path operations'] }
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

function App() {
  // Config States (Persistent or default fallback)
  const [labs, setLabs] = useState(() => {
    const local = localStorage.getItem('c_lab_labs');
    return local ? JSON.parse(local) : labsData;
  });

  const [theory, setTheory] = useState(() => {
    const local = localStorage.getItem('c_lab_theory');
    return local ? JSON.parse(local) : theoryNotes;
  });

  const [quizData, setQuizData] = useState(() => {
    const local = localStorage.getItem('c_lab_quizzes');
    return local ? JSON.parse(local) : quizzes;
  });

  // Admin selected lab and sub-tab selection state
  const [adminSelectedLabNum, setAdminSelectedLabNum] = useState(null);
  const [adminActiveTab, setAdminActiveTab] = useState('problems'); // 'problems', 'theory', 'quizzes'
  const [saveStatus, setSaveStatus] = useState('');

  // Supabase states
  const [dbLoading, setDbLoading] = useState(false);
  const [session, setSession] = useState(null);

  // Initialize adminSelectedLabNum once labs are loaded
  useEffect(() => {
    if (labs && labs.length > 0 && adminSelectedLabNum === null) {
      setAdminSelectedLabNum(labs[0].labNum);
    }
  }, [labs, adminSelectedLabNum]);

  // Auth session listener
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // Fetch labs, theory notes, and quizzes from Supabase
  useEffect(() => {
    async function loadDataFromSupabase() {
      if (!supabase) return;
      try {
        setDbLoading(true);

        // Fetch labs
        const { data: labsFromDb, error: labsErr } = await supabase
          .from('labs')
          .select('*')
          .order('labNum', { ascending: true });

        if (labsErr) throw labsErr;

        // Fetch theory
        const { data: theoryFromDb, error: theoryErr } = await supabase
          .from('theory')
          .select('*');

        if (theoryErr) throw theoryErr;

        // Fetch quizzes
        const { data: quizzesFromDb, error: quizzesErr } = await supabase
          .from('quizzes')
          .select('*');

        if (quizzesErr) throw quizzesErr;

        if (labsFromDb && labsFromDb.length > 0) {
          setLabs(labsFromDb);

          const newTheory = {};
          if (theoryFromDb) {
            theoryFromDb.forEach(t => {
              newTheory[t.labNum] = {
                concept: t.concept,
                summary: t.summary,
                keyPoints: t.keyPoints || [],
                explanation: t.explanation
              };
            });
          }
          setTheory(newTheory);

          const newQuizzes = {};
          if (quizzesFromDb) {
            quizzesFromDb.forEach(q => {
              newQuizzes[q.labNum] = q.questions || [];
            });
          }
          setQuizData(newQuizzes);

          setAdminSelectedLabNum(labsFromDb[0].labNum);
        } else {
          console.log("Supabase database tables are empty. Pre-populating from local static files...");
        }
      } catch (err) {
        console.error("Failed to load data from Supabase, using local fallback state:", err);
      } finally {
        setDbLoading(false);
      }
    }

    loadDataFromSupabase();
  }, []);


  // Selected admin helpers
  const selectedAdminLab = labs.find(l => l.labNum === adminSelectedLabNum);
  const selectedAdminTheory = theory[adminSelectedLabNum];

  // Navigation & States
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [expandedLabs, setExpandedLabs] = useState({ 2: true });
  const [searchQuery, setSearchQuery] = useState('');

  // Theme & Mobile layout
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Copy confirmation
  const [copied, setCopied] = useState(false);

  // Futuristic scanning indicator target ref
  const notesImageRef = useRef(null);

  // YouTube API integration state
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef(null);

  // Playlist & Revision Mode States
  const [viewMode, setViewMode] = useState(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    if (path === 'admin') return 'admin';
    if (path === 'revision') return 'revision';
    if (path === 'notes') return 'notes';
    if (path === 'c' || path === 'workspace') return 'workspace';
    return 'home';
  });

  // New Landing Page States
  const [landingSearchQuery, setLandingSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [syllabusModalCourse, setSyllabusModalCourse] = useState(null);
  const [activeCodePreview, setActiveCodePreview] = useState('c');
  const [showNotifyToast, setShowNotifyToast] = useState(false);

  // Testimonials slide index
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // Sync viewMode to browser URL history
  useEffect(() => {
    const currentPath = window.location.pathname.replace(/^\/|\/$/g, '');
    let targetPath = '';
    if (viewMode === 'workspace') targetPath = 'c';
    else if (viewMode === 'revision') targetPath = 'revision';
    else if (viewMode === 'notes') targetPath = 'notes';
    else if (viewMode === 'admin') targetPath = 'admin';
    else targetPath = ''; // home is root

    if (currentPath !== targetPath) {
      window.history.pushState(null, '', `/${targetPath}`);
    }
  }, [viewMode]);

  // Listen to browser popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      if (path === 'admin') setViewMode('admin');
      else if (path === 'revision') setViewMode('revision');
      else if (path === 'notes') setViewMode('notes');
      else if (path === 'c' || path === 'workspace') setViewMode('workspace');
      else setViewMode('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [autoPlayNext, setAutoPlayNext] = useState(true);

  // Landing Page Filter & Notify Logics
  const filteredCourses = useMemo(() => {
    const query = landingSearchQuery.toLowerCase().trim();
    return COURSES.filter((course) => {
      const matchesCategory = activeCategory === 'All' || course.categories.includes(activeCategory);
      if (!query) return matchesCategory;
      
      const matchesName = course.name.toLowerCase().includes(query);
      const matchesDesc = course.description.toLowerCase().includes(query);
      const matchesSyllabus = course.syllabus.some((mod) => 
        mod.title.toLowerCase().includes(query) || 
        mod.topics.some(t => t.toLowerCase().includes(query))
      );
      
      return matchesCategory && (matchesName || matchesDesc || matchesSyllabus);
    });
  }, [landingSearchQuery, activeCategory]);

  const activeCodeCourse = useMemo(() => {
    return COURSES.find(c => c.id === activeCodePreview) || COURSES[0];
  }, [activeCodePreview]);

  const triggerNotifyToast = () => {
    setShowNotifyToast(true);
    setTimeout(() => {
      setShowNotifyToast(false);
    }, 3000);
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

  // Image Uploader Modal States
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [uploaderTargetProblemIndex, setUploaderTargetProblemIndex] = useState(null);

  // Notes Modal & Virtual HUD Pointer States
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [virtualPointer, setVirtualPointer] = useState({
    active: false,
    x: 0,
    y: 0,
    phase: 'idle'
  });

  // Admin Handlers
  const handleAddLab = () => {
    const nextLabNum = labs.length > 0 ? Math.max(...labs.map(l => l.labNum)) + 1 : 1;
    const newLab = {
      labNum: nextLabNum,
      tutorial: "NEW TUTORIAL TOPIC",
      title: "New Lab Title",
      problems: []
    };
    const updatedLabs = [...labs, newLab];
    setLabs(updatedLabs);
    setAdminSelectedLabNum(nextLabNum);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleDeleteLab = (labNum) => {
    if (!window.confirm(`Are you sure you want to delete Lab ${labNum}?`)) return;
    const updatedLabs = labs.filter(l => l.labNum !== labNum);
    setLabs(updatedLabs);
    if (adminSelectedLabNum === labNum) {
      setAdminSelectedLabNum(updatedLabs[0]?.labNum || null);
    }
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));

    const updatedTheory = { ...theory };
    delete updatedTheory[labNum];
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));

    const updatedQuizzes = { ...quizData };
    delete updatedQuizzes[labNum];
    setQuizData(updatedQuizzes);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleMoveLab = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= labs.length) return;
    const updatedLabs = [...labs];
    const temp = updatedLabs[index];
    updatedLabs[index] = updatedLabs[targetIndex];
    updatedLabs[targetIndex] = temp;
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleUpdateLabField = (field, value) => {
    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        if (field === 'labNum') {
          if (labs.some(l => l.labNum === value && l.labNum !== adminSelectedLabNum)) {
            alert(`Lab number ${value} already exists.`);
            return lab;
          }
          const oldNum = lab.labNum;
          const updatedTheory = { ...theory };
          if (updatedTheory[oldNum]) {
            updatedTheory[value] = updatedTheory[oldNum];
            delete updatedTheory[oldNum];
            setTheory(updatedTheory);
            localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
          }
          const updatedQuizzes = { ...quizData };
          if (updatedQuizzes[oldNum]) {
            updatedQuizzes[value] = updatedQuizzes[oldNum];
            delete updatedQuizzes[oldNum];
            setQuizData(updatedQuizzes);
            localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizzes));
          }
          setAdminSelectedLabNum(value);
        }
        return { ...lab, [field]: value };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleAddProblem = () => {
    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        const nextIndex = lab.problems.length > 0 ? Math.max(...lab.problems.map(p => p.index)) + 1 : 1;
        const newProblem = {
          index: nextIndex,
          title: "New Program Title",
          code: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello World!\\\\n\");\n    return 0;\n}",
          fileName: `program_${nextIndex}.c`,
          videoUrl: "",
          notesImageUrl: ""
        };
        return {
          ...lab,
          problems: [...lab.problems, newProblem]
        };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleDeleteProblem = (probIndex) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        const filtered = lab.problems.filter((_, idx) => idx !== probIndex);
        const reindexed = filtered.map((p, idx) => ({ ...p, index: idx + 1 }));
        return {
          ...lab,
          problems: reindexed
        };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleMoveProblem = (probIndex, direction) => {
    const targetIdx = probIndex + direction;
    const currentLab = labs.find(l => l.labNum === adminSelectedLabNum);
    if (!currentLab || targetIdx < 0 || targetIdx >= currentLab.problems.length) return;

    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        const problems = [...lab.problems];
        const temp = problems[probIndex];
        problems[probIndex] = problems[targetIdx];
        problems[targetIdx] = temp;
        const reindexed = problems.map((p, idx) => ({ ...p, index: idx + 1 }));
        return { ...lab, problems: reindexed };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleUpdateProblemField = (probIndex, field, value) => {
    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        const problems = lab.problems.map((p, idx) => {
          if (idx === probIndex) {
            return { ...p, [field]: value };
          }
          return p;
        });
        return { ...lab, problems };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleCreateTheoryNotes = () => {
    const updatedTheory = {
      ...theory,
      [adminSelectedLabNum]: {
        concept: "New Concept",
        summary: "Summary explanation of concept",
        keyPoints: ["Key objective point 1"],
        explanation: "<h4>Explanation Heading</h4><p>Explanation text detail...</p>"
      }
    };
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
  };

  const handleUpdateTheoryField = (field, value) => {
    const updatedTheory = {
      ...theory,
      [adminSelectedLabNum]: {
        ...theory[adminSelectedLabNum],
        [field]: value
      }
    };
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
  };

  const handleUpdateTheoryKeyPoint = (kpIndex, value) => {
    const keyPoints = [...(theory[adminSelectedLabNum]?.keyPoints || [])];
    keyPoints[kpIndex] = value;
    const updatedTheory = {
      ...theory,
      [adminSelectedLabNum]: {
        ...theory[adminSelectedLabNum],
        keyPoints
      }
    };
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
  };

  const handleAddTheoryKeyPoint = () => {
    const keyPoints = [...(theory[adminSelectedLabNum]?.keyPoints || []), "New Key Point"];
    const updatedTheory = {
      ...theory,
      [adminSelectedLabNum]: {
        ...theory[adminSelectedLabNum],
        keyPoints
      }
    };
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
  };

  const handleDeleteTheoryKeyPoint = (kpIndex) => {
    const keyPoints = (theory[adminSelectedLabNum]?.keyPoints || []).filter((_, idx) => idx !== kpIndex);
    const updatedTheory = {
      ...theory,
      [adminSelectedLabNum]: {
        ...theory[adminSelectedLabNum],
        keyPoints
      }
    };
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
  };

  const handleAddQuizQuestion = () => {
    const labQuizzes = quizData[adminSelectedLabNum] || [];
    const newQuiz = {
      question: "Which of the following is correct?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: 0,
      explanation: "Explanation detail"
    };
    const updatedQuizzes = {
      ...quizData,
      [adminSelectedLabNum]: [...labQuizzes, newQuiz]
    };
    setQuizData(updatedQuizzes);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleDeleteQuizQuestion = (qIdx) => {
    if (!window.confirm("Are you sure you want to delete this quiz question?")) return;
    const labQuizzes = (quizData[adminSelectedLabNum] || []).filter((_, idx) => idx !== qIdx);
    const updatedQuizzes = {
      ...quizData,
      [adminSelectedLabNum]: labQuizzes
    };
    setQuizData(updatedQuizzes);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleUpdateQuizField = (qIdx, field, value) => {
    const labQuizzes = [...(quizData[adminSelectedLabNum] || [])];
    labQuizzes[qIdx] = {
      ...labQuizzes[qIdx],
      [field]: value
    };
    const updatedQuizzes = {
      ...quizData,
      [adminSelectedLabNum]: labQuizzes
    };
    setQuizData(updatedQuizzes);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleUpdateQuizOption = (qIdx, optIdx, value) => {
    const labQuizzes = [...(quizData[adminSelectedLabNum] || [])];
    const options = [...(labQuizzes[qIdx].options || [])];
    options[optIdx] = value;
    labQuizzes[qIdx] = {
      ...labQuizzes[qIdx],
      options
    };
    const updatedQuizzes = {
      ...quizData,
      [adminSelectedLabNum]: labQuizzes
    };
    setQuizData(updatedQuizzes);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizzes));
  };

  const handleSaveToSupabase = async () => {
    if (!supabase) {
      alert("Supabase client is not initialized. Please verify your environment variables.");
      return;
    }

    setSaveStatus("Saving changes to Supabase database...");
    try {
      const activeLabNums = labs.map(l => l.labNum);

      // Delete any labs in Supabase that are no longer in our local state
      if (activeLabNums.length > 0) {
        const { error: delLabsErr } = await supabase.from('labs').delete().not('labNum', 'in', `(${activeLabNums.join(',')})`);
        if (delLabsErr) throw delLabsErr;

        const { error: delTheoryErr } = await supabase.from('theory').delete().not('labNum', 'in', `(${activeLabNums.join(',')})`);
        if (delTheoryErr) throw delTheoryErr;

        const { error: delQuizErr } = await supabase.from('quizzes').delete().not('labNum', 'in', `(${activeLabNums.join(',')})`);
        if (delQuizErr) throw delQuizErr;
      } else {
        const { error: delLabsErr } = await supabase.from('labs').delete().neq('labNum', -1);
        if (delLabsErr) throw delLabsErr;

        const { error: delTheoryErr } = await supabase.from('theory').delete().neq('labNum', -1);
        if (delTheoryErr) throw delTheoryErr;

        const { error: delQuizErr } = await supabase.from('quizzes').delete().neq('labNum', -1);
        if (delQuizErr) throw delQuizErr;
      }

      // Upsert labs
      for (const lab of labs) {
        const { error } = await supabase.from('labs').upsert({
          labNum: lab.labNum,
          tutorial: lab.tutorial,
          title: lab.title,
          problems: lab.problems
        });
        if (error) throw error;
      }

      // Upsert theory notes
      for (const labNumStr of Object.keys(theory)) {
        const num = parseInt(labNumStr, 10);
        const t = theory[labNumStr];
        const { error } = await supabase.from('theory').upsert({
          labNum: num,
          concept: t.concept,
          summary: t.summary,
          keyPoints: t.keyPoints || [],
          explanation: t.explanation
        });
        if (error) throw error;
      }

      // Upsert quizzes
      for (const labNumStr of Object.keys(quizData)) {
        const num = parseInt(labNumStr, 10);
        const qList = quizData[labNumStr];
        const { error } = await supabase.from('quizzes').upsert({
          labNum: num,
          questions: qList || []
        });
        if (error) throw error;
      }

      setSaveStatus("Saved to Supabase database successfully!");

      // Try local sync
      try {
        await fetch('/api/save-labs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(labs)
        });
        await fetch('/api/save-theory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(theory)
        });
        await fetch('/api/save-quizzes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizData)
        });
      } catch (e) {
        console.log("Local filesystem sync skipped (expected in production)");
      }

      setTimeout(() => setSaveStatus(""), 4000);
    } catch (error) {
      console.error(error);
      setSaveStatus(`Database Save Error: ${error.message}`);
      alert(`Database Save Error: ${error.message}`);
    }
  };


  const handleDownloadBackup = () => {
    const backup = {
      labs,
      theory,
      quizzes: quizData
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `c_lab_config_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetDefaults = () => {
    if (!window.confirm("Are you sure you want to discard ALL unsaved changes and restore the defaults from the codebase? This will clear browser storage overrides.")) return;
    localStorage.removeItem('c_lab_labs');
    localStorage.removeItem('c_lab_theory');
    localStorage.removeItem('c_lab_quizzes');

    setLabs(labsData);
    setTheory(theoryNotes);
    setQuizData(quizzes);

    setAdminSelectedLabNum(labsData[0]?.labNum || null);
    alert("Reset successful! Default configurations restored.");
  };

  // Flattened problems list for navigation
  const flatProblems = useMemo(() => {
    const list = [];
    labs.forEach(lab => {
      lab.problems.forEach(prob => {
        list.push({
          ...prob,
          lab: lab
        });
      });
    });
    return list;
  }, [labs]);

  const autoPlayNextRef = useRef(autoPlayNext);
  useEffect(() => {
    autoPlayNextRef.current = autoPlayNext;
  }, [autoPlayNext]);

  const handleNextVideoRef = useRef(null);

  const playbackSpeedRef = useRef(playbackSpeed);
  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Load saved theme settings
  useEffect(() => {
    const savedTheme = localStorage.getItem('c_lab_theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  // Dynamically load the YouTube IFrame API script
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
        if (typeof prevCallback === 'function') prevCallback();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }
  }, []);

  // Initialize YT.Player on changes
  useEffect(() => {
    if (!isApiReady || !selectedProblem || !selectedProblem.videoUrl) {
      if (playerRef.current) {
        destroyPlayer();
      }
      return;
    }

    const videoId = getYoutubeVideoId(selectedProblem.videoUrl);
    if (!videoId) {
      if (playerRef.current) {
        destroyPlayer();
      }
      return;
    }

    destroyPlayer();

    const timer = setTimeout(() => {
      const el = document.getElementById('yt-player');
      if (!el) return;

      playerRef.current = new window.YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: viewMode === 'revision' ? 1 : 0,
          controls: 1, // keeps native timeline overlay and settings
          rel: 0,
          showinfo: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {
            setIsPlayerReady(true);

            // Re-apply saved speed rate to the new video player
            if (playbackSpeedRef.current !== 1) {
              event.target.setPlaybackRate(playbackSpeedRef.current);
            }

            // Re-apply saved mute state
            if (isMutedRef.current) {
              event.target.mute();
            } else {
              event.target.unMute();
            }
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            if (event.data === window.YT.PlayerState.ENDED) {
              if (autoPlayNextRef.current) {
                handleNextVideoRef.current?.();
              }
            }
          }
        }
      });
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [isApiReady, selectedProblem, viewMode]);

  const destroyPlayer = () => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.error("Error destroying YT player", e);
      }
      playerRef.current = null;
    }
    setIsPlayerReady(false);
    setIsPlaying(false);
  };

  const handleNextProblem = useCallback(() => {
    if (flatProblems.length === 0) return;
    const currentIndex = flatProblems.findIndex(
      p => p.index === selectedProblem?.index && p.lab.labNum === selectedLab?.labNum
    );
    let nextIndex = 0;
    if (currentIndex !== -1) {
      nextIndex = (currentIndex + 1) % flatProblems.length;
    }
    const nextProb = flatProblems[nextIndex];
    setSelectedLab(nextProb.lab);
    setSelectedProblem(nextProb);
  }, [flatProblems, selectedProblem, selectedLab]);

  const handlePrevProblem = useCallback(() => {
    if (flatProblems.length === 0) return;
    const currentIndex = flatProblems.findIndex(
      p => p.index === selectedProblem?.index && p.lab.labNum === selectedLab?.labNum
    );
    let prevIndex = flatProblems.length - 1;
    if (currentIndex !== -1) {
      prevIndex = (currentIndex - 1 + flatProblems.length) % flatProblems.length;
    }
    const prevProb = flatProblems[prevIndex];
    setSelectedLab(prevProb.lab);
    setSelectedProblem(prevProb);
  }, [flatProblems, selectedProblem, selectedLab]);

  // Keep handleNextVideoRef up-to-date
  useEffect(() => {
    handleNextVideoRef.current = handleNextProblem;
  });

  // Auto-select first video/notes if revision/notes mode is active and no problem is selected
  useEffect(() => {
    if ((viewMode === 'revision' || viewMode === 'notes') && !selectedProblem && flatProblems.length > 0) {
      const firstProb = flatProblems[0];
      setSelectedLab(firstProb.lab);
      setSelectedProblem(firstProb);
    }
  }, [viewMode, selectedProblem, flatProblems]);

  // Modal keypress navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isNotesModalOpen) return;
      if (e.key === 'ArrowRight') {
        handleNextProblem();
      } else if (e.key === 'ArrowLeft') {
        handlePrevProblem();
      } else if (e.key === 'Escape') {
        setIsNotesModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNotesModalOpen, selectedProblem, handleNextProblem, handlePrevProblem]);

  // Video Actions
  const handlePlayPause = () => {
    if (!playerRef.current || !isPlayerReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSpeedChange = (rate) => {
    if (!playerRef.current || !isPlayerReady) return;
    playerRef.current.setPlaybackRate(rate);
    setPlaybackSpeed(rate);
  };

  const handleSeek = (offset) => {
    if (!playerRef.current || !isPlayerReady) return;
    const currentTime = playerRef.current.getCurrentTime();
    const duration = playerRef.current.getDuration();
    let newTime = currentTime + offset;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    playerRef.current.seekTo(newTime, true);
  };

  const handleToggleMute = () => {
    if (!playerRef.current || !isPlayerReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };



  // Notes auto scroll, virtual pointer HUD, and popup modal trigger
  const handleNotesButtonClick = (e) => {
    if (!selectedProblem || !selectedProblem.notesImageUrl) return;

    // Get starting coordinates from click event
    const startX = e.clientX;
    const startY = e.clientY;

    setVirtualPointer({
      active: true,
      x: startX,
      y: startY,
      phase: 'moving'
    });

    // 1. Scroll the diagram into view
    notesImageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 2. Wait for the scroll to finish, then calculate current target rect and glide the pointer
    setTimeout(() => {
      if (!notesImageRef.current) return;
      const rect = notesImageRef.current.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      setVirtualPointer(prev => ({
        ...prev,
        x: targetX,
        y: targetY
      }));

      // 3. Trigger click animation phase when target is reached
      setTimeout(() => {
        setVirtualPointer(prev => ({
          ...prev,
          phase: 'clicked'
        }));

        // 4. Open the popup modal and hide virtual pointer
        setTimeout(() => {
          setIsNotesModalOpen(true);
          setVirtualPointer({
            active: false,
            x: 0,
            y: 0,
            phase: 'idle'
          });
        }, 400); // click animation duration
      }, 1000); // glide duration
    }, 600); // scroll duration
  };

  // Theme Toggler
  const toggleTheme = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('c_lab_theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('c_lab_theme', 'dark');
    }
  };

  // Toggle lab groups expand/collapse state
  const toggleLabExpand = (labNum) => {
    setExpandedLabs(prev => ({
      ...prev,
      [labNum]: !prev[labNum]
    }));
  };

  // Select a Lab and select its first problem by default
  const handleSelectLab = (lab) => {
    setSelectedLab(lab);
    if (lab.problems && lab.problems.length > 0) {
      handleSelectProblem(lab.problems[0], lab);
    } else {
      setSelectedProblem(null);
    }
  };

  // Select a specific problem
  const handleSelectProblem = (problem, lab) => {
    setSelectedLab(lab);
    setSelectedProblem(problem);
    setCopied(false);
    setIsSidebarOpen(false); // Close sidebar on mobile select
  };

  // Search filtering
  const filteredLabs = labs.map(lab => {
    const matchesLab = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tutorial.toLowerCase().includes(searchQuery.toLowerCase());

    const matchedProblems = lab.problems.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchesLab || matchedProblems.length > 0) {
      return {
        ...lab,
        problems: matchedProblems
      };
    }
    return null;
  }).filter(Boolean);

  // Clipboard copy method
  const handleCopyCode = () => {
    if (!selectedProblem) return;
    navigator.clipboard.writeText(selectedProblem.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .c source code helper
  const handleDownloadCode = () => {
    if (!selectedProblem) return;
    const blob = new Blob([selectedProblem.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedProblem.fileName || `lab_${selectedLab.labNum}_p${selectedProblem.index}.c`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };




  // Convert typical YouTube link to embed url
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    return null;
  };

  const getDifficultyColor = (prob) => {
    if (prob.index > 5 || selectedLab?.labNum >= 8) return 'difficulty-hard';
    if (prob.index > 3 || selectedLab?.labNum >= 5) return 'difficulty-medium';
    return 'difficulty-easy';
  };

  const getDifficultyLabel = (prob) => {
    if (prob.index > 5 || selectedLab?.labNum >= 8) return 'Hard';
    if (prob.index > 3 || selectedLab?.labNum >= 5) return 'Medium';
    return 'Easy';
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      {viewMode === 'workspace' && (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-icon">
              <Terminal size={22} />
            </div>
            <div>
              <h1 className="logo-text">C-Lab</h1>
              <span className="logo-badge">V1.0</span>
            </div>
            <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Search Input */}
          <div className="sidebar-search">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search labs, problems, codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Sidebar Scroll List */}
          <div className="sidebar-scroll">
            {filteredLabs.length === 0 ? (
              <p className="no-matches">
                No matches found.
              </p>
            ) : (
              filteredLabs.map((lab) => {
                const isExpanded = !!expandedLabs[lab.labNum];
                const isSelected = selectedLab?.labNum === lab.labNum;

                return (
                  <div key={lab.labNum} className={`lab-group ${isSelected ? 'active' : ''}`}>
                    <button
                      onClick={() => {
                        toggleLabExpand(lab.labNum);
                        handleSelectLab(lab);
                      }}
                      className={`lab-header-btn ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="lab-title-wrapper">
                        <span className="lab-number">L{lab.labNum}</span>
                        <span className="lab-name" title={lab.title}>{lab.title}</span>
                      </div>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {isExpanded && (
                      <div className="problems-list">
                        {lab.problems.map((prob) => {
                          const isProbActive = selectedProblem?.index === prob.index && selectedLab?.labNum === lab.labNum;
                          return (
                            <button
                              key={prob.index}
                              onClick={() => handleSelectProblem(prob, lab)}
                              className={`problem-link-btn ${isProbActive ? 'active' : ''}`}
                            >
                              <span className="prob-num">#{prob.index}</span>
                              <span className="prob-title" title={prob.title}>{prob.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>
      )}

      {/* Main Content Pane */}
      <main className="main-wrapper">

        {/* Top Header */}
        <header className="topbar">
          <div className="topbar-left">
            {viewMode === 'workspace' && (
              <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
                <Menu size={20} />
              </button>
            )}
            <div className="topbar-title">
              {viewMode === 'home' ? (
                <span>Multi-Language Learning Hub</span>
              ) : viewMode === 'revision' ? (
                <span>Exam Video Revision</span>
              ) : viewMode === 'notes' ? (
                <span>Exam Notes Revision</span>
              ) : viewMode === 'admin' ? (
                <span>C-Lab Administrative Panel</span>
              ) : selectedLab ? (
                <span>Lab {selectedLab.labNum} / {selectedProblem ? selectedProblem.title : 'Overview'}</span>
              ) : (
                <span>Dashboard Home</span>
              )}
            </div>
          </div>

          <div className="topbar-right">
            <div className="viewmode-segmented-control">
              <button
                className={`segmented-btn ${viewMode === 'home' ? 'active' : ''}`}
                onClick={() => setViewMode('home')}
                title="Home Dashboard"
              >
                <Home size={14} />
                <span>Home</span>
              </button>
              <button
                className={`segmented-btn ${viewMode === 'workspace' ? 'active' : ''}`}
                onClick={() => setViewMode('workspace')}
                title="Code Workspace"
              >
                <Terminal size={14} />
                <span>Workspace</span>
              </button>
              <button
                className={`segmented-btn ${viewMode === 'revision' ? 'active' : ''}`}
                onClick={() => setViewMode('revision')}
                title="Exam Video Playlist"
              >
                <Tv size={14} />
                <span>Video Revision</span>
              </button>
              <button
                className={`segmented-btn ${viewMode === 'notes' ? 'active' : ''}`}
                onClick={() => setViewMode('notes')}
                title="Concept Notes Playlist"
              >
                <BookOpen size={14} />
                <span>Notes Revision</span>
              </button>
              <button
                className={`segmented-btn ${viewMode === 'admin' ? 'active' : ''}`}
                onClick={() => setViewMode('admin')}
                title="Admin Control Panel"
              >
                <Settings size={14} />
                <span>Admin</span>
              </button>
            </div>
            <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
              {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* Workspace Display or Revision Playlist Display or Notes Revision Display */}
        {viewMode === 'home' ? (
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
              
              {/* Quick Search */}
              <div className="hero-search-wrapper">
                <div className="hero-search-bar">
                  <Search size={18} />
                  <input
                    id="landing-search"
                    type="text"
                    className="hero-search-input"
                    placeholder="Search courses, modules, or key concepts..."
                    value={landingSearchQuery}
                    onChange={(e) => setLandingSearchQuery(e.target.value)}
                  />
                  <span className="search-shortcut-badge">Ctrl + K</span>
                </div>
              </div>

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

            {/* 3. Course Grid with Category Filters */}
            <section className="reveal-on-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div className="landing-filters-row">
                <div className="category-tabs-container">
                  {['All', 'Core Systems', 'Scripting & Data', 'Enterprise & OOPs'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`cat-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <span className="active-count-badge">
                  Showing {filteredCourses.length} of {COURSES.length} Courses
                </span>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="search-empty-state">
                  <Info size={40} />
                  <h3>No courses match your search query</h3>
                  <p>Try searching for keywords like "pointers", "sorting", "inheritance", or select another category filter.</p>
                </div>
              ) : (
                <div className="course-cards-grid">
                  {filteredCourses.map((course) => {
                    const isC = course.id === 'c';
                    return (
                      <div key={course.id} className={`course-card ${course.brandClass}`}>
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
                              onClick={() => setViewMode('workspace')}
                            >
                              <Play size={14} />
                              <span>Enter Workspace</span>
                            </button>
                          ) : course.status === 'preview' ? (
                            <button
                              type="button"
                              className="course-cta-btn secondary-cta"
                              onClick={() => {
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
                              onClick={() => {
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
              )}
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
          </div>
        ) : viewMode === 'revision' ? (
          <div className="revision-container">
            {/* Sidebar for Revision Mode */}
            <div className="playlist-sidebar">
              <div className="playlist-sidebar-header">
                <h3>Lab Video Solutions</h3>
                <span className="playlist-count">{flatProblems.length} Videos</span>
              </div>
              <div className="playlist-sidebar-scroll">
                {labs.map((lab) => (
                  <div key={lab.labNum} className="playlist-lab-group">
                    <div className="playlist-lab-title">
                      <span className="playlist-lab-num">Lab {lab.labNum}</span>
                      <span className="playlist-lab-name" title={lab.title}>{lab.title}</span>
                    </div>
                    <div className="playlist-problems">
                      {lab.problems.map((prob) => {
                        const isActive = selectedProblem?.index === prob.index && selectedLab?.labNum === lab.labNum;
                        return (
                          <button
                            key={prob.index}
                            onClick={() => handleSelectProblem(prob, lab)}
                            className={`playlist-problem-item ${isActive ? 'active' : ''}`}
                          >
                            <div className="playlist-item-meta">
                              <span className="playlist-item-index">#{prob.index}</span>
                              <span className="playlist-item-title" title={prob.title}>{prob.title}</span>
                            </div>
                            {isActive && <div className="playing-dot" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Player view */}
            <div className="playlist-main">
              {selectedProblem ? (
                <div className="playlist-player-card">
                  <div className="playlist-player-header">
                    <div className="playlist-problem-details">
                      <span className="playlist-lab-badge">Lab {selectedLab?.labNum}</span>
                      <h2>{selectedProblem.title}</h2>
                      <span className="filename-label">{selectedProblem.fileName}</span>
                    </div>
                    <button
                      className="action-btn-sm btn-go-workspace"
                      onClick={() => setViewMode('workspace')}
                    >
                      <span>Go to Code Workspace</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="playlist-video-player-container">
                    {selectedProblem.videoUrl ? (
                      <div className="video-player-wrapper">
                        <div className="video-frame-container">
                          <div id="yt-player"></div>
                        </div>

                        {/* Premium Custom Control Console */}
                        {isPlayerReady && (
                          <div className="video-custom-controls">
                            {/* Left: Playback controls */}
                            <div className="control-group main-controls">
                              <button onClick={() => handleSeek(-10)} className="control-btn" title="Rewind 10s">
                                <Rewind size={16} />
                              </button>

                              <button onClick={handlePlayPause} className="control-btn play-pause-btn" title={isPlaying ? "Pause" : "Play"}>
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                              </button>

                              <button onClick={() => handleSeek(10)} className="control-btn" title="Fast Forward 10s">
                                <FastForward size={16} />
                              </button>
                            </div>

                            <div className="control-divider"></div>

                            {/* Center: Playback Speed Control */}
                            <div className="control-group speed-controls">
                              <span className="control-label">Speed:</span>
                              <div className="speed-pills">
                                {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                                  <button
                                    key={speed}
                                    onClick={() => handleSpeedChange(speed)}
                                    className={`speed-pill ${playbackSpeed === speed ? 'active' : ''}`}
                                  >
                                    {speed === 1 ? 'Normal' : `${speed}x`}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="control-divider"></div>

                            {/* Right: Audio Volume Control */}
                            <div className="control-group volume-controls">
                              <button onClick={handleToggleMute} className="control-btn" title={isMuted ? "Unmute" : "Mute"}>
                                {isMuted ? <VolumeX size={16} className="text-danger" /> : <Volume2 size={16} />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="video-placeholder">
                        <Tv size={48} />
                        <p>No video walkthrough available for this problem</p>
                      </div>
                    )}
                  </div>

                  {/* Navigation controls */}
                  <div className="playlist-nav-actions">
                    <button onClick={handlePrevProblem} className="playlist-nav-btn prev-btn">
                      <ArrowLeft size={16} />
                      <span>Previous Video</span>
                    </button>

                    <label className="autoplay-toggle">
                      <input
                        type="checkbox"
                        checked={autoPlayNext}
                        onChange={(e) => setAutoPlayNext(e.target.checked)}
                      />
                      <span className="autoplay-toggle-text">Autoplay Next Video</span>
                    </label>

                    <button onClick={handleNextProblem} className="playlist-nav-btn next-btn">
                      <span>Next Video</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="playlist-empty-state">
                  <Tv size={48} />
                  <h3>Select a video from the playlist to begin studying</h3>
                </div>
              )}
            </div>
          </div>
        ) : viewMode === 'notes' ? (
          <div className="revision-container notes-revision-container">
            {/* Sidebar for Notes Mode */}
            <div className="playlist-sidebar">
              <div className="playlist-sidebar-header">
                <h3>Lab Concept Diagrams</h3>
                <span className="playlist-count">{flatProblems.length} Diagrams</span>
              </div>
              <div className="playlist-sidebar-scroll">
                {labs.map((lab) => (
                  <div key={lab.labNum} className="playlist-lab-group">
                    <div className="playlist-lab-title">
                      <span className="playlist-lab-num">Lab {lab.labNum}</span>
                      <span className="playlist-lab-name" title={lab.title}>{lab.title}</span>
                    </div>
                    <div className="playlist-problems">
                      {lab.problems.map((prob) => {
                        const isActive = selectedProblem?.index === prob.index && selectedLab?.labNum === lab.labNum;
                        return (
                          <button
                            key={prob.index}
                            onClick={() => handleSelectProblem(prob, lab)}
                            className={`playlist-problem-item ${isActive ? 'active' : ''}`}
                          >
                            <div className="playlist-item-meta">
                              <span className="playlist-item-index">#{prob.index}</span>
                              <span className="playlist-item-title" title={prob.title}>{prob.title}</span>
                            </div>
                            {isActive && <div className="playing-dot" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Notes view */}
            <div className="playlist-main notes-main-panel">
              {selectedProblem ? (
                <div className="playlist-player-card">
                  <div className="playlist-player-header">
                    <div className="playlist-problem-details">
                      <span className="playlist-lab-badge">Lab {selectedLab?.labNum}</span>
                      <h2>{selectedProblem.title}</h2>
                      <span className="filename-label">{selectedProblem.fileName}</span>
                    </div>
                    <div className="notes-header-actions">
                      {selectedProblem.notesImageUrl && selectedProblem.notesImageUrl.trim() !== '' && (
                        <button className="action-btn-sm btn-highlight-notes" onClick={handleNotesButtonClick}>
                          <BookOpen size={14} />
                          <span>Notes</span>
                        </button>
                      )}
                      <button
                        className="action-btn-sm btn-go-workspace"
                        onClick={() => setViewMode('workspace')}
                      >
                        <span>Go to Code Workspace</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="notes-playlist-content-grid">
                    {/* Reference Notes Diagram */}
                    {selectedProblem.notesImageUrl && selectedProblem.notesImageUrl.trim() !== '' ? (
                      <div className="notes-card notes-image-playlist-card" onClick={() => setIsNotesModalOpen(true)} style={{ cursor: 'pointer' }}>
                        <h4 className="section-title">Reference Notes Diagram (Click to Expand)</h4>
                        <div className="notes-image-frame" ref={notesImageRef}>
                          <img src={selectedProblem.notesImageUrl} alt="Reference Notes / Diagram" />
                        </div>
                      </div>
                    ) : (
                      <div className="notes-image-placeholder">
                        <BookOpen size={48} />
                        <p>No handwritten notes diagram available for this problem</p>
                      </div>
                    )}

                    {/* Theory Notes description */}
                    {selectedLab && theory[selectedLab.labNum] && (
                      <div className="notes-card notes-playlist-card">
                        <div className="notes-header-block">
                          <h3>{theory[selectedLab.labNum].concept}</h3>
                          <span className="notes-badge">Concept Notes</span>
                        </div>
                        <div className="notes-content">
                          <p className="concept-summary">
                            {theory[selectedLab.labNum].summary}
                          </p>

                          <h4 className="section-title">Key Objectives</h4>
                          <ul className="objectives-list">
                            {theory[selectedLab.labNum].keyPoints?.map((pt, i) => (
                              <li key={i} dangerouslySetInnerHTML={{ __html: pt }}></li>
                            ))}
                          </ul>

                          <div
                            className="detailed-explanation"
                            dangerouslySetInnerHTML={{ __html: theory[selectedLab.labNum].explanation || '' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation controls */}
                  <div className="playlist-nav-actions">
                    <button onClick={handlePrevProblem} className="playlist-nav-btn prev-btn">
                      <ArrowLeft size={16} />
                      <span>Previous Notes</span>
                    </button>

                    {selectedProblem.notesImageUrl && selectedProblem.notesImageUrl.trim() !== '' && (
                      <button className="action-btn-sm btn-highlight-notes" onClick={handleNotesButtonClick}>
                        <BookOpen size={14} />
                        <span>View Notes Popup</span>
                      </button>
                    )}

                    <button onClick={handleNextProblem} className="playlist-nav-btn next-btn">
                      <span>Next Notes</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="playlist-empty-state">
                  <BookOpen size={48} />
                  <h3>Select notes from the playlist to begin studying</h3>
                </div>
              )}
            </div>
          </div>
        ) : viewMode === 'admin' ? (
          !session ? (
            <AdminLoginForm onLoginSuccess={(sess) => setSession(sess)} />
          ) : (
            <div className="admin-container">
              {/* Admin Sidebar - list of labs */}
              <aside className="admin-sidebar">

                <div className="admin-sidebar-header">
                  <h3>Admin Console</h3>
                  <button className="admin-add-btn" onClick={handleAddLab} title="Add New Lab">
                    <Plus size={16} />
                    <span>Add Lab</span>
                  </button>
                </div>

                <div className="admin-labs-list">
                  {labs.map((lab, index) => (
                    <div
                      key={lab.labNum}
                      className={`admin-lab-item ${adminSelectedLabNum === lab.labNum ? 'active' : ''}`}
                      onClick={() => setAdminSelectedLabNum(lab.labNum)}
                    >
                      <div className="admin-lab-meta">
                        <span className="admin-lab-num">Lab {lab.labNum}</span>
                        <span className="admin-lab-title" title={lab.title}>{lab.title}</span>
                      </div>
                      <div className="admin-lab-actions" onClick={e => e.stopPropagation()}>
                        <button className="admin-icon-btn" onClick={() => handleMoveLab(index, -1)} disabled={index === 0} title="Move Up">
                          <ArrowUp size={12} />
                        </button>
                        <button className="admin-icon-btn" onClick={() => handleMoveLab(index, 1)} disabled={index === labs.length - 1} title="Move Down">
                          <ArrowDown size={12} />
                        </button>
                        <button className="admin-icon-btn text-danger" onClick={() => handleDeleteLab(lab.labNum)} title="Delete Lab">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Admin Main Area */}
              <div className="admin-main">
                {/* Top action bar for saving to codebase */}
                <div className="admin-topbar">
                  <div className="admin-status">
                    {saveStatus ? <span className="save-status-msg">{saveStatus}</span> : <span>Database connected. Click save to apply changes.</span>}
                  </div>
                  <div className="admin-global-actions">
                    <button className="action-btn-sm btn-save-codebase" onClick={handleSaveToSupabase}>
                      <Save size={14} />
                      <span>Save to Database</span>
                    </button>
                    <button className="action-btn-sm" onClick={handleDownloadBackup}>
                      <Download size={14} />
                      <span>Download Backup</span>
                    </button>
                    <button className="action-btn-sm" onClick={() => { setUploaderTargetProblemIndex(null); setIsImageUploaderOpen(true); }}>
                      <Image size={14} />
                      <span>Image to Link</span>
                    </button>
                    <button className="action-btn-sm text-danger" onClick={handleResetDefaults}>
                      <RotateCcw size={14} />
                      <span>Reset Defaults</span>
                    </button>
                    <button className="action-btn-sm btn-sign-out" onClick={() => supabase.auth.signOut()}>
                      <X size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>


                {/* Selected Lab Editor */}
                {selectedAdminLab ? (
                  <div className="admin-editor-card">
                    {/* Lab-wide Edit Fields */}
                    <div className="admin-section-card">
                      <h3>Lab {selectedAdminLab.labNum} Details</h3>
                      <div className="form-row-grid">
                        <div className="form-group">
                          <label>Lab Number</label>
                          <input
                            type="number"
                            value={selectedAdminLab.labNum}
                            onChange={e => handleUpdateLabField('labNum', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tutorial Tag</label>
                          <input
                            type="text"
                            value={selectedAdminLab.tutorial || ''}
                            onChange={e => handleUpdateLabField('tutorial', e.target.value)}
                          />
                        </div>
                        <div className="form-group double-col">
                          <label>Lab Title</label>
                          <input
                            type="text"
                            value={selectedAdminLab.title || ''}
                            onChange={e => handleUpdateLabField('title', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Editor Tabs (Problems, Concept Notes, Quizzes) */}
                    <div className="admin-tabs-header">
                      {['problems', 'theory', 'quizzes'].map(tab => (
                        <button
                          key={tab}
                          className={`admin-tab-btn ${adminActiveTab === tab ? 'active' : ''}`}
                          onClick={() => setAdminActiveTab(tab)}
                        >
                          {tab.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="admin-tab-content">
                      {/* Tab 1: Problems Editor */}
                      {adminActiveTab === 'problems' && (
                        <div className="admin-problems-editor">
                          <div className="section-header-row">
                            <h4>Problems List ({selectedAdminLab.problems?.length || 0})</h4>
                            <button className="admin-add-btn-sm" onClick={handleAddProblem}>
                              <Plus size={14} />
                              <span>Add Problem</span>
                            </button>
                          </div>

                          <div className="admin-problems-list">
                            {(selectedAdminLab.problems || []).map((prob, pIdx) => (
                              <div key={prob.index} className="admin-problem-edit-row">
                                <div className="problem-drag-meta">
                                  <span className="p-badge">#{prob.index}</span>
                                  <div className="p-nav-actions">
                                    <button onClick={() => handleMoveProblem(pIdx, -1)} disabled={pIdx === 0}>
                                      <ArrowUp size={12} />
                                    </button>
                                    <button onClick={() => handleMoveProblem(pIdx, 1)} disabled={pIdx === selectedAdminLab.problems.length - 1}>
                                      <ArrowDown size={12} />
                                    </button>
                                  </div>
                                </div>

                                <div className="problem-inputs-grid">
                                  <div className="form-group">
                                    <label>Title</label>
                                    <input
                                      type="text"
                                      value={prob.title || ''}
                                      onChange={e => handleUpdateProblemField(pIdx, 'title', e.target.value)}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label>Filename</label>
                                    <input
                                      type="text"
                                      value={prob.fileName || ''}
                                      onChange={e => handleUpdateProblemField(pIdx, 'fileName', e.target.value)}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label>Video Link (YouTube URL)</label>
                                    <input
                                      type="text"
                                      value={prob.videoUrl || ''}
                                      onChange={e => handleUpdateProblemField(pIdx, 'videoUrl', e.target.value)}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <div className="admin-field-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                      <label style={{ margin: 0 }}>Notes Image Link</label>
                                      <button
                                        type="button"
                                        className="admin-inline-upload-btn"
                                        onClick={() => {
                                          setUploaderTargetProblemIndex(pIdx);
                                          setIsImageUploaderOpen(true);
                                        }}
                                      >
                                        <Upload size={10} /> Upload / Paste
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={prob.notesImageUrl || ''}
                                      onChange={e => handleUpdateProblemField(pIdx, 'notesImageUrl', e.target.value)}
                                    />
                                  </div>

                                  <div className="form-group full-col">
                                    <label>C Code Editor</label>
                                    <textarea
                                      className="admin-code-textarea"
                                      value={prob.code || ''}
                                      onChange={e => handleUpdateProblemField(pIdx, 'code', e.target.value)}
                                      rows={12}
                                    />
                                  </div>
                                </div>

                                <button className="delete-problem-row-btn" onClick={() => handleDeleteProblem(pIdx)} title="Delete Problem">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tab 2: Theory Notes Editor */}
                      {adminActiveTab === 'theory' && (
                        <div className="admin-theory-editor">
                          <h4>Concept Notes for Lab {selectedAdminLab.labNum}</h4>

                          {selectedAdminTheory ? (
                            <div className="theory-inputs-grid">
                              <div className="form-group">
                                <label>Concept Name</label>
                                <input
                                  type="text"
                                  value={selectedAdminTheory.concept || ''}
                                  onChange={e => handleUpdateTheoryField('concept', e.target.value)}
                                />
                              </div>

                              <div className="form-group full-col">
                                <label>Summary Description</label>
                                <textarea
                                  value={selectedAdminTheory.summary || ''}
                                  onChange={e => handleUpdateTheoryField('summary', e.target.value)}
                                  rows={3}
                                />
                              </div>

                              <div className="form-group full-col">
                                <div className="section-header-row">
                                  <label>Key Objectives / Points (List)</label>
                                  <button className="admin-add-btn-sm" onClick={handleAddTheoryKeyPoint}>
                                    <Plus size={12} />
                                    <span>Add Point</span>
                                  </button>
                                </div>
                                <div className="theory-keypoints-list">
                                  {(selectedAdminTheory.keyPoints || []).map((kp, kpIdx) => (
                                    <div key={kpIdx} className="keypoint-edit-row">
                                      <input
                                        type="text"
                                        value={kp || ''}
                                        onChange={e => handleUpdateTheoryKeyPoint(kpIdx, e.target.value)}
                                      />
                                      <button onClick={() => handleDeleteTheoryKeyPoint(kpIdx)}>
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="form-group full-col">
                                <label>Detailed Explanation (HTML support)</label>
                                <textarea
                                  value={selectedAdminTheory.explanation || ''}
                                  onChange={e => handleUpdateTheoryField('explanation', e.target.value)}
                                  rows={10}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="admin-empty-state">
                              <p>No theory notes created for this Lab yet.</p>
                              <button className="admin-add-btn" onClick={handleCreateTheoryNotes}>
                                <Plus size={16} />
                                <span>Create Concept Notes</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tab 3: Quizzes Editor */}
                      {adminActiveTab === 'quizzes' && (
                        <div className="admin-quizzes-editor">
                          <div className="section-header-row">
                            <h4>Lab Quiz Questions</h4>
                            <button className="admin-add-btn-sm" onClick={handleAddQuizQuestion}>
                              <Plus size={14} />
                              <span>Add Question</span>
                            </button>
                          </div>

                          <div className="admin-quizzes-list">
                            {(quizData[selectedAdminLab.labNum] || []).map((quiz, qIdx) => (
                              <div key={qIdx} className="admin-quiz-edit-row">
                                <div className="quiz-inputs-grid">
                                  <div className="form-group full-col">
                                    <label>Question #{qIdx + 1}</label>
                                    <input
                                      type="text"
                                      value={quiz.question || ''}
                                      onChange={e => handleUpdateQuizField(qIdx, 'question', e.target.value)}
                                    />
                                  </div>

                                  <div className="form-group options-col">
                                    <label>Multiple Choices</label>
                                    {(quiz.options || []).map((opt, optIdx) => (
                                      <div key={optIdx} className="quiz-option-input-row">
                                        <span className="opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                                        <input
                                          type="text"
                                          value={opt || ''}
                                          onChange={e => handleUpdateQuizOption(qIdx, optIdx, e.target.value)}
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <div className="form-group select-col">
                                    <label>Correct Answer</label>
                                    <select
                                      value={quiz.answer}
                                      onChange={e => handleUpdateQuizField(qIdx, 'answer', parseInt(e.target.value) || 0)}
                                    >
                                      {[0, 1, 2, 3].map(val => (
                                        <option key={val} value={val}>
                                          Option {String.fromCharCode(65 + val)}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="form-group full-col">
                                    <label>Explanation / Rationale</label>
                                    <textarea
                                      value={quiz.explanation || ''}
                                      onChange={e => handleUpdateQuizField(qIdx, 'explanation', e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                </div>

                                <button className="delete-problem-row-btn" onClick={() => handleDeleteQuizQuestion(qIdx)} title="Delete Question">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                            {(!quizData[selectedAdminLab.labNum] || quizData[selectedAdminLab.labNum].length === 0) && (
                              <div className="admin-empty-state">
                                <p>No quiz questions added for this Lab yet.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="admin-empty-state">
                    <h3>Select a Lab from the sidebar or click "Add Lab" to start editing</h3>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="dashboard-content">

            {!selectedProblem ? (
              <div className="welcome-hero">
                <div className="welcome-hero-info">
                  <h2 className="welcome-hero-title">Academic C Programming Lab Portal</h2>
                  <p className="welcome-hero-text">
                    A minimal and distraction-free workspace for viewing solution source codes, reading key concept definitions, and watching problem walkthroughs.
                  </p>
                  <div className="welcome-stats">
                    <div className="stat-item">
                      <span className="stat-val">10</span>
                      <span className="stat-lbl">Labs</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-val">50+</span>
                      <span className="stat-lbl">Programs</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="workspace-container">

                {/* Problem Title & Actions */}
                <div className="problem-info-header">
                  <div className="problem-meta">
                    <h2>{selectedProblem.title}</h2>
                    <span className={`difficulty-badge ${getDifficultyColor(selectedProblem)}`}>
                      {getDifficultyLabel(selectedProblem)}
                    </span>
                    <span className="filename-label">{selectedProblem.fileName}</span>
                  </div>

                  <div className="code-viewer-actions">
                    {selectedProblem.notesImageUrl && selectedProblem.notesImageUrl.trim() !== '' && (
                      <button className="action-btn-sm btn-highlight-notes" onClick={handleNotesButtonClick}>
                        <BookOpen size={14} />
                        <span>Notes</span>
                      </button>
                    )}
                    <button className="action-btn-sm" onClick={handleCopyCode}>
                      {copied ? <Check size={14} style={{ color: 'var(--secondary)' }} /> : <Copy size={14} />}
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                    <button className="action-btn-sm" onClick={handleDownloadCode}>
                      <Download size={14} />
                      <span>Download .c</span>
                    </button>
                  </div>
                </div>

                {/* Code Viewer Box */}
                <div className="code-card">
                  <div className="code-window">
                    <pre className="code-pre">
                      <div className="line-numbers">
                        {(selectedProblem.code || '').split('\n').map((_, idx) => (
                          <div key={idx} className="line-num-item">{idx + 1}</div>
                        ))}
                      </div>
                      <code
                        className="code-content-rendered"
                        dangerouslySetInnerHTML={{ __html: highlightCSyntax(selectedProblem.code) }}
                      />
                    </pre>
                  </div>
                </div>


                {/* Highlighted Video section and Concept Notes */}
                <div className={`concept-video-grid ${!selectedProblem.videoUrl ? 'no-video' : ''}`}>

                  {/* Concept Notes Card */}
                  {selectedLab && theory[selectedLab.labNum] && (
                    <div className="notes-card">
                      <div className="notes-header-block">
                        <h3>{theory[selectedLab.labNum].concept}</h3>
                        <span className="notes-badge">Concept Notes</span>
                      </div>
                      <div className="notes-content">
                        <p className="concept-summary">
                          {theory[selectedLab.labNum].summary}
                        </p>

                        <h4 className="section-title">Key Objectives</h4>
                        <ul className="objectives-list">
                          {theory[selectedLab.labNum].keyPoints?.map((pt, i) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: pt }}></li>
                          ))}
                        </ul>

                        <div
                          className="detailed-explanation"
                          dangerouslySetInnerHTML={{ __html: theory[selectedLab.labNum].explanation || '' }}
                        />

                        {selectedProblem.notesImageUrl && selectedProblem.notesImageUrl.trim() !== '' && (
                          <div className="notes-image-container" ref={notesImageRef}>
                            <h4 className="section-title">Reference Notes Diagram (Click to Expand)</h4>
                            <div className="notes-image-frame" onClick={() => setIsNotesModalOpen(true)} style={{ cursor: 'pointer' }}>
                              <img src={selectedProblem.notesImageUrl} alt="Reference Notes / Diagram" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Highly Highlighted Video Card with Custom Playback & Speed Controls */}
                  {selectedProblem.videoUrl && (
                    <div className="video-card highlighted-video-card">
                      <div className="video-header">
                        <div className="video-title-row">
                          <h3>Video Walkthrough</h3>
                          <span className="highlight-badge">Recommended Study Tool</span>
                        </div>
                      </div>

                      <div className="video-player-wrapper">
                        <div className="video-frame-container">
                          <div id="yt-player"></div>
                        </div>

                        {/* Premium Custom Control Console */}
                        {isPlayerReady && (
                          <div className="video-custom-controls">
                            {/* Left: Playback controls */}
                            <div className="control-group main-controls">
                              <button onClick={() => handleSeek(-10)} className="control-btn" title="Rewind 10s">
                                <Rewind size={16} />
                              </button>

                              <button onClick={handlePlayPause} className="control-btn play-pause-btn" title={isPlaying ? "Pause" : "Play"}>
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                              </button>

                              <button onClick={() => handleSeek(10)} className="control-btn" title="Fast Forward 10s">
                                <FastForward size={16} />
                              </button>
                            </div>

                            <div className="control-divider"></div>

                            {/* Center: Playback Speed Control */}
                            <div className="control-group speed-controls">
                              <span className="control-label">Speed:</span>
                              <div className="speed-pills">
                                {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                                  <button
                                    key={speed}
                                    onClick={() => handleSpeedChange(speed)}
                                    className={`speed-pill ${playbackSpeed === speed ? 'active' : ''}`}
                                  >
                                    {speed === 1 ? 'Normal' : `${speed}x`}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="control-divider"></div>

                            {/* Right: Audio Volume Control */}
                            <div className="control-group volume-controls">
                              <button onClick={handleToggleMute} className="control-btn" title={isMuted ? "Unmute" : "Mute"}>
                                {isMuted ? <VolumeX size={16} className="text-danger" /> : <Volume2 size={16} />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}
      </main>

      {/* Immersive Notes Modal Popup */}
      {isNotesModalOpen && selectedProblem && (
        <div className="notes-modal-overlay" onClick={() => setIsNotesModalOpen(false)}>
          <div className="notes-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <div className="notes-modal-title-info">
                <span className="notes-modal-badge">Lab {selectedLab?.labNum} Notes</span>
                <h3>{selectedProblem.title}</h3>
              </div>
              <button className="notes-modal-close" onClick={() => setIsNotesModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="notes-modal-body">
              {/* Previous button */}
              <button className="modal-nav-btn prev" onClick={handlePrevProblem} title="Previous Diagram">
                <ArrowLeft size={24} />
              </button>

              <div className="modal-image-container">
                {selectedProblem.notesImageUrl ? (
                  <img src={selectedProblem.notesImageUrl} alt="Handwritten Notes Diagram" className="modal-diagram-img" />
                ) : (
                  <div className="modal-image-placeholder">
                    <BookOpen size={64} />
                    <p>No handwritten diagram notes available for this problem.</p>
                  </div>
                )}
              </div>

              {/* Next button */}
              <button className="modal-nav-btn next" onClick={handleNextProblem} title="Next Diagram">
                <ArrowRight size={24} />
              </button>
            </div>

            <div className="notes-modal-footer">
              <span className="notes-modal-filename">{selectedProblem.fileName}</span>
              <span className="notes-modal-instruction">Use Left/Right arrows or Escape to navigate diagram slides</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Button for Admin panel */}
      {viewMode === 'admin' && session && (
        <button
          className="admin-floating-save-btn"
          onClick={handleSaveToSupabase}
          title="Save Changes to Database"
        >
          <Save size={16} />
          <span>Save to Database</span>
        </button>
      )}

      {/* Image Uploader Modal Popup */}
      <ImageUploaderModal
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        supabase={supabase}
        targetProblemTitle={uploaderTargetProblemIndex !== null && selectedAdminLab?.problems[uploaderTargetProblemIndex] ? selectedAdminLab.problems[uploaderTargetProblemIndex].title : null}
        onInsertLink={(url) => {
          if (uploaderTargetProblemIndex !== null) {
            handleUpdateProblemField(uploaderTargetProblemIndex, 'notesImageUrl', url);
          }
        }}
      />

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

      {/* Futuristic Virtual HUD Pointer */}
      {virtualPointer.active && (
        <div
          className={`virtual-hud-pointer ${virtualPointer.phase}`}
          style={{
            left: `${virtualPointer.x}px`,
            top: `${virtualPointer.y}px`
          }}
        >
          <div className="hud-reticle"></div>
          <div className="hud-click-ripple"></div>
          <span className="hud-label">
            {virtualPointer.phase === 'moving' ? 'LOCKING TARGET...' : 'TARGET LOCKED'}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
