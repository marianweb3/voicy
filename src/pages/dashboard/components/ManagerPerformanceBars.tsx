import { IoIosStar } from "react-icons/io";

interface ManagerData {
  name: string;
  rating: number;
  isPositive: boolean;
}

interface ManagerPerformanceBarsProps {
  data: ManagerData[];
  isPositive?: boolean;
}

const ManagerPerformanceBars = ({
  data,
  isPositive = true,
}: ManagerPerformanceBarsProps) => {
  const maxRating = Math.max(
    ...data.map((manager) => Math.abs(manager.rating))
  );

  return (
    <div className="flex justify-between gap-2 md:gap-2 overflow-x-auto">
      {data.map((manager, index) => {
        const barHeight = (Math.abs(manager.rating) / maxRating) * 100;

        return (
          <div
            key={index}
            className="flex flex-col items-center gap-2 md:gap-3 flex-1 min-w-0"
          >
            <div className="relative flex flex-col items-center justify-end h-[150px] md:h-[200px] w-[60px] md:w-[80px]">
              <div
                className="w-full rounded-[8px] md:rounded-[12px] flex flex-col items-center justify-start p-2 md:p-3 relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: isPositive ? "#62B2451A" : "#B245451A",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isPositive
                    ? "#62B24533"
                    : "#B2454533";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isPositive
                    ? "#62B2451A"
                    : "#B245451A";
                }}
              >
                <div
                  className={`flex items-center gap-1 ${
                    isPositive ? "text-[#62B245]" : "text-[#B24545]"
                  }`}
                >
                  <IoIosStar className="w-3 h-3 md:w-4 md:h-4" />

                  <span className="text-[14px] md:text-[16px] leading-[100%] font-semibold">
                    {Math.abs(manager.rating).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center w-full">
              <span className="text-[#9A9A9A] text-[12px] md:text-[12px] leading-[120%] font-medium flex">
                {manager.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManagerPerformanceBars;
