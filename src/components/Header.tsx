
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header = ({
  onSidebarToggle
}: HeaderProps) => {
  const isMobile = useIsMobile();
  
  const addSpecialChar = (char: string) => {
    // Create a temporary textarea to copy the character to clipboard
    const textarea = document.createElement('textarea');
    textarea.value = char;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show visual feedback that the character was copied
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.tagName === 'TEXTAREA') {
      const textArea = activeElement as HTMLTextAreaElement;
      const start = textArea.selectionStart || 0;
      const end = textArea.selectionEnd || 0;
      textArea.value = textArea.value.substring(0, start) + char + textArea.value.substring(end);
      textArea.setSelectionRange(start + char.length, start + char.length);
    } else {
      // If no active textarea, just copy to clipboard
      console.log(`Character ${char} copied to clipboard`);
    }
  };

  return <header className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-400 text-white py-3 sm:py-4 px-4 sm:px-6 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button onClick={onSidebarToggle} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-md transition-colors" aria-label="Toggle Sidebar">
            <Menu size={isMobile ? 20 : 24} className="opacity-90 mx-0 my-0" />
          </button>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <img src={import.meta.env.BASE_URL + 'logo.png'} alt="IBN-AI Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain filter drop-shadow-2xl" loading="eager" draggable="false" />
            <h1 className="text-xl sm:text-2xl font-bold text-white/95">IBN-AI</h1>
          </div>
        </div>
        <div className="ml-auto bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
          
        </div>
        <div className="ml-4 flex space-x-1 sm:space-x-2">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-sm sm:text-base px-2 py-1 h-8" 
              onClick={() => addSpecialChar("n̄")}
              title="n with macron below (n̄)"
            >
              n̄
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-sm sm:text-base px-2 py-1 h-8" 
              onClick={() => addSpecialChar("ǝ")}
              title="Schwa (ǝ)"
            >
              ǝ
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-sm sm:text-base px-2 py-1 h-8" 
              onClick={() => addSpecialChar("ọ")}
              title="o with dot below (ọ)"
            >
              ọ
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-sm sm:text-base px-2 py-1 h-8" 
              onClick={() => addSpecialChar("ị")}
              title="i with dot below (ị)"
            >
              ị
            </Button>
          </div>
        </div>
      </div>
    </header>;
};

export default Header;
