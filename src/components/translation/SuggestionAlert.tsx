
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SuggestionAlertProps {
  text: string;
  replacements: string[];
  onReplace: (replacement: string) => void;
}

const SuggestionAlert = ({ text, replacements, onReplace }: SuggestionAlertProps) => {
  if (!text || !replacements.length) return null;

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-sm text-blue-700">
          Possible typo: <span className="font-medium">{text}</span>. Did you mean:
        </span>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {replacements.map((replacement, index) => (
            <Button 
              key={index} 
              variant="outline" 
              size="sm" 
              className="h-7 bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={() => onReplace(replacement)}
            >
              {replacement}
            </Button>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SuggestionAlert;
