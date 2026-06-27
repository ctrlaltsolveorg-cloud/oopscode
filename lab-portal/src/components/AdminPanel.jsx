import React, { useState, useEffect } from 'react';
import { 
  Plus, ArrowUp, ArrowDown, Trash2, Save, Download, Image, RotateCcw, X, Edit2, Play, Eye, BookOpen, Settings, Upload, Check, Copy
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import labsData from '../data/labsData.json';
import { theoryNotes } from '../data/theoryNotes';
import { quizzes } from '../data/quizzes';

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

function ImageUploaderModal({ isOpen, onClose, targetProblemTitle, onInsertLink }) {
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

export default function AdminPanel({ 
  labs, 
  setLabs, 
  theory, 
  setTheory, 
  quizData, 
  setQuizData,
  session,
  setSession
}) {
  const [adminSelectedLabNum, setAdminSelectedLabNum] = useState(null);
  const [adminActiveTab, setAdminActiveTab] = useState('problems');
  const [saveStatus, setSaveStatus] = useState('');
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [uploaderTargetProblemIndex, setUploaderTargetProblemIndex] = useState(null);

  useEffect(() => {
    if (labs.length > 0 && adminSelectedLabNum === null) {
      setAdminSelectedLabNum(labs[0].labNum);
    }
  }, [labs]);

  const selectedAdminLab = labs.find(l => l.labNum === adminSelectedLabNum);
  const selectedAdminTheory = theory[adminSelectedLabNum];

  // Admin Mutation Handlers
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
        return { ...lab, [field]: value };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleAddProblem = () => {
    if (!selectedAdminLab) return;
    const nextIdx = selectedAdminLab.problems && selectedAdminLab.problems.length > 0
      ? Math.max(...selectedAdminLab.problems.map(p => p.index)) + 1
      : 1;

    const newProblem = {
      index: nextIdx,
      title: "New Problem Title",
      fileName: `lab_${selectedAdminLab.labNum}_prob_${nextIdx}.c`,
      desc: "Problem description details.",
      code: `// Lab ${selectedAdminLab.labNum} - Problem ${nextIdx}\n#include <stdio.h>\n\nint main() {\n    printf("Change this code\\n");\n    return 0;\n}`,
      videoUrl: ""
    };

    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        return {
          ...lab,
          problems: [...(lab.problems || []), newProblem]
        };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleDeleteProblem = (pIdx) => {
    if (!selectedAdminLab || !window.confirm("Are you sure you want to delete this problem?")) return;
    const updatedProblems = [...selectedAdminLab.problems];
    updatedProblems.splice(pIdx, 1);

    // Re-index remaining problems
    const reindexedProblems = updatedProblems.map((prob, i) => ({
      ...prob,
      index: i + 1
    }));

    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        return {
          ...lab,
          problems: reindexedProblems
        };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleMoveProblem = (pIdx, direction) => {
    const targetIdx = pIdx + direction;
    if (!selectedAdminLab || targetIdx < 0 || targetIdx >= selectedAdminLab.problems.length) return;

    const updatedProblems = [...selectedAdminLab.problems];
    const temp = updatedProblems[pIdx];
    updatedProblems[pIdx] = updatedProblems[targetIdx];
    updatedProblems[targetIdx] = temp;

    // Re-index
    const reindexedProblems = updatedProblems.map((prob, i) => ({
      ...prob,
      index: i + 1
    }));

    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        return {
          ...lab,
          problems: reindexedProblems
        };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleUpdateProblemField = (pIdx, field, value) => {
    if (!selectedAdminLab) return;
    const updatedProblems = (selectedAdminLab.problems || []).map((prob, idx) => {
      if (idx === pIdx) {
        return { ...prob, [field]: value };
      }
      return prob;
    });

    const updatedLabs = labs.map(lab => {
      if (lab.labNum === adminSelectedLabNum) {
        return {
          ...lab,
          problems: updatedProblems
        };
      }
      return lab;
    });
    setLabs(updatedLabs);
    localStorage.setItem('c_lab_labs', JSON.stringify(updatedLabs));
  };

  const handleUpdateTheoryField = (field, value) => {
    if (!adminSelectedLabNum) return;
    const currentTheory = theory[adminSelectedLabNum] || {
      concept: "New Concept Notes",
      summary: "Short viva exam checklist.",
      keyPoints: [],
      explanation: "Detailed explanation notes."
    };

    const updatedTheory = {
      ...theory,
      [adminSelectedLabNum]: {
        ...currentTheory,
        [field]: value
      }
    };
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
  };

  const handleUpdateTheoryKeyPoint = (kpIdx, value) => {
    if (!adminSelectedLabNum) return;
    const currentTheory = theory[adminSelectedLabNum] || { keyPoints: [] };
    const updatedKeyPoints = [...(currentTheory.keyPoints || [])];
    if (value === null) {
      updatedKeyPoints.splice(kpIdx, 1);
    } else {
      updatedKeyPoints[kpIdx] = value;
    }

    const updatedTheory = {
      ...theory,
      [adminSelectedLabNum]: {
        ...currentTheory,
        keyPoints: updatedKeyPoints
      }
    };
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
  };

  const handleAddTheoryKeyPoint = () => {
    if (!adminSelectedLabNum) return;
    const currentTheory = theory[adminSelectedLabNum] || { keyPoints: [] };
    const updatedKeyPoints = [...(currentTheory.keyPoints || []), "New Key Point"];

    const updatedTheory = {
      ...theory,
      [adminSelectedLabNum]: {
        ...currentTheory,
        keyPoints: updatedKeyPoints
      }
    };
    setTheory(updatedTheory);
    localStorage.setItem('c_lab_theory', JSON.stringify(updatedTheory));
  };

  const handleUpdateQuizQuestion = (qIdx, field, value) => {
    if (!adminSelectedLabNum) return;
    const currentQuiz = quizData[adminSelectedLabNum] || [];
    const updatedQuiz = currentQuiz.map((item, idx) => {
      if (idx === qIdx) {
        return { ...item, [field]: value };
      }
      return item;
    });

    const updatedQuizData = {
      ...quizData,
      [adminSelectedLabNum]: updatedQuiz
    };
    setQuizData(updatedQuizData);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizData));
  };

  const handleUpdateQuizOption = (qIdx, optIdx, value) => {
    if (!adminSelectedLabNum) return;
    const currentQuiz = quizData[adminSelectedLabNum] || [];
    const updatedQuiz = currentQuiz.map((item, idx) => {
      if (idx === qIdx) {
        const updatedOpts = [...item.options];
        updatedOpts[optIdx] = value;
        return { ...item, options: updatedOpts };
      }
      return item;
    });

    const updatedQuizData = {
      ...quizData,
      [adminSelectedLabNum]: updatedQuiz
    };
    setQuizData(updatedQuizData);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizData));
  };

  const handleAddQuizQuestion = () => {
    if (!adminSelectedLabNum) return;
    const currentQuiz = quizData[adminSelectedLabNum] || [];
    const newQuestion = {
      q: "New practice question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      ans: 0,
      vivaTip: "Brief viva tip explain details."
    };

    const updatedQuizData = {
      ...quizData,
      [adminSelectedLabNum]: [...currentQuiz, newQuestion]
    };
    setQuizData(updatedQuizData);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizData));
  };

  const handleDeleteQuizQuestion = (qIdx) => {
    if (!adminSelectedLabNum || !window.confirm("Are you sure you want to delete this question?")) return;
    const currentQuiz = quizData[adminSelectedLabNum] || [];
    const updatedQuiz = [...currentQuiz];
    updatedQuiz.splice(qIdx, 1);

    const updatedQuizData = {
      ...quizData,
      [adminSelectedLabNum]: updatedQuiz
    };
    setQuizData(updatedQuizData);
    localStorage.setItem('c_lab_quizzes', JSON.stringify(updatedQuizData));
  };

  const handleSaveToSupabase = async () => {
    if (!supabase) {
      alert("Supabase client is not initialized. Please verify your environment variables.");
      return;
    }

    setSaveStatus("Saving changes to Supabase database...");
    try {
      const activeLabNums = labs.map(l => l.labNum);

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

      for (const lab of labs) {
        const { error } = await supabase.from('labs').upsert({
          labNum: lab.labNum,
          tutorial: lab.tutorial,
          title: lab.title,
          problems: lab.problems
        });
        if (error) throw error;
      }

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

  if (!session) {
    return <AdminLoginForm onLoginSuccess={(sess) => setSession(sess)} />;
  }

  return (
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
        {/* Top action bar */}
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

            {/* Editor Tabs */}
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
                          <div className="form-group double-col">
                            <label>Problem Statement</label>
                            <textarea
                              value={prob.desc || ''}
                              onChange={e => handleUpdateProblemField(pIdx, 'desc', e.target.value)}
                            />
                          </div>
                          <div className="form-group double-col">
                            <label>C Solution Code</label>
                            <textarea
                              className="code-textarea"
                              value={prob.code || ''}
                              onChange={e => handleUpdateProblemField(pIdx, 'code', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Walkthrough Video URL (YouTube ID)</label>
                            <input
                              type="text"
                              value={prob.videoUrl || ''}
                              placeholder="e.g. dQw4w9WgXcQ"
                              onChange={e => handleUpdateProblemField(pIdx, 'videoUrl', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Handwritten Notes Diagram URL</label>
                            <div className="url-input-wrapper">
                              <input
                                type="text"
                                value={prob.notesImageUrl || ''}
                                placeholder="Upload or enter URL"
                                onChange={e => handleUpdateProblemField(pIdx, 'notesImageUrl', e.target.value)}
                              />
                              <button
                                className="inline-action-btn"
                                onClick={() => {
                                  setUploaderTargetProblemIndex(pIdx);
                                  setIsImageUploaderOpen(true);
                                }}
                                title="Upload Screenshot to Supabase Storage"
                              >
                                <Upload size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="form-group double-col" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                              className="action-btn-sm text-danger"
                              style={{ marginTop: '8px' }}
                              onClick={() => handleDeleteProblem(pIdx)}
                            >
                              <Trash2 size={12} />
                              <span>Delete Problem</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Theory Notes Editor */}
              {adminActiveTab === 'theory' && (
                <div className="admin-theory-editor">
                  <div className="form-group double-col">
                    <label>Main Topic Concept Title</label>
                    <input
                      type="text"
                      value={selectedAdminTheory?.concept || ''}
                      onChange={e => handleUpdateTheoryField('concept', e.target.value)}
                    />
                  </div>
                  <div className="form-group double-col">
                    <label>Short Viva Checklist Summary</label>
                    <textarea
                      value={selectedAdminTheory?.summary || ''}
                      onChange={e => handleUpdateTheoryField('summary', e.target.value)}
                    />
                  </div>
                  <div className="form-group double-col">
                    <label>Detailed Lecture Explanations</label>
                    <textarea
                      style={{ minHeight: '180px' }}
                      value={selectedAdminTheory?.explanation || ''}
                      onChange={e => handleUpdateTheoryField('explanation', e.target.value)}
                    />
                  </div>

                  <div className="theory-keypoints-editor">
                    <div className="section-header-row">
                      <h4>Key Revision Bullet Points</h4>
                      <button className="admin-add-btn-sm" onClick={handleAddTheoryKeyPoint}>
                        <Plus size={14} />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>
                    <div className="keypoints-edit-list">
                      {(selectedAdminTheory?.keyPoints || []).map((kp, kpIdx) => (
                        <div key={kpIdx} className="keypoint-edit-row">
                          <input
                            type="text"
                            value={kp}
                            onChange={e => handleUpdateTheoryKeyPoint(kpIdx, e.target.value)}
                          />
                          <button className="admin-icon-btn text-danger" onClick={() => handleUpdateTheoryKeyPoint(kpIdx, null)} title="Delete Bullet Point">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Quiz Questions Editor */}
              {adminActiveTab === 'quizzes' && (
                <div className="admin-quiz-editor">
                  <div className="section-header-row">
                    <h4>Viva Practice Questions ({(quizData[adminSelectedLabNum] || []).length})</h4>
                    <button className="admin-add-btn-sm" onClick={handleAddQuizQuestion}>
                      <Plus size={14} />
                      <span>Add Question</span>
                    </button>
                  </div>

                  <div className="quiz-edit-list">
                    {(quizData[adminSelectedLabNum] || []).map((qItem, qIdx) => (
                      <div key={qIdx} className="quiz-question-edit-row">
                        <div className="quiz-row-header">
                          <span className="q-badge">Q {qIdx + 1}</span>
                          <button className="admin-icon-btn text-danger" onClick={() => handleDeleteQuizQuestion(qIdx)} title="Delete Question">
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="form-group double-col">
                          <label>Question Text</label>
                          <input
                            type="text"
                            value={qItem.q}
                            onChange={e => handleUpdateQuizQuestion(qIdx, 'q', e.target.value)}
                          />
                        </div>
                        <div className="quiz-options-grid">
                          {qItem.options.map((opt, oIdx) => (
                            <div key={oIdx} className="form-group">
                              <label>Option {String.fromCharCode(65 + oIdx)}</label>
                              <input
                                type="text"
                                value={opt}
                                onChange={e => handleUpdateQuizOption(qIdx, oIdx, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="form-row-grid">
                          <div className="form-group">
                            <label>Correct Option Index (0-3)</label>
                            <select
                              value={qItem.ans}
                              onChange={e => handleUpdateQuizQuestion(qIdx, 'ans', parseInt(e.target.value))}
                            >
                              <option value={0}>Option A (Index 0)</option>
                              <option value={1}>Option B (Index 1)</option>
                              <option value={2}>Option C (Index 2)</option>
                              <option value={3}>Option D (Index 3)</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Viva explanation details</label>
                            <input
                              type="text"
                              value={qItem.vivaTip || ''}
                              onChange={e => handleUpdateQuizQuestion(qIdx, 'vivaTip', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="admin-empty-state">
            <Settings size={64} />
            <h3>Select a lab module from the admin console sidebar to begin editing</h3>
          </div>
        )}
      </div>

      {/* Floating Save Button */}
      {session && (
        <button
          className="admin-floating-save-btn"
          onClick={handleSaveToSupabase}
          title="Save Changes to Database"
        >
          <Save size={16} />
          <span>Save to Database</span>
        </button>
      )}

      {/* Image Uploader Modal */}
      <ImageUploaderModal
        isOpen={isImageUploaderOpen}
        onClose={() => setIsImageUploaderOpen(false)}
        targetProblemTitle={uploaderTargetProblemIndex !== null && selectedAdminLab?.problems[uploaderTargetProblemIndex] ? selectedAdminLab.problems[uploaderTargetProblemIndex].title : null}
        onInsertLink={(url) => {
          if (uploaderTargetProblemIndex !== null) {
            handleUpdateProblemField(uploaderTargetProblemIndex, 'notesImageUrl', url);
          }
        }}
      />
    </div>
  );
}
