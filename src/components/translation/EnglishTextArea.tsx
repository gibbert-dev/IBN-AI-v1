
import { Textarea } from "@/components/ui/textarea";

interface EnglishTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  hasDuplicateAlert: boolean;
  validationError: string | null;
}

const EnglishTextArea = ({ value, onChange, hasDuplicateAlert, validationError }: EnglishTextAreaProps) => {
  return (
    <div>
      <label htmlFor="english" className="block text-sm font-medium mb-2">
        English Text
      </label>
      <Textarea
        id="english"
        placeholder="Enter English text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`w-full text-lg ${
          validationError 
            ? 'border-red-500 focus-visible:ring-red-500' 
            : hasDuplicateAlert 
              ? 'border-amber-500 focus-visible:ring-amber-500' 
              : ''
        }`}
      />
      {validationError && (
        <p className="mt-2 text-sm text-red-600">{validationError}</p>
      )}
    </div>
  );
};

export default EnglishTextArea;
