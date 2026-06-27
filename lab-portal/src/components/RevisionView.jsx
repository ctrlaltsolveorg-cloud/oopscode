import React from 'react';
import { ChevronRight, Rewind, Pause, Play, FastForward, VolumeX, Volume2, ArrowLeft, ArrowRight, Tv } from 'lucide-react';

export default function RevisionView({
  labs,
  selectedLab,
  selectedProblem,
  flatProblems,
  handleSelectProblem,
  handlePrevProblem,
  handleNextProblem,
  setViewMode,
  isPlayerReady,
  isPlaying,
  playbackSpeed,
  isMuted,
  handleSeek,
  handlePlayPause,
  handleSpeedChange,
  handleToggleMute,
  autoPlayNext,
  setAutoPlayNext
}) {
  return (
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
  );
}
