import React from 'react';
import { BookOpen, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

export default function NotesView({
  labs,
  theory,
  selectedLab,
  selectedProblem,
  flatProblems,
  handleSelectProblem,
  handlePrevProblem,
  handleNextProblem,
  handleNotesButtonClick,
  notesImageRef,
  setViewMode,
  setIsNotesModalOpen
}) {
  return (
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
  );
}
