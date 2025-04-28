interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header = ({ onSidebarToggle }: HeaderProps) => {
  return (
    <header className="bg-ibonai-green text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={onSidebarToggle}
            className="p-2 hover:bg-ibonai-darkBlue/10 rounded-md transition-colors"
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
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            <span className="sr-only">Toggle Sidebar</span>
          </button>
          <img 
            src={import.meta.env.BASE_URL + 'logo.png'} 
            alt="IBN-AI Logo" 
            className="h-8 w-8 object-contain"
            loading="eager"
            draggable="false"
          />
          <h1 className="text-2xl font-bold">IBN-AI</h1>
        </div>
        <div>
          <p className="text-sm opacity-80">Building Ibọnọ Language AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
