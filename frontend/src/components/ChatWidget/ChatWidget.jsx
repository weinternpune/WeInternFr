import React, { useEffect, useRef, useState } from "react";
import {
  sendChat,
  getHistory,
  saveHistory,
  clearHistory as apiClearHistory,
} from "../../services/chatApi";
import LeadForm from "./LeadForm";
import {
  BsTrash,
  BsVolumeMuteFill,
  BsVolumeUpFill,
  BsMicFill,
  BsMicMuteFill,
  BsX,
  BsCheck2,
  BsCopy,
  BsPencilSquare,
  BsArrowClockwise,
  BsPlayFill,
  BsPauseFill,
  BsStopFill,
} from "react-icons/bs";
import { IoSend } from "react-icons/io5";

function AIBoyAvatar({ size = "small" }) {
  const sizes = {
    small: { width: "36px", height: "36px" },
    header: { width: "48px", height: "48px" },
    launcher: { width: "68px", height: "68px" },
  };

  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: "50%",
        ...sizes[size],
      }}
    >
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: "rgba(186, 230, 253, 0.5)" }} />
      <img
        src="/weintern_avatar.png"
        alt="WeIntern AI Assistant"
        draggable={false}
        style={{
          position: "absolute",
          left: size === "small" ? "-42%" : size === "header" ? "-40%" : "-39%",
          top: "-3%",
          height: "132%",
          width: size === "small" ? "184%" : "180%",
          maxWidth: "none",
          objectFit: "contain",
        }}
      />
    </div>
  );
}

