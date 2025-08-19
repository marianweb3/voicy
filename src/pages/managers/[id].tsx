import { UserInfo } from "./components/dynamic-page/UserInfo";
import ManagerCallDynamicsWrapper from "./components/ManagerCallDynamicsWrapper";
import LastCalls from "./components/dynamic-page/LastCalls";

const ManagerDetailsPage = () => {
  return (
    <div className="w-full flex gap-4 md:gap-6 max-w-[1400px] mx-auto">
      <UserInfo />
      <div className="flex flex-col gap-6 w-full">
        <ManagerCallDynamicsWrapper title="Динаміка дзвінків" />
        <LastCalls />
      </div>
    </div>
  );
};

export default ManagerDetailsPage;
