//@ts-nocheck
import { useTranscript } from "../../../hooks/useCalls";

interface TranscriptMessage {
  id: string;
  speaker: "manager" | "client";
  content: string;
}

interface CallTranscriptProps {
  callId: number;
}

const CallTranscript = ({ callId }: CallTranscriptProps) => {
  const { transcriptData, isLoadingTranscript, transcriptError } =
    useTranscript(callId);

  // Fallback data for development/testing
  if (!callId) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-[#9A9A9A] text-[14px]">
          Неможливо завантажити транскрипт
        </div>
      </div>
    );
  }

  if (isLoadingTranscript) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#739C9C] mx-auto"></div>
          <p className="text-[#9A9A9A] mt-2">Завантаження транскрипту...</p>
        </div>
      </div>
    );
  }

  if (transcriptError) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <p className="text-red-500">Помилка завантаження транскрипту</p>
          <p className="text-[#9A9A9A] text-sm mt-1">
            Спробуйте оновити сторінку
          </p>
        </div>
      </div>
    );
  }

  // Use real transcript data if available, otherwise use fallback
  console.log(transcriptData, "transcriptData");

  return (
    <div className="flex flex-col gap-6 max-h-[630px] overflow-y-auto">
      {transcriptData?.data.items?.map((message: TranscriptMessage) => (
        <div key={message.id} className="flex gap-4">
          <div className="flex items-center gap-2 min-w-[100px]">
            <span className="text-[#00101F] font-semibold text-[16px] leading-[100%]">
              {message.role === "manager" ? "Менеджер:" : "Клієнт:"}
            </span>
          </div>
          <p className="text-[#00101F] text-[16px] leading-[140%] pl-0">
            {message.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CallTranscript;
