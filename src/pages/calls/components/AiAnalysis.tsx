import { MdStarRate } from "react-icons/md";
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

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between">
        <RadarMap callAI={callAI} />

        <div className="max-w-full lg:max-w-[481px] max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto w-full bg-[#739C9C1A] rounded-[12px] p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
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
  // Use real data points from API or fallback to sample data
  const dataPoints = callAI?.scores?.map((score, index) => ({
    label: (index + 1).toString(),
    value: score.score || 0,
    title: score.title,
  })) || [
    { label: "1", value: 0, title: "Завантаження..." },
    { label: "2", value: 0, title: "Завантаження..." },
    { label: "3", value: 0, title: "Завантаження..." },
    { label: "4", value: 0, title: "Завантаження..." },
    { label: "5", value: 0, title: "Завантаження..." },
    { label: "6", value: 0, title: "Завантаження..." },
    { label: "7", value: 0, title: "Завантаження..." },
    { label: "8", value: 0, title: "Завантаження..." },
    { label: "9", value: 0, title: "Завантаження..." },
    { label: "10", value: 0, title: "Завантаження..." },
  ];

  const size = 350; // Smaller for mobile
  const center = size / 2;
  const maxRadius = 120; // Adjusted for smaller size
  const levels = 5; // Number of concentric circles

  // Calculate angle for each data point
  const angleStep = (2 * Math.PI) / dataPoints.length;

  // Generate points for the radar chart (API uses 1-5 scale)
  const radarPoints = dataPoints.map((point, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const radius = (point.value / 5) * maxRadius; // Changed from 10 to 5 for proper scale
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y, ...point };
  });

  // Generate grid lines (concentric circles)
  const gridCircles = Array.from({ length: levels }, (_, i) => {
    const radius = ((i + 1) / levels) * maxRadius;
    return radius;
  });

  // Generate axis lines
  const axisLines = dataPoints.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const endX = center + maxRadius * Math.cos(angle);
    const endY = center + maxRadius * Math.sin(angle);
    return { endX, endY };
  });

  // Generate label positions
  const labelPositions = dataPoints.map((point, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const labelRadius = maxRadius + 15;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);

    // Position the value labels a bit further out
    // const valueRadius = maxRadius + 35;
    const valueX = center + labelRadius * Math.cos(angle);
    const valueY = center + labelRadius * Math.sin(angle);

    // Position the title labels below the values (further from center)
    const titleRadius = maxRadius + 55;
    const titleX = center + titleRadius * Math.cos(angle);
    const titleY = center + titleRadius * Math.sin(angle);

    return {
      x,
      y,
      valueX,
      valueY,
      titleX,
      titleY,
      label: point.label,
      value: point.value,
      title: point.title,
    };
  });

  // Create path string for the filled area
  const pathData =
    radarPoints
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + " Z";

  return (
    <div className="max-w-full sm:max-w-[400px] lg:max-w-[480px] w-full flex justify-center">
      <svg
        width={size}
        height={size}
        className="overflow-visible w-full h-auto max-w-[300px] sm:max-w-[350px] lg:max-w-[480px]"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Grid circles */}
        {gridCircles.map((radius, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, index) => (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={line.endX}
            y2={line.endY}
            stroke="#E5E5E5"
            strokeWidth="1"
          />
        ))}

        {/* Filled area */}
        <path
          d={pathData}
          fill="#739C9C"
          fillOpacity="0.3"
          stroke="#739C9C"
          strokeWidth="2"
        />

        {/* Data points */}
        {radarPoints.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#739C9C"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ))}

        {/* Labels and values */}
        {labelPositions.map((pos, index) => (
          <g key={index}>
            {/* Number labels */}

            {/* Value labels */}

            {/* Title labels - smaller text below values */}
            <foreignObject
              x={pos.titleX - 50}
              y={pos.titleY - 10}
              width="100"
              height="30"
            >
              <div className="text-[10px] font-normal text-[#666666] text-center leading-tight break-words">
                {pos.title}
              </div>
            </foreignObject>
            <text
              x={pos.valueX}
              y={pos.valueY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[16px] font-semibold fill-[#739C9C]"
            >
              {pos.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
