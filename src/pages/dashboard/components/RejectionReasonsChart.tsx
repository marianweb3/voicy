import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

interface RejectionReasonsChartProps {
  data: ChartDataPoint[];
  total: number;
}

const RejectionReasonsChart = ({ data, total }: RejectionReasonsChartProps) => {
  return (
    <div className="w-full h-[240px] flex items-center justify-center">
      <div className="relative">
        <ResponsiveContainer width={240} height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={85}
              outerRadius={100}
              startAngle={90}
              endAngle={450}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={24}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-[#9A9A9A] text-[16px] leading-[100%] mb-1">
            Всього
          </p>
          <p className="text-[#00101F] text-[40px] leading-[100%] font-semibold">
            {total.toLocaleString().replace(",", " ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonsChart;
