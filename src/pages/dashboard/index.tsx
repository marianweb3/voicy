import StatusBar from "./components/StatusBar";
import CallDynamicsWrapper from "./components/CallDynamicsWrapper";
import RejectionReasonsWrapper from "./components/RejectionReasonsWrapper";
import BestManagersWrapper from "./components/BestManagersWrapper";
import WorstManagersWrapper from "./components/WorstManagersWrapper";

const Dashboard = () => {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6 max-w-[1400px] mx-auto">
      <StatusBar />

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        <CallDynamicsWrapper title="Динаміка дзвінків" />
        <RejectionReasonsWrapper title="Причини відмов" />
      </div>

      <div className="flex flex-col flex-wrap xl:flex-nowrap lg:flex-row gap-4 md:gap-6">
        <BestManagersWrapper />
        <WorstManagersWrapper />
      </div>
    </div>
  );
};

export default Dashboard;
