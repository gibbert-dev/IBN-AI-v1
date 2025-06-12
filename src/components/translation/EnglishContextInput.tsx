
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EnglishContextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const EnglishContextInput = ({ value, onChange }: EnglishContextInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const examples = [
    "Used when greeting someone in the morning",
    "A traditional ceremony for welcoming guests",
    "Refers to the main meal of the day",
    "Expression of gratitude after receiving help",
    "Term for elderly person showing respect"
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Add Context/Definition (Optional)
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm">
                Adding context helps create better translations by explaining when and how the English phrase is used.
                This makes the AI model more culturally aware.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          <Textarea
            placeholder="Explain when this phrase is used, its cultural context, or provide additional meaning..."
            value={value}
            onChange={handleInput}
            rows={2}
            className="w-full text-sm"
            spellCheck={true}
          />
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{value.length}/200 characters</span>
            {value.length > 200 && (
              <span className="text-amber-600">Consider keeping context concise</span>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Examples of good context:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              {examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnglishContextInput;
