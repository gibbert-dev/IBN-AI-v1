
import { Button } from "@/components/ui/button";

interface SpecialCharacterButtonsProps {
  onCharacterSelect: (char: string) => void;
}

const SpecialCharacterButtons = ({ onCharacterSelect }: SpecialCharacterButtonsProps) => {
  const specialCharacters = [
    { char: "n̄", title: "n with macron below (n̄)" },
    { char: "ǝ", title: "Schwa (ǝ)" },
    { char: "ọ", title: "o with dot below (ọ)" },
    { char: "ị", title: "i with dot below (ị)" }
  ];

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {specialCharacters.map(({ char, title }) => (
        <Button 
          key={char}
          variant="secondary" 
          size="sm" 
          className="text-sm px-2 py-1 h-8" 
          onClick={() => onCharacterSelect(char)}
          title={title}
          type="button"
        >
          {char}
        </Button>
      ))}
    </div>
  );
};

export default SpecialCharacterButtons;
