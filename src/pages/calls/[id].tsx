import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineLocalPhone } from "react-icons/md";
import { RiArrowLeftLine } from "react-icons/ri";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi2";
import { LuClock4 } from "react-icons/lu";
import { CallRecording } from "./components/CallRecording";
import AiAnalysis from "./components/AiAnalysis";
import Comments from "./components/Comments";
import CallTranscript from "./components/CallTranscript";
import { useCall } from "../../hooks/useCalls";
import { CallViewInfo, CallViewAI } from "../../services/api";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const periodTabs = [
  { value: "Інформація про дзвінок", label: "Інформація про дзвінок" },
  { value: "Розшифровка діалогу", label: "Розшифровка діалогу" },
];

const CallDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = useState("Інформація про дзвінок");

  const callId = id ? parseInt(id) : 0;
  const {
    callInfo,
    callAI,
    isLoadingCall,
    callError,
    checkCall,
    isCheckingCall,
  } = useCall(callId);

  const handleGoBack = () => {
    navigate("/calls");
  };

  const handleCheckCall = () => {
    if (callId) {
      checkCall(callId);
    }
  };

  if (isLoadingCall) {
    return (
      <div className="w-full flex gap-4 md:gap-6 max-w-[1400px] mx-auto">
        <div className="w-full bg-[#FFFFFF] rounded-2xl p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#739C9C] mx-auto"></div>
            <p className="text-[#9A9A9A] mt-2">Завантаження...</p>
          </div>
        </div>
      </div>
    );
  }

  if (callError) {
    return (
      <div className="w-full flex gap-4 md:gap-6 max-w-[1400px] mx-auto">
        <div className="w-full bg-[#FFFFFF] rounded-2xl p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500">Помилка завантаження дзвінка</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-[1400px] mx-auto p-3 sm:p-4 lg:p-0">
      <div className="w-full bg-[#FFFFFF] rounded-2xl p-3 sm:p-4 lg:p-6 flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <button
                onClick={handleGoBack}
                className="size-8 sm:size-9 lg:size-10 rounded-[8px] sm:rounded-[10px] lg:rounded-[12px] flex items-center justify-center bg-[#EBF0F0] hover:bg-[#D1E5E5] transition-colors duration-200 group"
              >
                <RiArrowLeftLine
                  size={16}
                  className="text-[#739C9C] group-hover:text-[#5F8888] transition-colors duration-200 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                />
              </button>

              <h2 className="text-[#00101F] font-semibold text-[18px] sm:text-[20px] lg:text-[24px] leading-[100%]">
                ID #{callId}
              </h2>
            </div>

            {callInfo?.is_checked ? (
              <button className="py-[12px] sm:py-[14.5px] px-4 sm:px-6 gap-2 sm:gap-3 rounded-[8px] sm:rounded-[12px] bg-[#739C9C] flex items-center justify-center text-[#FFFFFF] text-[12px] sm:text-[14px] leading-[100%] font-semibold">
                <IoCheckmarkDoneSharp size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Перевірено</span>
                <span className="sm:hidden">✓</span>
              </button>
            ) : (
              <button
                onClick={handleCheckCall}
                disabled={isCheckingCall}
                className="py-[12px] sm:py-[14.5px] px-4 sm:px-6 rounded-[8px] sm:rounded-[12px] bg-[#739C9C1A] flex items-center justify-center text-[#739C9C] text-[12px] sm:text-[14px] leading-[100%] font-semibold hover:bg-[#739C9C2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">
                  {isCheckingCall
                    ? "Відмічається..."
                    : "Відмітити як перевірено"}
                </span>
                <span className="sm:hidden">
                  {isCheckingCall ? "..." : "Перевірити"}
                </span>
              </button>
            )}
          </div>

          <div className="">
            <div className="w-full border-b border-[#EAEAEA]">
              <div className="flex gap-6 md:gap-10 overflow-x-auto">
                {periodTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setPeriodFilter(tab.value)}
                    className={`py-[10.5px] border-b-[3px] text-[14px] leading-[100%] transition-colors whitespace-nowrap ${
                      periodFilter === tab.value
                        ? "border-[#739C9C] text-[#739C9C] font-semibold"
                        : "border-transparent text-[#00101F]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {periodFilter === "Інформація про дзвінок" ? (
          <InformationAboutCall callInfo={callInfo} callAI={callAI} />
        ) : (
          <CallTranscript callId={callId} />
        )}
      </div>
      <Comments callId={callId} />
    </div>
  );
};

export default CallDetailsPage;

interface InformationAboutCallProps {
  callInfo: CallViewInfo | null;
  callAI: CallViewAI | null;
}

const InformationAboutCall = ({
  callInfo,
  callAI,
}: InformationAboutCallProps) => {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <FaRegCalendarAlt
              color="#739C9C"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-[#9A9A9A] text-[12px] sm:text-[14px] leading-[100%]">
              Дата
            </span>
          </div>
          <span className="text-[#00101F] text-[14px] sm:text-[16px] leading-[100%] font-semibold">
            {callInfo?.date || "Завантаження..."}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <HiOutlineUser color="#739C9C" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[#9A9A9A] text-[12px] sm:text-[14px] leading-[100%]">
              Менеджер
            </span>
          </div>
          <span className="text-[#00101F] text-[14px] sm:text-[16px] leading-[100%] font-semibold">
            {callInfo?.manager_name || "Завантаження..."}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <LuClock4 color="#739C9C" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[#9A9A9A] text-[12px] sm:text-[14px] leading-[100%]">
              Тривалість
            </span>
          </div>
          <span className="text-[#00101F] text-[14px] sm:text-[16px] leading-[100%] font-semibold">
            {callInfo?.duration_call || "Завантаження..."}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <MdOutlineLocalPhone
              color="#739C9C"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="text-[#9A9A9A] text-[12px] sm:text-[14px] leading-[100%]">
              Телефон клієнта
            </span>
          </div>
          <span className="text-[#00101F] text-[14px] sm:text-[16px] leading-[100%] font-semibold">
            {callInfo?.client_phone || "Завантаження..."}
          </span>
        </div>
      </div>

      <CallRecording audioUrl={callInfo?.recording_link || ""} />
      <AiAnalysis callAI={callAI} />
    </div>
  );
};