function StudentAvatar() {
  return (
    <div
      style={{
        display: "flex",
        height: "36px",
        width: "36px",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "50%",
        border: "1px solid #dbeafe",
        background: "linear-gradient(135deg, #eff6ff, #e0e7ff)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <span style={{ fontSize: "20px" }} role="img" aria-label="Student">
        👩🏻‍🎓
      </span>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I am WeIntern AI Assistant ✨ How can I help you today?\n\nYou can ask me about our Internship Domains, Fees, Certification, Placement Support, or click Apply / Register below!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadStep, setLeadStep] = useState(0);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_domain: "",
  });

  const [sessionId, setSessionId] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceState, setVoiceState] = useState("IDLE");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [playingMessageIndex, setPlayingMessageIndex] = useState(-1);
  const [playbackState, setPlaybackState] = useState("IDLE");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const voiceModeRef = useRef(voiceMode);
  const voiceStateRef = useRef(voiceState);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const sentenceQueueRef = useRef([]);
  const currentSentenceIndexRef = useRef(0);
  const fullTextRef = useRef("");
  const isSpeechSupportedRef = useRef(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const activePlayIndexRef = useRef(-1);
  const pausedMessageIndexRef = useRef(-1);
  const isComponentMountedRef = useRef(true);
  const inputRef = useRef(null);

  useEffect(() => {
    let storedSession = localStorage.getItem("weintern_ai_session_id");
    if (!storedSession) {
      storedSession = "session_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
      localStorage.setItem("weintern_ai_session_id", storedSession);
    }
    setSessionId(storedSession);

    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechSynth = window.speechSynthesis;
      if (SpeechRecognition && speechSynth) {
        isSpeechSupportedRef.current = true;
        setIsSpeechSupported(true);
        synthesisRef.current = speechSynth;
      }
    }

    return () => {
      isComponentMountedRef.current = false;
      if (synthesisRef.current) synthesisRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, interimTranscript]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const processMessage = async (textToSend, source = "text") => {
    if (!textToSend.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsgObj = { sender: "user", text: textToSend, time: userTime };

    setMessages((prev) => [...prev, userMsgObj]);
    setIsTyping(true);

    try {
      if (sessionId) {
        saveHistory(sessionId, "user", textToSend);
      }
      const data = await sendChat(textToSend, source, sessionId);

      const botTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const botResponseText = data.reply || data.message || "I am available to answer your questions regarding WeIntern programs!";

      setMessages((prev) => [...prev, { sender: "bot", text: botResponseText, time: botTime }]);

      if (sessionId) {
        saveHistory(sessionId, "bot", botResponseText);
      }

      if (!isSpeakerMuted && (voiceModeRef.current || source === "voice")) {
        speakResponse(botResponseText);
      }
    } catch (err) {
      console.error("[ChatWidget] error:", err);
      const errTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Network connection issue. Please check your backend connection.", time: errTime },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || voiceState === "LISTENING") return;
    const msg = message.trim();
    setMessage("");
    await processMessage(msg, "text");
  };

  const quickReply = (type) => {
    let replyText = "";
    if (type === "apply") {
      replyText = "🚀 Apply / Register for Internship";
      setShowLeadForm(true);
    } else if (type === "fees") {
      replyText = "💰 Tell me about Fees & Payment options";
    } else if (type === "domains") {
      replyText = "💻 What internship domains do you offer?";
    } else if (type === "certificates") {
      replyText = "📜 Tell me about certificates & LORs";
    } else if (type === "contact") {
      replyText = "🎯 How can I contact WeIntern support team?";
    }
    processMessage(replyText, "quick_reply");
  };

  const speakResponse = (fullText) => {
    if (!synthesisRef.current || isSpeakerMuted) return;
    synthesisRef.current.cancel();

    fullTextRef.current = fullText;
    const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];
    sentenceQueueRef.current = sentences;
    currentSentenceIndexRef.current = 0;

    setPlaybackState("PLAYING");
    setVoiceState("SPEAKING");

    speakNextSentence();
  };

  const speakNextSentence = () => {
    if (currentSentenceIndexRef.current >= sentenceQueueRef.current.length) {
      setPlaybackState("IDLE");
      setVoiceState("IDLE");
      setPlayingMessageIndex(-1);
      return;
    }

    const sentence = sentenceQueueRef.current[currentSentenceIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(sentence);
    currentUtteranceRef.current = utterance;

    utterance.onend = () => {
      currentSentenceIndexRef.current++;
      speakNextSentence();
    };

    utterance.onerror = (e) => {
      console.warn("TTS error:", e);
      setPlaybackState("IDLE");
      setVoiceState("IDLE");
      setPlayingMessageIndex(-1);
    };

    synthesisRef.current.speak(utterance);
  };

  const handlePauseMessage = () => {
    if (synthesisRef.current && playbackState === "PLAYING") {
      synthesisRef.current.pause();
      setPlaybackState("PAUSED");
      setVoiceState("PAUSED");
    }
  };

  const handleResumeOrContinueMessage = () => {
    if (synthesisRef.current && playbackState === "PAUSED") {
      synthesisRef.current.resume();
      setPlaybackState("PLAYING");
      setVoiceState("SPEAKING");
    }
  };

  const handleStopMessage = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setPlaybackState("IDLE");
      setVoiceState("IDLE");
      setPlayingMessageIndex(-1);
      pausedMessageIndexRef.current = -1;
    }
  };

  const handlePlayMessage = (index, text) => {
    setPlayingMessageIndex(index);
    activePlayIndexRef.current = index;
    speakResponse(text);
  };

  const handleMute = () => {
    setIsSpeakerMuted(true);
    if (synthesisRef.current) synthesisRef.current.cancel();
    setPlaybackState("IDLE");
    showToast("Speaker muted");
  };

  const handleUnmute = () => {
    setIsSpeakerMuted(false);
    showToast("Speaker unmuted");
  };

  const startSpeechRecognition = () => {
    if (!isSpeechSupportedRef.current) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setVoiceState("LISTENING");
      setErrorMessage("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      setInterimTranscript(interim);
      if (final.trim()) {
        setInterimTranscript("");
        processMessage(final.trim(), "voice");
      }
    };

    recognition.onerror = (e) => {
      setErrorMessage("Voice recognition error: " + e.error);
      setVoiceState("ERROR");
    };

    recognition.onend = () => {
      if (voiceModeRef.current) {
        try { recognition.start(); } catch (err) {}
      } else {
        setVoiceState("IDLE");
      }
    };

    try { recognition.start(); } catch (err) {}
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setVoiceState("IDLE");
    }
  };

  const handleMicClick = () => {
    if (voiceState === "LISTENING") {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const handleCopyMessage = (index, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast("Message copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleEditMessage = (index, text) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const handleSaveEditedMessage = async (index) => {
    if (!editText.trim()) return;
    const updated = [...messages];
    updated[index].text = editText.trim();
    setMessages(updated);
    setEditingIndex(null);
    const newText = editText.trim();
    setEditText("");
    showToast("Message updated");
    await processMessage(newText, "text_edit");
  };

  const handleRetryMessage = async (previousUserText) => {
    showToast("Retrying response...");
    await processMessage(previousUserText, "retry");
  };

  const handleClearHistory = async () => {
    if (sessionId) {
      await apiClearHistory(sessionId);
    }
    setMessages([
      {
        sender: "bot",
        text: "👋 Chat history cleared! How can I assist you today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setShowClearConfirm(false);
    showToast("Chat history cleared!");
  };

  const handleCloseLeadForm = () => {
    setShowLeadForm(false);
    setLeadStep(0);
  };

  const handleSkipLeadForm = () => {
    setShowLeadForm(false);
    setLeadStep(0);
    showToast("Registration skipped");
  };

  return (
    <>
      <style>{`
        @keyframes boyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }
        @keyframes boyFloatBig {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes bubbleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulseOnline {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.75; }
        }
        @keyframes studentPop {
          from { transform: scale(0.75); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .boy-launcher { animation: boyFloat 3s ease-in-out infinite; }
        .boy-outside { animation: boyFloatBig 3.2s ease-in-out infinite; }
        .ask-bubble { animation: bubbleFloat 3s ease-in-out infinite; }
        .online-dot { animation: pulseOnline 2s ease-in-out infinite; }
        .student-pop { animation: studentPop 0.25s ease-out; }
        .sparkle { animation: sparkle 2s ease-in-out infinite; }
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Mobile responsive fixes */
        @media (max-width: 768px) {
          .boy-outside {
            display: none !important;
          }
          .ask-bubble {
            bottom: 155px !important;
            right: 16px !important;
          }
          .chat-widget-open {
            position: fixed !important;
            top: 120px !important;
            bottom: auto !important;
            right: 8px !important;
            left: auto !important;
            width: 340px !important;
            height: 500px !important;
            max-height: calc(100vh - 140px) !important;
            max-width: calc(100vw - 16px) !important;
            border-radius: 16px !important;
            overflow: hidden !important;
          }
          
          .chat-widget-open > div:first-child {
            border-radius: 16px 16px 0 0 !important;
          }
          .chat-launcher-btn {
            bottom: 5.5rem !important;
            right: 1rem !important;
          }
          
          /* Mobile emoji fixes */
          .chat-widget-open .emoji-text {
            font-size: 14px !important;
            line-height: 1.3 !important;
          }
          
          /* Mobile text sizing */
          .chat-widget-open .message-text {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }
          
          .chat-widget-open .quick-action-emoji {
            font-size: 18px !important;
          }
          
          .chat-widget-open .quick-action-title {
            font-size: 11px !important;
          }
          
          .chat-widget-open .quick-action-subtitle {
            font-size: 10px !important;
          }
          
          .chat-widget-open .quick-btn {
            font-size: 11px !important;
            padding: 6px 12px !important;
          }
          
          .chat-widget-open .header-title {
            font-size: 11px !important;
            white-space: nowrap !important;
          }
          
          .chat-widget-open .header-subtitle {
            font-size: 8px !important;
          }
          
          .chat-widget-open .time-text {
            font-size: 9px !important;
          }
          
          /* Fix header icon cropping on mobile */
          .chat-widget-open > div:first-child {
            padding: 10px 8px !important;
          }
          
          .chat-widget-open button {
            flex-shrink: 0 !important;
          }
          
          .chat-widget-open > div:first-child > div > div:last-child {
            gap: 4px !important;
          }
          
          .chat-widget-open > div:first-child button {
            height: 28px !important;
            width: 28px !important;
          }
        }
      `}</style>

      {/* CLOSED LAUNCHER STATE - Positioned gracefully to the left of WhatsApp float */}
      {!open && (
        <>
          <div className="ask-bubble" style={{ position: "fixed", bottom: "105px", right: "90px", zIndex: 9998 }}>
            <div style={{ position: "relative", borderRadius: "16px", border: "1px solid #dbeafe", backgroundColor: "#ffffff", padding: "8px 14px", boxShadow: "0 12px 35px rgba(15,23,42,0.15)", fontFamily: "'Poppins', sans-serif" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>
                💡 Ask me anything!
              </div>
              <div style={{ position: "absolute", bottom: "-6px", right: "20px", width: "12px", height: "12px", transform: "rotate(45deg)", borderRight: "1px solid #dbeafe", borderBottom: "1px solid #dbeafe", backgroundColor: "#ffffff" }} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open WeIntern AI Assistant"
            className="chat-launcher-btn"
            style={{ position: "fixed", bottom: "1.75rem", right: "5.75rem", zIndex: 9999, border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
          >
            <div className="boy-launcher" style={{ position: "relative", display: "flex", height: "68px", width: "68px", alignItems: "center", justifyCenter: "center", borderRadius: "50%", border: "3px solid #ffffff", background: "linear-gradient(135deg, #38bdf8, #2563eb, #1e40af)", boxShadow: "0 12px 40px rgba(14,116,244,0.4)" }}>
              <AIBoyAvatar size="launcher" />
              <span className="online-dot" style={{ position: "absolute", bottom: 0, right: 0, height: "18px", width: "18px", borderRadius: "50%", border: "3px solid #ffffff", backgroundColor: "#22c55e" }} />
            </div>
          </button>
        </>
      )}

      {/* OPEN CHAT STATE */}
      {open && (
        <>
          {/* DESKTOP 3D MASCOT */}
          <div className="boy-outside pointer-events-none" style={{ position: "fixed", bottom: "1.75rem", right: "475px", zIndex: 9997, display: "block" }}>
            <div style={{ position: "relative", height: "420px", width: "260px" }}>
              <div style={{ position: "absolute", bottom: 0, left: "50%", height: "96px", width: "140px", transform: "translateX(-50%)", borderRadius: "50%", backgroundColor: "rgba(125, 211, 252, 0.25)", filter: "blur(24px)" }} />
              <img
                src="/weintern_mascot.png"
                alt="WeIntern AI Assistant"
                draggable={false}
                style={{ position: "absolute", inset: 0, height: "100%", width: "100%", objectFit: "contain", filter: "drop-shadow(0 25px 30px rgba(15,23,42,0.25))" }}
              />
              <span className="sparkle" style={{ position: "absolute", right: "8px", top: "32px", fontSize: "24px" }}>✨</span>
              <span className="sparkle" style={{ position: "absolute", left: 0, top: "112px", fontSize: "20px", animationDelay: "0.5s" }}>✨</span>
            </div>
          </div>

          {/* CHAT WINDOW CONTAINER */}
          <div
            className="chat-widget-open"
            style={{
              position: "fixed",
              bottom: "1.75rem",
              right: "1.75rem",
              zIndex: 99999,
              display: "flex",
              height: "min(580px, calc(100vh - 40px))",
              width: "360px",
              maxWidth: "calc(100vw - 32px)",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              boxShadow: "0 25px 90px rgba(15,23,42,0.30)",
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {/* HEADER */}
            <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0784dc, #087fce, #0759a5)", padding: "12px 14px", color: "#ffffff" }}>
              <div style={{ position: "absolute", right: "-64px", top: "-80px", height: "192px", width: "192px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", filter: "blur(48px)" }} />
              <div style={{ position: "absolute", left: "-80px", bottom: "-80px", height: "176px", width: "176px", borderRadius: "50%", backgroundColor: "rgba(165,243,252,0.1)", filter: "blur(48px)" }} />

              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ position: "relative", display: "flex", height: "40px", width: "40px", alignItems: "center", justifyCenter: "center", overflow: "hidden", borderRadius: "50%", border: "2px solid #ffffff", backgroundColor: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    <img
                      src="/weintern_avatar.png"
                      alt="WeIntern AI Assistant"
                      draggable={false}
                      style={{ position: "absolute", left: "-40%", top: "-3%", height: "132%", width: "180%", maxWidth: "none", objectFit: "contain" }}
                    />
                    <span style={{ position: "absolute", bottom: 0, right: 0, height: "12px", width: "12px", borderRadius: "50%", border: "2px solid #ffffff", backgroundColor: "#22c55e" }} />
                  </div>

                  <div>
                    <h2 className="header-title" style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "-0.02em", color: "#ffffff", margin: 0, whiteSpace: "nowrap" }}>
                      WeIntern AI Assistant ✨
                    </h2>
                    <div className="header-subtitle" style={{ marginTop: "2px", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "rgba(255,255,255,0.85)" }}>
                      <span style={{ height: "5px", width: "5px", borderRadius: "50%", backgroundColor: "#86efac" }} />
                      <span>Here to help you 24/7 {voiceMode && "• Voice Active"}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    title="Clear chat history"
                    style={{ display: "flex", height: "28px", width: "28px", alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff", border: "none", cursor: "pointer" }}
                  >
                    <BsTrash size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => isSpeakerMuted ? handleUnmute() : handleMute()}
                    title={isSpeakerMuted ? "Unmute bot output" : "Mute bot output"}
                    style={{ display: "flex", height: "28px", width: "28px", alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff", border: "none", cursor: "pointer" }}
                  >
                    {isSpeakerMuted ? <BsVolumeMuteFill size={14} /> : <BsVolumeUpFill size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const mode = !voiceMode;
                      setVoiceMode(mode);
                      voiceModeRef.current = mode;
                      if (mode) {
                        startSpeechRecognition();
                      } else {
                        stopSpeechRecognition();
                        if (synthesisRef.current) synthesisRef.current.cancel();
                        setVoiceState("IDLE");
                      }
                    }}
                    title={voiceMode ? "Disable Voice Mode" : "Enable Voice Mode"}
                    style={{
                      display: "flex",
                      height: "28px",
                      width: "28px",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: voiceMode ? "#fbbf24" : "rgba(255,255,255,0.15)",
                      color: voiceMode ? "#0f172a" : "#ffffff",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "700"
                    }}
                  >
                    {voiceMode ? <BsMicFill size={14} /> : <BsMicMuteFill size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close chat"
                    style={{ display: "flex", height: "28px", width: "28px", alignItems: "center", justifyContent: "center", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.25)", color: "#ffffff", border: "none", cursor: "pointer" }}
                  >
                    <BsX size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
              <div style={{ position: "absolute", top: "75px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(30,41,59,0.95)", color: "#ffffff", fontSize: "12px", padding: "6px 14px", borderRadius: "999px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 50, fontWeight: "500" }}>
                {toastMessage}
              </div>
            )}

            {/* Clear History Confirmation Modal */}
            {showClearConfirm && (
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                <div style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "20px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", maxWidth: "280px", width: "100%", textAlign: "center", border: "1px solid #f1f5f9" }}>
                  <div style={{ width: "44px", height: "44px", backgroundColor: "#fee2e2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: "20px" }}>
                    <BsTrash />
                  </div>
                  <h3 style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px", margin: "0 0 4px" }}>Clear Chat History?</h3>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 16px" }}>All saved messages for this session will be deleted.</p>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", color: "#334155", backgroundColor: "#ffffff", fontWeight: 500, flex: 1, cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearHistory}
                      style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "8px", border: "none", color: "#ffffff", backgroundColor: "#dc2626", fontWeight: 600, flex: 1, cursor: "pointer", boxShadow: "0 2px 8px rgba(220,38,38,0.3)" }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Apply / Register Lead Form Modal Overlay */}
            {showLeadForm && (
              <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)", zIndex: 50, padding: "16px", overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", maxWidth: "380px", margin: "auto" }}>
                  <LeadForm
                    onClose={handleCloseLeadForm}
                    onSkip={handleSkipLeadForm}
                    onSuccess={(applicantName) => {
                      setMessages((prev) => [
                        ...prev,
                        {
                          sender: "bot",
                          text: `🎉 Thank you for registering, ${applicantName}! Your details have been submitted successfully. Our team will contact you soon.`,
                          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        },
                      ]);
                      setTimeout(() => {
                        handleCloseLeadForm();
                      }, 2000);
                    }}
                  />
                </div>
              </div>
            )}

            {/* CHAT BODY */}
            <div className="chat-scroll" style={{ flex: 1, overflowY: "auto", backgroundColor: "#f7faff", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* WELCOME CARD & QUICK ACTION GRID */}
              {messages.length <= 2 && (
                <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <AIBoyAvatar size="small" />
                    <div style={{ maxWidth: "82%", borderRadius: "16px 16px 16px 4px", border: "1px solid #f1f5f9", backgroundColor: "#ffffff", padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <p className="emoji-text" style={{ fontSize: "13px", fontWeight: 600, lineHeight: "1.4", color: "#334155", margin: 0 }}>
                        Hi there! 👋
                      </p>
                      <p className="message-text" style={{ marginTop: "4px", fontSize: "12px", lineHeight: "1.4", color: "#64748b", margin: 0 }}>
                        I'm your WeIntern AI Assistant. Ask me anything about internships, courses, certificates, fees or placement.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", paddingLeft: "44px" }}>
                    <button
                      type="button"
                      onClick={() => quickReply("domains")}
                      style={{ borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "10px 12px", textAlign: "left", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <div className="quick-action-emoji" style={{ fontSize: "16px" }}>📚</div>
                      <div className="quick-action-title" style={{ marginTop: "4px", fontSize: "11px", fontWeight: "700", color: "#334155" }}>Internship</div>
                      <div className="quick-action-subtitle" style={{ fontSize: "10px", color: "#94a3b8" }}>Programs</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => quickReply("fees")}
                      style={{ borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "10px 12px", textAlign: "left", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <div className="quick-action-emoji" style={{ fontSize: "16px" }}>💰</div>
                      <div className="quick-action-title" style={{ marginTop: "4px", fontSize: "11px", fontWeight: "700", color: "#334155" }}>Fees & Payment</div>
                      <div className="quick-action-subtitle" style={{ fontSize: "10px", color: "#94a3b8" }}>Pricing info</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => quickReply("certificates")}
                      style={{ borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "10px 12px", textAlign: "left", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <div className="quick-action-emoji" style={{ fontSize: "16px" }}>📜</div>
                      <div className="quick-action-title" style={{ marginTop: "4px", fontSize: "11px", fontWeight: "700", color: "#334155" }}>Certificates</div>
                      <div className="quick-action-subtitle" style={{ fontSize: "10px", color: "#94a3b8" }}>Learn more</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => quickReply("contact")}
                      style={{ borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "10px 12px", textAlign: "left", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <div className="quick-action-emoji" style={{ fontSize: "16px" }}>🎯</div>
                      <div className="quick-action-title" style={{ marginTop: "4px", fontSize: "11px", fontWeight: "700", color: "#334155" }}>Placement</div>
                      <div className="quick-action-subtitle" style={{ fontSize: "10px", color: "#94a3b8" }}>Support</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => quickReply("apply")}
                      style={{ gridColumn: "span 2", borderRadius: "12px", border: "1px solid #bfdbfe", background: "linear-gradient(to right, #eff6ff, #ffffff)", padding: "12px", textAlign: "left", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ display: "flex", height: "36px", width: "36px", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8, #1d4ed8)", color: "#ffffff", fontSize: "18px" }}>
                          🚀
                        </div>
                        <div>
                          <div className="quick-action-title" style={{ fontSize: "12px", fontWeight: "700", color: "#1d4ed8" }}>Apply / Register</div>
                          <div className="quick-action-subtitle" style={{ fontSize: "10px", color: "#94a3b8" }}>Start your WeIntern journey</div>
                        </div>
                        <div style={{ marginLeft: "auto", color: "#2563eb", fontWeight: "700", fontSize: "14px" }}>→</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* MESSAGES LIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "8px",
                      justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
                    }}
                  >
                    {msg.sender === "bot" && <AIBoyAvatar size="small" />}
                    {msg.sender === "user" && (
                      <div style={{ order: 2 }}>
                        <StudentAvatar />
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: "76%",
                        padding: "10px 14px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        backgroundColor: msg.sender === "user" ? "#168de2" : "#ffffff",
                        color: msg.sender === "user" ? "#ffffff" : "#334155",
                        border: msg.sender === "user" ? "none" : "1px solid #f1f5f9",
                        order: msg.sender === "user" ? 1 : 0
                      }}
                    >
                      {editingIndex === index ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "200px" }}>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveEditedMessage(index);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                            autoFocus
                            rows={Math.max(2, editText.split("\n").length)}
                            style={{ width: "100%", backgroundColor: "#ffffff", color: "#0f172a", fontSize: "13px", padding: "8px", borderRadius: "8px", border: "1px solid #93c5fd", outline: "none", resize: "none" }}
                          />
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                            <button
                              onClick={handleCancelEdit}
                              style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", backgroundColor: "rgba(29,78,216,0.8)", color: "#ffffff", border: "none", cursor: "pointer" }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEditedMessage(index)}
                              style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", backgroundColor: "#10b981", color: "#ffffff", border: "none", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                            >
                              <BsCheck2 size={14} />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="message-text" style={{ whiteSpace: "pre-line", fontSize: "13px", lineHeight: "1.4" }}>
                            {msg.text}
                          </div>
                          {msg.sender === "bot" && (leadStep > 0 || showLeadForm) && (msg.text.includes("registered") || msg.text.includes("Please enter your")) && (
                            <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={handleSkipLeadForm}
                                style={{ padding: "6px 12px", backgroundColor: "#f1f5f9", color: "#1e293b", fontWeight: 600, borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "12px", cursor: "pointer" }}
                              >
                                ⏩ Skip Registration / Continue without Registration
                              </button>
                              <button
                                type="button"
                                onClick={handleCloseLeadForm}
                                style={{ padding: "6px 10px", backgroundColor: "#fef2f2", color: "#b91c1c", fontWeight: 700, borderRadius: "8px", border: "1px solid #fecaca", fontSize: "12px", cursor: "pointer" }}
                              >
                                ✖ Close
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Action Bar & Footer */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          marginTop: "8px",
                          paddingTop: "6px",
                          borderTop: msg.sender === "user" ? "1px solid rgba(255,255,255,0.2)" : "1px solid #f1f5f9",
                          fontSize: "10px",
                          color: msg.sender === "user" ? "#dbeafe" : "#94a3b8"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={() => handleCopyMessage(index, msg.text)}
                            title="Copy text"
                            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                          >
                            {copiedIndex === index ? (
                              <>
                                <BsCheck2 size={14} color="#34d399" />
                                <span className="time-text" style={{ fontSize: "10px", color: "#34d399", fontWeight: 600 }}>Copied!</span>
                              </>
                            ) : (
                              <BsCopy size={12} />
                            )}
                          </button>

                          {msg.sender === "user" && (
                            <button
                              onClick={() => handleEditMessage(index, msg.text)}
                              title="Edit message"
                              style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
                            >
                              <BsPencilSquare size={12} />
                            </button>
                          )}

                          {msg.sender === "bot" && index > 0 && messages[index - 1]?.sender === "user" && (
                            <button
                              onClick={() => handleRetryMessage(messages[index - 1].text)}
                              title="Retry response"
                              style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
                            >
                              <BsArrowClockwise size={12} />
                            </button>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {msg.sender === "bot" && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {((playingMessageIndex === index || pausedMessageIndexRef.current === index) || ((playingMessageIndex === -1 || pausedMessageIndexRef.current === -1) && index === messages.length - 1)) ? (
                                <>
                                  {playbackState === "PLAYING" ? (
                                    <button onClick={handlePauseMessage} title="Pause response" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                                      <BsPauseFill size={16} />
                                    </button>
                                  ) : (
                                    <button onClick={() => playbackState === "PAUSED" ? handleResumeOrContinueMessage() : handlePlayMessage(index, msg.text)} title="Resume response" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                                      <BsPlayFill size={16} />
                                    </button>
                                  )}
                                  <button onClick={handleStopMessage} title="Stop response" style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                    <BsStopFill size={16} />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => handlePlayMessage(index, msg.text)} title="Speak response" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                                  <BsPlayFill size={16} />
                                </button>
                              )}
                            </div>
                          )}
                          <span className="time-text" style={{ fontSize: "9px" }}>{msg.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Interim Transcript display for user speech */}
                {voiceState === "LISTENING" && interimTranscript && (
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: "8px" }}>
                    <StudentAvatar />
                    <div style={{ backgroundColor: "#e2e8f0", color: "#334155", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", fontStyle: "italic", fontSize: "13px", maxWidth: "76%" }}>
                      🎤 {interimTranscript}...
                    </div>
                  </div>
                )}

                {/* TYPING INDICATOR */}
                {isTyping && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                    <AIBoyAvatar size="small" />
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", borderRadius: "16px 16px 16px 4px", border: "1px solid #f1f5f9", backgroundColor: "#ffffff", padding: "12px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Voice State Information Panel */}
            {(voiceMode || playbackState !== "IDLE") && (
              <div style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "8px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {voiceState === "LISTENING" && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#dc2626", backgroundColor: "#fef2f2", padding: "8px", borderRadius: "8px", border: "1px solid #fee2e2" }}>
                    <span style={{ fontWeight: "500" }}>🎤 Listening... speak now</span>
                    <button onClick={stopSpeechRecognition} style={{ fontSize: "10px", color: "#64748b", textDecoration: "underline", border: "none", background: "none", cursor: "pointer" }}>Cancel</button>
                  </div>
                )}
                {voiceState === "SPEAKING" && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#2563eb", backgroundColor: "#eff6ff", padding: "8px", borderRadius: "8px", border: "1px solid #dbeafe" }}>
                    <span>Bot is speaking...</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={handlePauseMessage} style={{ padding: "4px 8px", fontSize: "10px", backgroundColor: "#2563eb", color: "#ffffff", borderRadius: "4px", border: "none", cursor: "pointer" }}>Pause</button>
                      <button onClick={handleStopMessage} style={{ padding: "4px 8px", fontSize: "10px", backgroundColor: "#ef4444", color: "#ffffff", borderRadius: "4px", border: "none", cursor: "pointer" }}>Stop</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* QUICK BUTTONS */}
            <div style={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "10px 12px" }}>
              <div className="no-scrollbar" style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                <button
                  type="button"
                  onClick={() => quickReply("apply")}
                  className="quick-btn"
                  style={{ flexShrink: 0, borderRadius: "999px", border: "1px solid #bfdbfe", backgroundColor: "#eff6ff", padding: "6px 14px", fontSize: "11px", fontWeight: "600", color: "#1d4ed8", cursor: "pointer" }}
                >
                  🚀 Apply
                </button>

                <button
                  type="button"
                  onClick={() => quickReply("fees")}
                  className="quick-btn"
                  style={{ flexShrink: 0, borderRadius: "999px", border: "1px solid #bfdbfe", backgroundColor: "#eff6ff", padding: "6px 14px", fontSize: "11px", fontWeight: "500", color: "#1d4ed8", cursor: "pointer" }}
                >
                  💰 Fees
                </button>

                <button
                  type="button"
                  onClick={() => quickReply("domains")}
                  className="quick-btn"
                  style={{ flexShrink: 0, borderRadius: "999px", border: "1px solid #bfdbfe", backgroundColor: "#eff6ff", padding: "6px 14px", fontSize: "11px", fontWeight: "500", color: "#1d4ed8", cursor: "pointer" }}
                >
                  💻 Domains
                </button>

                <button
                  type="button"
                  onClick={() => quickReply("certificates")}
                  className="quick-btn"
                  style={{ flexShrink: 0, borderRadius: "999px", border: "1px solid #fde68a", backgroundColor: "#fffbeb", padding: "6px 14px", fontSize: "11px", fontWeight: "500", color: "#b45309", cursor: "pointer" }}
                >
                  📜 Certificates
                </button>

                <button
                  type="button"
                  onClick={() => quickReply("contact")}
                  className="quick-btn"
                  style={{ flexShrink: 0, borderRadius: "999px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", padding: "6px 14px", fontSize: "11px", fontWeight: "500", color: "#334155", cursor: "pointer" }}
                >
                  🎯 Contact
                </button>
              </div>
            </div>

            {/* INPUT PANEL */}
            <div style={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", padding: "6px 6px 6px 14px" }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={voiceState === "LISTENING" ? "Listening to your voice..." : "Type your message..."}
                  value={message}
                  disabled={voiceState === "LISTENING"}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                  style={{ minWidth: 0, flex: 1, backgroundColor: "transparent", border: "none", fontSize: "13px", color: "#1e293b", outline: "none" }}
                />

                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={handleMicClick}
                    title={voiceState === "LISTENING" ? "Stop recording" : "Tap to speak"}
                    style={{ display: "flex", height: "38px", width: "38px", flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: "12px", border: "none", backgroundColor: voiceState === "LISTENING" ? "#fef2f2" : "#eff6ff", color: voiceState === "LISTENING" ? "#ef4444" : "#2563eb", cursor: "pointer" }}
                  >
                    {voiceState === "LISTENING" ? <BsMicMuteFill size={18} /> : <BsMicFill size={18} />}
                  </button>
                )}

                <button
                  type="button"
                  disabled={voiceState === "LISTENING" || !message.trim()}
                  onClick={sendMessage}
                  aria-label="Send message"
                  style={{ display: "flex", height: "38px", width: "38px", flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: "12px", border: "none", color: "#ffffff", background: voiceState === "LISTENING" || !message.trim() ? "#cbd5e1" : "linear-gradient(135deg, #38bdf8, #1d4ed8)", cursor: voiceState === "LISTENING" || !message.trim() ? "not-allowed" : "pointer" }}
                >
                  <IoSend size={16} />
                </button>
              </div>

              <div style={{ marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "9px", color: "#94a3b8" }}>
                <span style={{ fontWeight: "900", color: "#2563eb" }}>W</span>
                <span>Powered by WeIntern AI</span>
              </div>
            </div>

          </div>
        </>
      )}
    </>
  );
}
