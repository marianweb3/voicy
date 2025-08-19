import { useState, useRef, useEffect } from "react";
import { IoMdPlay, IoMdPause } from "react-icons/io";

interface CallRecordingProps {
  audioUrl?: string;
}

export const CallRecording = ({ audioUrl }: CallRecordingProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
    };
  }, [isDragging]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  // Default to a sample audio file if no URL provided
  const defaultAudioUrl =
    "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav";

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl || defaultAudioUrl}
        preload="metadata"
        onError={() => {
          console.error("Error loading audio file");
          setIsLoading(false);
        }}
      />

      <div className="w-full bg-[#F7F7F7] border border-[#EAEAEA] rounded-2xl p-4 flex items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            disabled={isLoading || duration === 0}
            className="size-12 rounded-full bg-[#739C9C] flex items-center justify-center hover:bg-[#5F8888] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <IoMdPause color="white" size={20} />
            ) : (
              <IoMdPlay color="white" size={20} style={{ marginLeft: "2px" }} />
            )}
          </button>
          <div className="flex flex-col gap-1">
            <span className="text-[#00101F] font-semibold text-[16px] leading-[100%]">
              Запис дзвінка
            </span>
            <span className="text-[#9A9A9A] text-[14px] font-semibold leading-[100%]">
              {isLoading
                ? "Завантаження..."
                : `${formatTime(Math.floor(currentTime))} / ${formatTime(
                    Math.floor(duration)
                  )}`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center gap-3">
          <div
            ref={progressRef}
            className="flex-1 h-2 bg-[#E5E5E5] rounded-full cursor-pointer relative group"
            onClick={handleProgressClick}
            onMouseDown={handleMouseDown}
          >
            {/* Progress fill */}
            <div
              className="h-full bg-[#739C9C] rounded-full relative"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Progress handle */}
              <div
                className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#739C9C] rounded-full border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  opacity: isDragging ? 1 : undefined,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
