import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen p-4 flex gap-6 bg-[#f3f4f6] transition-colors duration-300 overflow-hidden">
      <Sidebar />
      <main className="flex-1 w-full flex flex-col gap-6 h-[calc(100vh-2rem)] overflow-y-auto pr-2 custom-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;