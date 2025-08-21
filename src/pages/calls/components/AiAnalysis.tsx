import { MdStarRate } from "react-icons/md";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CallViewAI } from "../../../services/api";

interface AiAnalysisProps {
  callAI: CallViewAI | null;
}

const AiAnalysis = ({ callAI }: AiAnalysisProps) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <h2 className="text-[#00101F] font-semibold text-[18px] sm:text-[20px] lg:text-[24px] leading-[100%]">
          Аналітика від АІ
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-full lg:max-w-[600px] justify-start lg:justify-end w-full">
          <div className="flex items-center gap-2">
            <MdStarRate
              color={callAI?.ai_color || "#B2A945"}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <span
              className="font-semibold text-[18px] sm:text-[20px] lg:text-[24px] leading-[100%]"
              style={{ color: callAI?.ai_color || "#B2A945" }}
            >
              {callAI?.ai_score || "—"}
            </span>
          </div>

          <div
            className="w-full sm:w-auto sm:max-w-[140px] h-10 flex items-center justify-center rounded-[8px] py-[9px] px-3"
            style={{
              backgroundColor: callAI?.status_color
                ? `${callAI.status_color}1A`
                : "#62B2451A",
            }}
          >
            <span
              className="font-semibold text-[14px] sm:text-[16px] leading-[100%] text-center"
              style={{ color: callAI?.status_color || "#62B245" }}
            >
              {callAI?.status_label || "Завантаження..."}
            </span>
          </div>
          {callAI?.reject_reason && (
            <div
              className={`w-full sm:w-auto ${
                callAI.reject_reason === "Менеджер не дотиснув"
                  ? "sm:max-w-[220px]"
                  : "sm:max-w-[140px]"
              } h-10 flex items-center justify-center bg-[#B245451A] rounded-[8px] py-[9px] px-3`}
            >
              <span className="text-[#B24545] font-semibold text-[14px] sm:text-[16px] leading-[100%] text-center">
                {callAI.reject_reason}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-0 justify-between">
        <RadarMap callAI={callAI} />

        <div className="sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto w-full bg-[#739C9C1A] rounded-[12px] p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
          {callAI?.analysis_text ? (
            <div className="text-[#9A9A9A] text-[14px] leading-[140%] prose prose-sm max-w-none prose-headings:text-[#00101F] prose-headings:font-semibold prose-strong:text-[#00101F] prose-strong:font-semibold prose-p:mb-2 prose-ul:mb-2 prose-li:mb-1">
              {callAI.analysis_text.split("\n").map((line, index) => {
                // Handle markdown headers
                if (line.startsWith("### ")) {
                  return (
                    <h3
                      key={index}
                      className="text-[16px] font-semibold text-[#00101F] mb-2 mt-4"
                    >
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                // Handle bold text
                const processedLine = line.replace(
                  /\*\*(.*?)\*\*/g,
                  "<strong>$1</strong>"
                );
                // Handle line breaks and regular text
                if (line.trim() === "") {
                  return <br key={index} />;
                }
                return (
                  <p
                    key={index}
                    className="mb-1"
                    dangerouslySetInnerHTML={{ __html: processedLine }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-[#9A9A9A] text-[14px] leading-[100%]">
              Завантаження аналізу...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiAnalysis;

interface RadarMapProps {
  callAI: CallViewAI | null;
}

const RadarMap = ({ callAI }: RadarMapProps) => {
  // Transform data for Recharts
  const data = callAI?.scores?.map((score) => ({
    subject: score.title,
    value: score.score || 0,
    fullMark: 10,
  })) || Array(10).fill(null).map((_, i) => ({
    subject: `Критерій ${i + 1}`,
    value: 0,
    fullMark: 10,
  }));

  // Custom label component to show both title and score
  const CustomAngleAxisTick = (props: any) => {
    const { payload, x, y, textAnchor } = props;
    const score = data.find(item => item.subject === payload.value)?.value || 0;
    
    // Split title into words for two-row display
    const words = payload.value.split(' ');
    const firstRow = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    const secondRow = words.slice(Math.ceil(words.length / 2)).join(' ');
    
    // Adjust text positioning based on side
    const isRightSide = textAnchor === 'start'; // Right side of chart
    const isLeftSide = textAnchor === 'end'; // Left side of chart
    const offsetX = isRightSide ? -0 : isLeftSide ? 0 : 0; // Move right-side left, left-side right
    
    return (
      <g className="recharts-layer recharts-polar-angle-axis-tick">
        <text 
          x={x + offsetX} 
          y={y - 15} 
          textAnchor="middle" 
          dominantBaseline="middle"
          className="text-[10px] fill-[#666] leading-tight"
        >
          <tspan x={x } dy="16" className="text-[15px] font-bold fill-[#739C9C]">{score}</tspan>
          <tspan x={x + offsetX} dy="13" textAnchor="middle">{firstRow}</tspan>
          {secondRow && <tspan x={x } dy="12" >{secondRow}</tspan>}
        </text>
      </g>
    );
  };

  return (
    <div className="max-w-full sm:max-w-[900px] lg:max-w-[1000px] w-full flex flex-col items-center h-[400px] sm:h-[700px] lg:h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} >
          <PolarGrid 
            stroke="#E5E5E5" 
            strokeWidth={1}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={<CustomAngleAxisTick />}
            className="text-[11px]"
          />
         
          <Radar 
            name="Score" 
            dataKey="value" 
            stroke="#739C9C" 
            fill="#739C9C" 
            fillOpacity={0.2}
            strokeWidth={3}
            dot={{ fill: '#739C9C', strokeWidth: 2, stroke: '#fff', r: 6 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};