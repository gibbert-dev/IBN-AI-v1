interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header = ({ onSidebarToggle }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-400 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={onSidebarToggle}
            className="p-2 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle Sidebar"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="opacity-90"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <img 
              src={import.meta.env.BASE_URL + 'logo.png'} 
              alt="IBN-AI Logo" 
              className="h-8 w-8 object-contain filter drop-shadow-md"
              loading="eager"
              draggable="false"
            />
            <h1 className="text-2xl font-bold text-white/95">IBN-AI</h1>
          </div>
        </div>
        <div className="bg-white/10 px-4 py-1.5 rounded-full">
          <p className="text-sm font-medium text-white/90">Building Ibọnọ Language AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
