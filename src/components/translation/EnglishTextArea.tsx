
import { Textarea } from "@/components/ui/textarea";
import EnglishContextInput from "./EnglishContextInput";

interface EnglishTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  hasDuplicateAlert: boolean;
  validationError: string | null;
  suggestions?: { text: string, replacements: string[] } | null;
  onReplaceSuggestion?: (replacement: string) => void;
  hasExtraSpaces?: boolean;
  repeatedWords?: string[];
  context?: string;
  onContextChange?: (context: string) => void;
}

const EnglishTextArea = ({ 
  value, 
  onChange, 
  hasDuplicateAlert, 
  validationError,
  suggestions,
  onReplaceSuggestion,
  hasExtraSpaces = false,
  repeatedWords = [],
  context = "",
  onContextChange
}: EnglishTextAreaProps) => {
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleFixSpaces = () => {
    // Replace multiple spaces with single space
    const fixedText = value.replace(/\s+/g, ' ');
    onChange(fixedText);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="english" className="block text-sm font-medium mb-2">
          English Text
        </label>
        <Textarea
          id="english"
          placeholder="Enter English text"
          value={value}
          onChange={handleInput}
          rows={4}
          className={`w-full text-lg ${
            validationError 
              ? 'border-red-500 focus-visible:ring-red-500' 
              : hasDuplicateAlert 
                ? 'border-amber-500 focus-visible:ring-amber-500' 
                : hasExtraSpaces
                  ? 'border-blue-400 focus-visible:ring-blue-400'
                  : ''
          }`}
          spellCheck={true}
        />
        {validationError && (
          <div>
            <p className="mt-2 text-sm text-red-600">{validationError}</p>
            {repeatedWords && repeatedWords.length > 0 && (
              <div className="mt-1 text-xs text-red-500">
                <span>Repeated words: </span>
                {repeatedWords.map((word, index) => (
                  <span key={index} className="font-semibold">{word}{index < repeatedWords.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            )}
          </div>
        )}
        {hasExtraSpaces && !validationError && (
          <div className="mt-2 flex items-center">
            <p className="text-xs text-blue-600 mr-2">Extra spaces detected.</p>
            <button 
              type="button"
              onClick={handleFixSpaces}
              className="text-xs underline text-blue-600 hover:text-blue-800"
            >
              Fix automatically
            </button>
          </div>
        )}
      </div>

      {onContextChange && (
        <EnglishContextInput 
          value={context} 
          onChange={onContextChange} 
        />
      )}
    </div>
  );
};

export default EnglishTextArea;
