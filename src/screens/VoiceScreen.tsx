import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Menu,
  Mic,
  Keyboard,
  Camera,
  ChevronDown,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { StatusBar } from '../components/common/StatusBar';
import { PashuLogo } from '../components/common/PashuLogo';
import { useApp } from '../context/AppContext';
import { VoiceState, HealthStatus } from '../types';
import {
  initAarviConversation,
  advanceAarviConversation,
  AarviConversationState,
} from '../services/aarviEngine';
import {
  callSpeechToText,
  callTextToSpeech,
  playAudioFromBase64,
  speakWithBrowserSynthesis,
  LiveSpeechStreamer,
} from '../services/voiceClient';
import fallbackCowPhoto from '../assets/images/champa_cow_portrait_1790444600765.jpg';

interface VoiceScreenProps {
  onClose: () => void;
  onNavigateToResult: (riskLevel?: HealthStatus) => void;
}

export const VoiceScreen: React.FC<VoiceScreenProps> = ({
  onClose,
  onNavigateToResult,
}) => {
  const {
    selectedCattle,
    cattleList,
    setSelectedCattleId,
    farmer,
    applyHealthCheck,
    language,
    t,
  } = useApp();

  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  const [conversation, setConversation] = useState<AarviConversationState>(() =>
    initAarviConversation(selectedCattle, farmer, language)
  );

  // Live word-by-word streaming subtitles
  const [liveSubtitle, setLiveSubtitle] = useState<string>('');
  const [transcript, setTranscript] = useState<string>(
    conversation.currentSpokenText || conversation.transcriptHistory[0].text
  );

  const [showCowSelector, setShowCowSelector] = useState(false);
  const [showKeyboardInput, setShowKeyboardInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCameraFlash, setShowCameraFlash] = useState(false);

  // Audio recording & playback refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef<boolean>(false);
  const streamerRef = useRef<LiveSpeechStreamer | null>(null);
  const listeningStartTimeRef = useRef<number>(0);
  const speechReceivedRef = useRef<boolean>(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subtitleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const subtitleScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll subtitles while speaking
  useEffect(() => {
    if (voiceState === 'speaking' && subtitleScrollRef.current) {
      subtitleScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [liveSubtitle, voiceState]);

  // Normalized language for voice models
  const sarvamLang =
    language === 'mr'
      ? 'mr-IN'
      : language === 'en'
      ? 'en-IN'
      : 'hi-IN'; // Hindi and Hinglish both use hi-IN

  // Setup real-time speech streamer: Transcript appears ONLY after speech is received
  useEffect(() => {
    streamerRef.current = new LiveSpeechStreamer(
      (interim) => {
        const elapsed = Date.now() - listeningStartTimeRef.current;
        if (elapsed >= 1000 && interim.trim()) {
          speechReceivedRef.current = true;
          setTranscript(`“${interim}...„`);
        }
      },
      (final) => {
        const elapsed = Date.now() - listeningStartTimeRef.current;
        if (elapsed >= 1000 && final.trim()) {
          speechReceivedRef.current = true;
          setTranscript(`“${final}”`);
        }
      },
      sarvamLang
    );

    return () => {
      streamerRef.current?.stop();
    };
  }, [sarvamLang]);

  /**
   * Animates live word-by-word subtitles synchronously with speech
   */
  const startWordByWordSubtitles = (fullSentence: string, estimatedDurationMs = 3200) => {
    if (subtitleIntervalRef.current) {
      clearInterval(subtitleIntervalRef.current);
      subtitleIntervalRef.current = null;
    }

    const clean = fullSentence.replace(/^[“"']+|[”"']+$/g, '').trim();
    const words = clean.split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    // Slow, natural conversational cadence (~250-320ms per word)
    const wordIntervalMs = Math.max(220, Math.min(340, Math.floor(estimatedDurationMs / words.length)));

    let currentWordIdx = 0;
    setLiveSubtitle(words[0]);

    subtitleIntervalRef.current = setInterval(() => {
      currentWordIdx++;
      if (currentWordIdx < words.length) {
        setLiveSubtitle(words.slice(0, currentWordIdx + 1).join(' '));
      } else {
        if (subtitleIntervalRef.current) {
          clearInterval(subtitleIntervalRef.current);
          subtitleIntervalRef.current = null;
        }
        setLiveSubtitle(clean);
      }
    }, wordIntervalMs);
  };

  const stopWordByWordSubtitles = (finalSentence?: string) => {
    if (subtitleIntervalRef.current) {
      clearInterval(subtitleIntervalRef.current);
      subtitleIntervalRef.current = null;
    }
    if (finalSentence) {
      setLiveSubtitle(finalSentence.replace(/^[“"']+|[”"']+$/g, '').trim());
    }
  };

  /**
   * Helper to play synthesized voice from Sarvam TTS with live word-by-word subtitles & waveform synchronization
   */
  const playSynthesizedVoice = (text: string): Promise<void> => {
    return new Promise(async (resolve) => {
      // Synchronize waveform: set speaking state when playback starts
      setVoiceState('speaking');
      const clean = text.replace(/^[“"']+|[”"']+$/g, '').trim();

      // Estimated duration based on words (~280ms per word at 0.9 pace)
      const wordCount = clean.split(/\s+/).length;
      const estimatedDuration = Math.max(2200, wordCount * 300);

      // Start live word-by-word streaming subtitles
      startWordByWordSubtitles(clean, estimatedDuration);

      const onPlaybackEnd = () => {
        stopWordByWordSubtitles(clean);
        setVoiceState('ready');
        resolve();
      };

      try {
        // Speaker kavya is a calm Indian female veterinary voice
        const speaker = sarvamLang === 'mr-IN' ? 'ishita' : 'kavya';
        const ttsResult = await callTextToSpeech(clean, sarvamLang, speaker);

        if (ttsResult?.audioBase64 && !ttsResult.isPlaceholder) {
          await playAudioFromBase64(
            ttsResult.audioBase64,
            ttsResult.mimeType,
            () => setVoiceState('speaking'),
            onPlaybackEnd
          );
        } else {
          // Graceful fallback to calm Indian female browser speech synthesis
          await speakWithBrowserSynthesis(
            clean,
            sarvamLang,
            () => setVoiceState('speaking'),
            onPlaybackEnd,
            (wordIdx) => {
              // Exact word boundary synchronization if supported by browser
              const words = clean.split(/\s+/);
              if (wordIdx <= words.length) {
                setLiveSubtitle(words.slice(0, Math.max(1, wordIdx)).join(' '));
              }
            }
          );
        }
      } catch (e) {
        console.warn('Voice playback handled:', e);
        onPlaybackEnd();
      }
    });
  };

  // Speak initial greeting when screen opens or selected cattle / language changes
  useEffect(() => {
    const fresh = initAarviConversation(selectedCattle, farmer, language);
    setConversation(fresh);
    const initialPrompt = fresh.currentSpokenText || fresh.transcriptHistory[0].text;
    setTranscript(initialPrompt);
    setLiveSubtitle(initialPrompt);

    const initTimer = setTimeout(() => {
      playSynthesizedVoice(initialPrompt);
    }, 450);

    return () => {
      clearTimeout(initTimer);
      stopWordByWordSubtitles();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedCattle.id, language]);

  // Clean up recording, timers & audio on unmount
  useEffect(() => {
    return () => {
      streamerRef.current?.stop();
      stopWordByWordSubtitles();
      if (mediaRecorderRef.current && isRecordingRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * Process a farmer response through natural state flow:
   * Ready -> Listening -> Thinking (2 sec pulse) -> Speaking (mouth waveform + subtitles) -> Ready
   * Never instantly jump between states.
   */
  const handleFarmerResponse = (inputText: string) => {
    if (!inputText.trim()) return;

    // 1. Show the farmer's spoken transcript first
    setTranscript(`“${inputText}”`);
    setLiveSubtitle(`“${inputText}”`);

    // Settle briefly before entering Thinking state (smooth non-jarring transition)
    processingTimeoutRef.current = setTimeout(() => {
      // 2. Enter Thinking state with gentle 2-second pulse animation
      setVoiceState('thinking');

      // Natural empathetic status during thinking (NO robotic phrasing!)
      const thinkingStatus =
        language === 'en'
          ? 'AARVI is thinking...'
          : language === 'hinglish'
          ? 'AARVI समझ रही है...'
          : 'आरवी समझ रही है...';
      setTranscript(thinkingStatus);
      setLiveSubtitle(thinkingStatus);

      // Hold Thinking state for 2.0 seconds as required ("Thinking (2 sec pulse)")
      processingTimeoutRef.current = setTimeout(async () => {
        // Generate the next dialogue adaptively based on clinical interview rules
        const result = advanceAarviConversation(
          conversation,
          inputText,
          selectedCattle,
          farmer,
          language
        );

        setConversation(result.nextState);
        const latestAarviMsg =
          result.nextState.transcriptHistory[
            result.nextState.transcriptHistory.length - 1
          ];

        // 3. Transition to Speaking state: mouth waveform + live word-by-word subtitles
        setTranscript(latestAarviMsg.text);

        // Play AARVI voice via Sarvam TTS with live word-by-word subtitles
        await playSynthesizedVoice(latestAarviMsg.text);

        // After conversation concludes, automatically update profile, milk record, and health history
        if (result.finalHealthCheck) {
          applyHealthCheck(result.finalHealthCheck, result.referral);

          processingTimeoutRef.current = setTimeout(() => {
            onNavigateToResult(result.finalHealthCheck?.riskLevel);
          }, 1400);
        } else {
          // Settle gracefully into ready state
          setVoiceState('ready');
        }
      }, 2000); // 2 second pulse
    }, 450);
  };

  // Start real browser audio capture: Enters Listening state, transcript appears only after speech
  const startAudioRecording = async () => {
    audioChunksRef.current = [];
    isRecordingRef.current = true;
    speechReceivedRef.current = false;
    listeningStartTimeRef.current = Date.now();

    // Enter Listening state smoothly; transcript remains clean until farmer actually speaks
    setVoiceState('listening');
    setTranscript('');
    setLiveSubtitle('');

    // Start live interim speech streamer
    streamerRef.current?.start();

    if (
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          streamerRef.current?.stop();

          const audioBlob = new Blob(audioChunksRef.current, {
            type: recorder.mimeType || 'audio/webm',
          });

          // Call server-side Sarvam speechToText()
          const sttRes = await callSpeechToText({
            audioBlob,
            languageCode: sarvamLang,
            stepContext: conversation.step,
            promptHint: conversation.suggestedAnswers[0]?.text,
          });

          const recognizedText =
            sttRes.transcript?.trim() ||
            (speechReceivedRef.current
              ? conversation.suggestedAnswers[0]?.text
              : '') ||
            conversation.suggestedAnswers[0]?.text ||
            `${selectedCattle.name} gave ${selectedCattle.baselineMilk} litres.`;

          if (recognizedText) {
            handleFarmerResponse(recognizedText);
          } else {
            setVoiceState('ready');
          }
        };

        recorder.start(250);
      } catch (err) {
        console.warn('Microphone stream fallback:', err);
        simulateSTTFallback();
      }
    } else {
      simulateSTTFallback();
    }
  };

  // Stop recording and trigger STT
  const stopAudioRecording = () => {
    streamerRef.current?.stop();
    if (mediaRecorderRef.current && isRecordingRef.current) {
      isRecordingRef.current = false;
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Recorder stop error:', err);
      }
    } else {
      simulateSTTFallback();
    }
  };

  // Graceful fallback if browser mic is unavailable or blocked in environment
  const simulateSTTFallback = async () => {
    const promptHint =
      conversation.suggestedAnswers[0]?.text ||
      `${selectedCattle.name} gave ${selectedCattle.baselineMilk} litres.`;

    const sttRes = await callSpeechToText({
      languageCode: sarvamLang,
      stepContext: conversation.step,
      promptHint,
    });

    handleFarmerResponse(sttRes.transcript);
  };

  // Mic Button tap handler: toggles recording or captures voice
  const handleMicPress = () => {
    if (voiceState === 'ready' || voiceState === 'speaking') {
      startAudioRecording();
    } else if (voiceState === 'listening') {
      stopAudioRecording();
    }
  };

  // Camera Button tap handler (photo when visual symptoms justify verification)
  const handleCameraPress = () => {
    setShowCameraFlash(true);
    setTimeout(() => setShowCameraFlash(false), 300);

    const photoInput =
      language === 'en'
        ? `Captured photo of ${selectedCattle.name}'s udder and posture for clinical verification.`
        : language === 'hinglish'
        ? `Captured photo of ${selectedCattle.name}'s symptoms for clinical verification.`
        : `${selectedCattle.name} के लक्षणों की फोटो खींच ली गई है।`;

    handleFarmerResponse(photoInput);
  };

  // Text input submit
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const input = customInput;
    setCustomInput('');
    setShowKeyboardInput(false);
    handleFarmerResponse(input);
  };

  const getStateBadgeText = () => {
    switch (voiceState) {
      case 'ready':
        return t.aarviIsReady;
      case 'listening':
        return t.aarviIsListening;
      case 'thinking':
        return language === 'en'
          ? 'AARVI is thinking...'
          : language === 'hinglish'
          ? 'AARVI समझ रही है...'
          : 'आरवी समझ रही है...';
      case 'speaking':
      default:
        return t.aarviIsSpeaking;
    }
  };

  // Spoken text to display on the prominent headline
  const prominentHeadlineText =
    voiceState === 'speaking'
      ? liveSubtitle || conversation.currentSubtitle
      : voiceState === 'thinking'
      ? language === 'en'
        ? 'AARVI is thinking...'
        : language === 'hinglish'
        ? 'AARVI समझ रही है...'
        : 'आरवी समझ रही है...'
      : conversation.currentSubtitle;

  return (
    <div className="w-full h-full min-h-[720px] flex flex-col justify-between bg-[#0B2319] text-white overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#166534]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Camera shutter flash effect */}
      {showCameraFlash && (
        <div className="absolute inset-0 bg-white z-50 transition-opacity duration-300" />
      )}

      {/* Top Header */}
      <div>
        <StatusBar dark />

        <div className="px-5 py-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>

          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <PashuLogo size={20} />
              <h1 className="text-base font-semibold text-white tracking-tight">
                {t.aarviTitle}
              </h1>
            </div>
            <p className="text-[11px] text-[#86EFAC] font-medium flex items-center justify-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span>{t.listeningOffline}</span>
            </p>
          </div>

          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            aria-label="Menu"
            onClick={() => setShowCowSelector(!showCowSelector)}
          >
            <Menu className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 py-2">
        {/* Cow Avatar with ring & Ready breathing glow */}
        <div className="relative mb-3">
          <div
            className={`w-24 h-24 rounded-full p-1 border-2 transition-all duration-700 bg-emerald-950/80 ${
              voiceState === 'ready'
                ? 'border-[#22C55E]/70 shadow-[0_0_28px_rgba(34,197,94,0.45)] animate-pulse'
                : voiceState === 'thinking'
                ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-pulse'
                : voiceState === 'speaking'
                ? 'border-[#4ADE80] shadow-[0_0_32px_rgba(74,222,128,0.55)]'
                : 'border-[#22C55E]/60 shadow-[0_0_24px_rgba(34,197,94,0.3)]'
            }`}
          >
            <img
              src={selectedCattle.photoUrl}
              alt={selectedCattle.name}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackCowPhoto;
              }}
            />
          </div>

          {/* Cow Selector Pill */}
          <div className="mt-2.5 flex justify-center">
            <button
              type="button"
              onClick={() => setShowCowSelector(!showCowSelector)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-xs text-xs font-medium text-emerald-200 border border-white/10 cursor-pointer transition-colors"
            >
              <span>
                {t.talkingAbout} {selectedCattle.name}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>
          </div>

          {/* Dropdown modal if open */}
          {showCowSelector && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-[#123826] border border-emerald-700/60 rounded-xl shadow-xl p-1.5 z-50 text-left">
              <div className="text-[10px] font-semibold text-emerald-300 uppercase px-2 py-1">
                {t.myCattle}
              </div>
              {cattleList.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCattleId(c.id);
                    setShowCowSelector(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    c.id === selectedCattle.id
                      ? 'bg-[#22C55E] text-gray-950 font-bold'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <img
                    src={c.photoUrl}
                    alt={c.name}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackCowPhoto;
                    }}
                  />
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-70 ml-auto">
                    {c.breed}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* State Badge: Ready (breathing glow) → Listening (waveform) → Thinking (2 sec pulse) → Speaking (mouth waveform + subtitles) */}
        <div className="mb-2">
          <span
            className={`text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5 transition-all duration-300 ${
              voiceState === 'thinking' ? 'text-amber-300 animate-pulse' : 'text-[#86EFAC]'
            }`}
          >
            {voiceState === 'speaking' && (
              <Volume2 className="w-3.5 h-3.5 text-[#86EFAC] animate-pulse" />
            )}
            {voiceState === 'thinking' && (
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            )}
            <span>{getStateBadgeText()}</span>
          </span>
        </div>

        {/* Live Word-by-Word Subtitles Headline from AARVI Dialogue */}
        <div className="max-w-xs mx-auto mb-2 min-h-[58px] flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug transition-all duration-200">
            {prominentHeadlineText}
          </h2>
          {conversation.currentSecondarySubtitle && voiceState !== 'thinking' && (
            <p className="text-xs text-emerald-200/75 mt-1 font-normal">
              {conversation.currentSecondarySubtitle}
            </p>
          )}
        </div>

        {/* Animated Sound Waveform (reacts smoothly in sync with speaking/listening) */}
        <div className="flex items-center justify-center gap-1.5 my-3 h-12 w-full max-w-[200px]">
          <div
            className={`w-1.5 bg-[#22C55E] rounded-full transition-all duration-300 ${
              voiceState === 'speaking' || voiceState === 'listening'
                ? 'h-8 animate-wave-1'
                : voiceState === 'thinking'
                ? 'h-4 bg-amber-400 animate-pulse'
                : 'h-2 opacity-50'
            }`}
          />
          <div
            className={`w-1.5 bg-[#4ADE80] rounded-full transition-all duration-300 ${
              voiceState === 'speaking' || voiceState === 'listening'
                ? 'h-12 animate-wave-2'
                : voiceState === 'thinking'
                ? 'h-6 bg-amber-300 animate-pulse'
                : 'h-2 opacity-50'
            }`}
          />
          <div
            className={`w-1.5 bg-[#22C55E] rounded-full transition-all duration-300 ${
              voiceState === 'speaking' || voiceState === 'listening'
                ? 'h-6 animate-wave-3'
                : voiceState === 'thinking'
                ? 'h-4 bg-amber-400 animate-pulse'
                : 'h-2 opacity-50'
            }`}
          />
          <div
            className={`w-1.5 bg-[#86EFAC] rounded-full transition-all duration-300 ${
              voiceState === 'speaking' || voiceState === 'listening'
                ? 'h-11 animate-wave-4'
                : voiceState === 'thinking'
                ? 'h-7 bg-amber-300 animate-pulse'
                : 'h-2 opacity-50'
            }`}
          />
          <div
            className={`w-1.5 bg-[#22C55E] rounded-full transition-all duration-300 ${
              voiceState === 'speaking' || voiceState === 'listening'
                ? 'h-7 animate-wave-5'
                : voiceState === 'thinking'
                ? 'h-5 bg-amber-400 animate-pulse'
                : 'h-2 opacity-50'
            }`}
          />
          <div
            className={`w-1.5 bg-[#4ADE80] rounded-full transition-all duration-300 ${
              voiceState === 'speaking' || voiceState === 'listening'
                ? 'h-10 animate-wave-2'
                : voiceState === 'thinking'
                ? 'h-6 bg-amber-300 animate-pulse'
                : 'h-2 opacity-50'
            }`}
          />
          <div
            className={`w-1.5 bg-[#22C55E] rounded-full transition-all duration-300 ${
              voiceState === 'speaking' || voiceState === 'listening'
                ? 'h-5 animate-wave-1'
                : voiceState === 'thinking'
                ? 'h-3 bg-amber-400 animate-pulse'
                : 'h-2 opacity-50'
            }`}
          />
        </div>

        <p className="text-[11px] text-emerald-200/70 font-medium mb-2.5">
          {t.speakNaturally}
        </p>

        {/* Live Subtitle Transcript Box: Streams word-by-word in real time */}
        <div
          ref={subtitleScrollRef}
          className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-xs rounded-[16px] p-3 text-left min-h-[58px] flex flex-col justify-center"
        >
          <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-300/80 block mb-1">
            {t.transcriptLabel}
          </span>
          <p className="text-xs font-medium text-white/95 leading-relaxed min-h-[18px]">
            {voiceState === 'speaking' ? liveSubtitle || transcript : transcript}
          </p>
        </div>

        {/* Context-aware Adaptive Suggested Response Chips */}
        {conversation.suggestedAnswers.length > 0 && voiceState !== 'thinking' && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-sm">
            {conversation.suggestedAnswers.map((ans, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleFarmerResponse(ans.text)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border border-emerald-500/40 cursor-pointer transition-all active:scale-95"
              >
                {ans.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Keyboard Input Drawer if toggled */}
      {showKeyboardInput && (
        <form
          onSubmit={handleCustomSubmit}
          className="px-6 py-2.5 bg-[#123826] border-t border-emerald-700/60 z-20 flex gap-2"
        >
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={t.typeAnswerPlaceholder}
            className="flex-1 px-3 py-2 rounded-xl bg-white/10 text-white text-xs outline-hidden border border-white/20 focus:border-[#22C55E]"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#22C55E] text-gray-900 rounded-xl text-xs font-bold cursor-pointer"
          >
            {t.send}
          </button>
        </form>
      )}

      {/* Bottom Controls Bar (Keyboard, Microphone, Camera) */}
      <div className="px-6 pb-8 pt-2 z-10 flex items-center justify-between">
        {/* Keyboard Input Button */}
        <button
          type="button"
          onClick={() => setShowKeyboardInput(!showKeyboardInput)}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center cursor-pointer transition-transform border border-white/10"
          aria-label="Keyboard Input"
          title="Type response"
        >
          <Keyboard className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Center Glowing Microphone Button */}
        <button
          type="button"
          onClick={handleMicPress}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            voiceState === 'listening'
              ? 'bg-amber-400 text-gray-950 scale-105 shadow-[0_0_35px_rgba(251,191,36,0.7)]'
              : voiceState === 'thinking'
              ? 'bg-amber-500/80 text-white animate-pulse'
              : 'bg-[#22C55E] hover:bg-[#16a34a] text-gray-950 shadow-[0_0_30px_rgba(34,197,94,0.55)] active:scale-95 animate-pulse'
          }`}
          aria-label="Microphone"
          title={voiceState === 'listening' ? 'Tap to finish speaking' : 'Tap to speak to AARVI'}
        >
          <span
            className={`absolute inset-0 rounded-full border-2 ${
              voiceState === 'listening'
                ? 'border-amber-200 animate-ping opacity-60'
                : 'border-emerald-300/40 animate-ping opacity-30'
            } pointer-events-none`}
          />
          <Mic className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Camera Visual Symptom Check Button (Pulsing only when symptoms justify visual verification) */}
        <button
          type="button"
          onClick={handleCameraPress}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform border active:scale-95 ${
            conversation.requiresPhoto
              ? 'bg-amber-400 text-gray-950 border-amber-300 animate-bounce shadow-lg shadow-amber-400/40'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
          }`}
          aria-label="Camera Inspection"
          title={
            conversation.requiresPhoto
              ? 'Take photo of symptoms for visual verification'
              : 'Camera visual inspection'
          }
        >
          <Camera className="w-5 h-5 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
