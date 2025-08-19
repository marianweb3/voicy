import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  day: string;
  calls: number;
}

interface CallDynamicsChartProps {
  data: ChartDataPoint[];
}

const CallDynamicsChart = ({ data }: CallDynamicsChartProps) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#739C9C] text-white px-3 py-2 rounded-lg shadow-lg text-sm relative">
          <p className="font-medium">{label}</p>
          <p>{`${payload[0].value
            .toLocaleString()
            .replace(",", " ")} дзвінків`}</p>
          {/* Tooltip arrow */}
          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#739C9C]"></div>
        </div>
      );
    }
    return null;
  };

  // Custom dot component for hover state
  const CustomDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#62B245"
        stroke="#ffffff"
        strokeWidth={3}
        className="drop-shadow-sm"
      />
    );
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="none"
            stroke="#E8E8E8"
            vertical={true}
            horizontal={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#9A9A9A",
              fontWeight: 400,
            }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#9A9A9A",
              fontWeight: 400,
            }}
            tickFormatter={(value) => `${value}т`}
            domain={[0, 12]}
            ticks={[0, 2, 4, 6, 8, 10, 12]}
            orientation="left"
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="#62B245"
            strokeWidth={2.5}
            dot={false}
            activeDot={<CustomDot />}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallDynamicsChart;
