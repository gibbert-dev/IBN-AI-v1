
import { Rocket } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-ibonai-green text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Rocket size={24} />
          <h1 className="text-2xl font-bold">Ibn-AI Builder</h1>
        </div>
        <div>
          <p className="text-sm opacity-80">Building Ibọnọ Language AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
