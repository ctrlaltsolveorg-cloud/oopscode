import React from 'react';
import { BookOpen, Copy, Check, Download, Rewind, Pause, Play, FastForward, VolumeX, Volume2 } from 'lucide-react';

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlightCSyntax(code) {
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

export default function WorkspaceView({
  selectedLab,
  selectedProblem,
  theory,
  copied,
  handleCopyCode,
  handleDownloadCode,
  handleNotesButtonClick,
  setIsNotesModalOpen,
  notesImageRef,
  isPlayerReady,
  isPlaying,
  playbackSpeed,
  isMuted,
  handleSeek,
  handlePlayPause,
  handleSpeedChange,
  handleToggleMute
}) {
  const getDifficultyLabel = (prob) => {
    if (!prob) return 'Easy';
    if (prob.index > 3 || selectedLab?.labNum >= 5) return 'Medium';
    return 'Easy';
  };

  const getDifficultyColor = (prob) => {
    const diff = getDifficultyLabel(prob);
    if (diff === 'Medium') return 'diff-medium';
    return 'diff-easy';
  };

  if (!selectedProblem) {
    return (
      <div className="welcome-hero">
        <div className="welcome-hero-info">
          <h2 className="welcome-hero-title">Academic C Programming Lab Portal</h2>
          <p className="welcome-hero-text">
            A minimal and distraction-free workspace for viewing solution source codes, reading key concept definitions, and watching problem walkthroughs.
          </p>
          <div className="welcome-stats">
            <div className="stat-item">
              <span className="stat-val">11</span>
              <span className="stat-lbl">Labs</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">50+</span>
              <span className="stat-lbl">Programs</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
}
