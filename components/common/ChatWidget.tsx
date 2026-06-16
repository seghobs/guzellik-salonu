"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, AlertCircle, LogIn, Mic, Square, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { useToast } from "../ui/Toast";

interface Message {
  id: string;
  uye_id: string;
  gonderici: "uye" | "admin";
  mesaj: string;
  tarih: string;
  okundu: boolean;
}

const CustomAudioPlayer: React.FC<{ src: string; isAdminMsg: boolean }> = ({ src, isAdminMsg }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={`flex items-center gap-2 p-1.5 rounded-sm w-44 ${
      isAdminMsg ? "bg-white/10 text-white" : "bg-champagne/10 text-charcoal"
    }`}>
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      <button
        type="button"
        onClick={togglePlay}
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
          isAdminMsg ? "bg-white text-mauve hover:bg-champagne" : "bg-mauve text-white hover:bg-obsidian"
        }`}
      >
        {isPlaying ? (
          <span className="text-[10px]">❚❚</span>
        ) : (
          <span className="text-[10px] ml-0.5">▶</span>
        )}
      </button>
      <div className="flex flex-col flex-1 gap-0.5">
        <div className={`h-1 rounded-full w-full relative overflow-hidden ${
          isAdminMsg ? "bg-white/20" : "bg-charcoal/10"
        }`}>
          <div
            className={`h-full rounded-full ${isAdminMsg ? "bg-white" : "bg-mauve"}`}
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[8px] opacity-75 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await sendSpecialMessage(`[ses]${base64Audio}`);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access failed:", err);
      showToast("Mikrofon erişimi reddedildi.", "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;
      }
    }
  };

  const sendSpecialMessage = async (content: string) => {
    setIsSending(true);
    try {
      const res = await fetch("/api/sohbet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mesaj: content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      } else {
        showToast("Mesaj gönderilemedi.", "error");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      showToast("Bağlantı hatası.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      showToast("Görsel boyutu 2MB'tan küçük olmalıdır.", "error");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      await sendSpecialMessage(`[gorsel]${base64Image}`);
    };
  };

  const triggerImageSelect = () => {
    fileInputRef.current?.click();
  };

  const renderMessageContent = (mesajText: string, isUyeMsg: boolean) => {
    if (mesajText.startsWith("[gorsel]")) {
      const src = mesajText.replace("[gorsel]", "");
      return (
        <div className="rounded-sm overflow-hidden border border-champagne/20 max-w-[200px] cursor-pointer hover:opacity-90 transition-opacity">
          <img src={src} alt="Gönderilen Görsel" className="w-full h-auto object-cover max-h-[160px]" onClick={() => window.open(src, "_blank")} />
        </div>
      );
    }
    if (mesajText.startsWith("[ses]")) {
      const src = mesajText.replace("[ses]", "");
      return <CustomAudioPlayer src={src} isAdminMsg={isUyeMsg} />; // Inside ChatWidget, isUyeMsg means it is sent by member, so it should render with light colors (white text/bg-mauve)
    }
    return mesajText;
  };

  const formatRecordingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const fetchChatHistory = async (initial = false) => {
    try {
      const res = await fetch("/api/sohbet");
      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setIsAuthed(true);
          setMessages(data.messages);
          
          // Calculate unread count from admin
          if (!isOpen) {
            const unread = data.messages.filter(
              (m: Message) => m.gonderici === "admin" && !m.okundu
            ).length;
            setUnreadCount(unread);
          } else {
            setUnreadCount(0);
          }
        } else {
          setIsAuthed(false);
          setUnreadCount(0);
        }
      } else {
        setIsAuthed(false);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Chat polling error:", err);
    }
  };

  const startPolling = () => {
    stopPolling();
    pollingIntervalRef.current = setInterval(() => {
      fetchChatHistory(false);
    }, 3000); // Poll every 3 seconds when open
  };

  useEffect(() => {
    // Check session authentication by making a fast request to chat history
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChatHistory(true);

    // Poll for messages if chat window is open
    if (isOpen) {
      startPolling();
    } else {
      stopPolling();
      // Fast check for unread messages only (could run less frequently)
      pollingIntervalRef.current = setInterval(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchChatHistory(false);
      }, 5000);
    }

    return () => stopPolling();
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const textToSend = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch("/api/sohbet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mesaj: textToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      } else {
        // Restore input if send failed
        setNewMessage(textToSend);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const triggerAuthModal = () => {
    // Dispatch custom event that Navbar listens to
    window.dispatchEvent(new CustomEvent("open-member-auth"));
  };

  return (
    <div className="fixed bottom-6 right-6 z-45 font-body flex flex-col items-end gap-3">
      {/* Slide-out Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-18 right-0 w-[calc(100vw-32px)] sm:w-96 h-[480px] bg-white border border-champagne/80 shadow-2xl rounded-sm overflow-hidden flex flex-col justify-between hover-gold-glow"
          >
            {/* Header */}
            <div className="bg-obsidian text-champagne p-4 flex items-center justify-between border-b border-mauve/20">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-mauve/30 rounded-full text-rose-dust">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    Luxe Canlı Destek
                  </h4>
                  <span className="text-[10px] text-champagne/50">Çevrimiçi Güzellik Danışmanınız</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-champagne/60 hover:text-champagne p-1 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 p-4 overflow-y-auto bg-ivory flex flex-col gap-3 min-h-[300px]">
              {isAuthed ? (
                messages.length > 0 ? (
                  messages.map((m) => {
                    const isUye = m.gonderici === "uye";
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-2 max-w-[85%] ${
                          isUye ? "self-end flex-row-reverse" : "self-start flex-row"
                        } items-end`}
                      >
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-champagne/20 flex items-center justify-center border border-champagne/30 shadow-sm">
                          <img
                            src={
                              isUye
                                ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" // Client
                                : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80" // Support
                            }
                            alt={isUye ? "Müşteri" : "Uzman"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Bubble and Timestamp */}
                        <div className={`flex flex-col ${isUye ? "items-end" : "items-start"}`}>
                          <div
                            className={`p-2.5 text-xs leading-relaxed rounded-sm shadow-sm ${
                              isUye
                                ? "bg-mauve text-white rounded-br-none"
                                : "bg-white text-charcoal border border-champagne/40 rounded-bl-none"
                            }`}
                          >
                            {renderMessageContent(m.mesaj, isUye)}
                          </div>
                          <span className="text-[8px] text-charcoal/40 mt-1 font-light">
                            {new Date(m.tarih).toLocaleTimeString("tr-TR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-charcoal/50 text-xs">
                    <MessageSquare className="w-10 h-10 text-champagne mb-2" />
                    <span>Luxe Beauty Canlı Desteğe Hoş Geldiniz. Bir mesaj yazarak sohbete başlayabilirsiniz!</span>
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4">
                  <div className="p-3 bg-amber-50 rounded-full text-amber-500 border border-amber-100">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h5 className="font-display font-bold text-base text-obsidian">Üye Girişi Gerekli</h5>
                    <p className="text-xs text-charcoal/70 leading-relaxed">
                      Uzmanlarımızla canlı sohbet başlatabilmek ve geçmiş konuşmalarınızı görebilmek için üye girişi yapmanız gerekmektedir.
                    </p>
                  </div>
                  <Button
                    onClick={triggerAuthModal}
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Giriş Yap / Üye Ol
                  </Button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input field */}
            {isAuthed && (
              <div className="border-t border-champagne/40 bg-white p-3 flex flex-col gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                {isRecording ? (
                  <div className="flex items-center justify-between bg-rose-50/50 border border-rose-100 rounded-sm px-3 py-2 animate-pulse">
                    <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
                      <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping" />
                      <span>Ses Kaydediliyor: {formatRecordingTime(recordingDuration)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="p-1 text-rose-600 hover:text-rose-800 transition-all cursor-pointer"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={triggerImageSelect}
                      className="p-1.5 text-charcoal/40 hover:text-mauve transition-all cursor-pointer shrink-0"
                      title="Resim Ekle"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={startRecording}
                      className="p-1.5 text-charcoal/40 hover:text-mauve transition-all cursor-pointer shrink-0"
                      title="Ses Kaydet"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      placeholder="Bir mesaj yazın..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 text-xs border-0 focus:outline-none focus:ring-0 text-charcoal placeholder-charcoal/40"
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className="p-1.5 text-mauve hover:text-obsidian disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {/* Helper Avatar Bubble */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 bg-white border border-champagne/80 shadow-lg pl-3 pr-4 py-2 rounded-full hidden sm:flex"
            >
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                  alt="Luxe Danışmanı"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-mauve/20"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-obsidian uppercase tracking-wider leading-none">
                  Luxe Danışmanı
                </span>
                <span className="text-[9px] text-charcoal/60 mt-1.5 leading-none font-medium">
                  Çevrimiçi · Yardım edelim!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chat Bubble Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-mauve text-white flex items-center justify-center shadow-xl hover:bg-obsidian transition-colors duration-300 relative cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-ivory animate-bounce">
              {unreadCount}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
};
export default ChatWidget;
