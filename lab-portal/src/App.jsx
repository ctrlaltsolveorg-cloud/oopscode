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
import HomeLanding from './Home';
import WorkspaceView from './components/WorkspaceView';
import RevisionView from './components/RevisionView';
import NotesView from './components/NotesView';
import AdminPanel from './components/AdminPanel';



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

  const [dbLoading, setDbLoading] = useState(false);
  const [session, setSession] = useState(null);

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


  // Notes Modal & Virtual HUD Pointer States
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [virtualPointer, setVirtualPointer] = useState({
    active: false,
    x: 0,
    y: 0,
    phase: 'idle'
  });



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
          <HomeLanding setViewMode={setViewMode} />
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
          <AdminPanel
            labs={labs}
            setLabs={setLabs}
            theory={theory}
            setTheory={setTheory}
            quizData={quizData}
            setQuizData={setQuizData}
            session={session}
            setSession={setSession}
          />
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
