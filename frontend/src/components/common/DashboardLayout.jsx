import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen p-4 flex gap-6 bg-[#f3f4f6] dark:bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.08),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.08),_transparent_25%),linear-gradient(180deg,_#07111f_0%,_#050b14_100%)] transition-colors duration-300 overflow-hidden">
      <Sidebar />
      <main className="flex-1 w-full flex flex-col gap-6 h-[calc(100vh-2rem)] overflow-y-auto pr-2 custom-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;