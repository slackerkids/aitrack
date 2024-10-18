type ActiveView = "doctor" | "client";
type SetActiveView = React.Dispatch<React.SetStateAction<ActiveView>>;

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: SetActiveView;
}

const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  return (
    <div className="w-64 bg-base-200 h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <ul className="menu bg-base-100 w-56 rounded-box">
        <li>
          <a
            className={activeView === "doctor" ? "active" : ""}
            onClick={() => setActiveView("doctor")}
          >
            Doctor
          </a>
        </li>
        <li>
          <a
            className={activeView === "client" ? "active" : ""}
            onClick={() => setActiveView("client")}
          >
            Client
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
