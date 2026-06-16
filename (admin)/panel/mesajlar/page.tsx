"use client";

import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { MessageSquare, Send, Sparkles, User, Search, Clock, Mic, Square, Image as ImageIcon, ArrowLeft } from "lucide-react";

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
    <div className={`flex items-center gap-2 p-1.5 rounded-sm max-w-full w-44 ${
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

interface Musteri {
  id: string;
  ad: string;
  email: string;
  telefon: string;
}

interface Message {
  id: string;
  uye_id: string;
  gonderici: "uye" | "admin";
  mesaj: string;
  tarih: string;
  okundu: boolean;
}

interface SohbetOdasi {
  uye: Musteri;
  sonMesaj?: Message;
  okunmamisSayisi: number;
}

export default function AdminMessagesPage() {
  const [rooms, setRooms] = useState<SohbetOdasi[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<SohbetOdasi | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    if (!selectedRoom || isSending) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/sohbet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mesaj: content,
          uye_id: selectedRoom.uye.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        fetchRooms(false);
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

  const renderMessageContent = (mesajText: string, isAdminMsg: boolean) => {
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
      return <CustomAudioPlayer src={src} isAdminMsg={isAdminMsg} />; // Inside admin panel, isAdminMsg is m.gonderici === "admin". If it is admin message, it is violet (white text/bg-mauve)
    }
    return mesajText;
  };

  const formatRecordingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const fetchMessages = async (uyeId: string, initial = false) => {
    if (initial) setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/sohbet?uye_id=${uyeId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      if (initial) setIsLoadingMessages(false);
    }
  };

  const fetchRooms = async (initial = false) => {
    if (initial) setIsLoadingRooms(true);
    try {
      const res = await fetch("/api/sohbet?view=admin");
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms || []);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      if (initial) setIsLoadingRooms(false);
    }
  };

  // Rooms Polling (every 6 seconds)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRooms(true);

    const roomInterval = setInterval(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRooms(false);
    }, 6000);

    return () => {
      clearInterval(roomInterval);
    };
  }, []);

  // Messages Polling (every 3 seconds when a room is selected)
  useEffect(() => {
    if (!selectedRoom) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages(selectedRoom.uye.id, true);

    const messageInterval = setInterval(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMessages(selectedRoom.uye.id, false);
    }, 3000);

    return () => {
      clearInterval(messageInterval);
    };
  }, [selectedRoom]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !newMessage.trim() || isSending) return;

    setIsSending(true);
    const textToSend = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch("/api/sohbet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mesaj: textToSend,
          uye_id: selectedRoom.uye.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        
        // Refresh rooms to show updated last message
        fetchRooms(false);
      } else {
        setNewMessage(textToSend);
        showToast("Mesaj gönderilemedi.", "error");
      }
    } catch (err) {
      showToast("Bağlantı hatası.", "error");
    } finally {
      setIsSending(false);
    }
  };

  const filteredRooms = rooms.filter((r) =>
    r.uye.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.uye.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-[calc(100vh-180px)] md:h-[calc(100vh-120px)] animate-fade-in text-charcoal">
      <div className={selectedRoom ? "hidden md:block" : "block"}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-obsidian tracking-wide uppercase">
          Mesajlaşma Merkezi
        </h2>
        <p className="text-xs text-charcoal/70 mt-1 font-body">
          Üyelerden gelen canlı destek taleplerini gerçek zamanlı yanıtlayın.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 border border-champagne/80 bg-white shadow-md rounded-sm overflow-hidden min-h-[300px] md:min-h-[400px]">
        {/* Left: Chat Rooms List (col-span-4) */}
        <div className={`md:col-span-4 border-r border-champagne/40 flex flex-col justify-between bg-ivory/30 ${
          selectedRoom ? "hidden md:flex" : "flex"
        }`}>
          <div className="p-4 border-b border-champagne/20 flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Üye veya E-posta ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-champagne rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-mauve focus:border-mauve"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-charcoal/40" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
            {isLoadingRooms ? (
              <div className="py-12 flex justify-center"><Spinner size="sm" /></div>
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room) => {
                const isSelected = selectedRoom?.uye.id === room.uye.id;
                return (
                  <button
                    key={room.uye.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full p-3 rounded-sm flex items-center justify-between text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-mauve text-white shadow-md"
                        : "bg-white border border-champagne/20 text-charcoal hover:bg-champagne/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-mauve/10 text-mauve"
                      }`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div className="truncate flex flex-col">
                        <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-obsidian"}`}>
                          {room.uye.ad}
                        </span>
                        <span className={`text-[10px] truncate ${isSelected ? "text-white/70" : "text-charcoal/60"}`}>
                          {room.sonMesaj ? room.sonMesaj.mesaj : "Mesaj yok"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                      {room.sonMesaj && (
                        <span className={`text-[9px] ${isSelected ? "text-white/60" : "text-charcoal/40"}`}>
                          {new Date(room.sonMesaj.tarih).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                      {room.okunmamisSayisi > 0 && (
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? "bg-white text-mauve" : "bg-rose-600 text-white animate-pulse"
                        }`}>
                          {room.okunmamisSayisi}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-charcoal/50 font-medium">
                Aktif sohbet bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Chat View (col-span-8) */}
        <div className={`md:col-span-8 flex flex-col justify-between h-full bg-white ${
          selectedRoom ? "flex" : "hidden md:flex"
        }`}>
          {selectedRoom ? (
            <>
              {/* Active Header */}
              <div className="p-4 border-b border-champagne/30 flex items-center justify-between bg-ivory/20">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedRoom(null)}
                    className="md:hidden p-1 mr-1 text-charcoal hover:text-mauve transition-colors cursor-pointer"
                    title="Listeye Dön"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-mauve/10 rounded-full flex items-center justify-center text-mauve">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <h3 className="font-display font-bold text-sm text-obsidian truncate">
                      {selectedRoom.uye.ad}
                    </h3>
                    <div className="text-[10px] text-charcoal/60 flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                      <span className="truncate">Tlf: {selectedRoom.uye.telefon}</span>
                      <span className="hidden sm:inline text-charcoal/30">|</span>
                      <span className="truncate">E-posta: {selectedRoom.uye.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto bg-ivory/10 flex flex-col gap-3 min-h-0">
                {isLoadingMessages ? (
                  <div className="flex-1 flex items-center justify-center"><Spinner size="sm" /></div>
                ) : messages.length > 0 ? (
                  messages.map((m) => {
                    const isAdminMsg = m.gonderici === "admin";
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-2 max-w-[85%] sm:max-w-[80%] ${
                          isAdminMsg ? "self-end flex-row-reverse" : "self-start flex-row"
                        } items-end min-w-0`}
                      >
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-champagne/20 flex items-center justify-center border border-champagne/30 shadow-sm">
                          <img
                            src={
                              isAdminMsg
                                ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80" // Admin
                                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" // Member
                            }
                            alt={isAdminMsg ? "Yönetici" : "Müşteri"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Bubble and Timestamp */}
                        <div className={`flex flex-col min-w-0 ${isAdminMsg ? "items-end" : "items-start"}`}>
                          <div
                            className={`p-2.5 text-xs leading-relaxed rounded-sm shadow-sm break-words overflow-hidden ${
                              isAdminMsg
                                ? "bg-mauve text-white rounded-br-none"
                                : "bg-white text-charcoal border border-champagne/40 rounded-bl-none"
                            }`}
                          >
                            {renderMessageContent(m.mesaj, isAdminMsg)}
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
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-charcoal/50 text-xs">
                    Henüz mesaj bulunmuyor.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Form */}
              <div className="border-t border-champagne/30 bg-white p-3 flex flex-col gap-2">
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
                      placeholder="Yanıtınızı yazın..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-3 py-2 border border-champagne focus:outline-none focus:ring-1 focus:ring-mauve focus:border-mauve text-xs rounded-sm placeholder-charcoal/40 text-charcoal"
                      disabled={isSending}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!newMessage.trim() || isSending}
                      className="px-2.5 sm:px-4 py-2 shrink-0 flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5 sm:mr-1" /> <span className="hidden sm:inline">Gönder</span>
                    </Button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-charcoal/40">
              <MessageSquare className="w-12 h-12 text-champagne mb-4 animate-pulse" />
              <h4 className="font-display font-bold text-lg text-obsidian uppercase">Görüşme Seçilmedi</h4>
              <p className="text-xs text-charcoal/60 mt-1 max-w-sm">
                Sohbet geçmişini görüntülemek ve yanıtlamak için sol listeden bir üye seçin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
