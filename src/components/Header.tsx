
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header = ({ onSidebarToggle }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-400 text-white py-3 sm:py-4 px-4 sm:px-6 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onSidebarToggle}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu size={isMobile ? 20 : 24} className="opacity-90" />
          </button>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <img 
              src={import.meta.env.BASE_URL + 'logo.png'} 
              alt="IBN-AI Logo" 
              className="h-10 w-10 sm:h-14 sm:w-14 object-contain filter drop-shadow-2xl"
              loading="eager"
              draggable="false"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-white/95">IBN-AI</h1>
          </div>
        </div>
        <div className="bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-white/90`}>
            Building Ibọnọ Language AI
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
