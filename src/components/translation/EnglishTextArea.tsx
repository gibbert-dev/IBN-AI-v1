
import { Textarea } from "@/components/ui/textarea";

interface EnglishTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  hasDuplicateAlert: boolean;
}

const EnglishTextArea = ({ value, onChange, hasDuplicateAlert }: EnglishTextAreaProps) => {
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
        className={`w-full text-lg ${hasDuplicateAlert ? 'border-amber-500 focus-visible:ring-amber-500' : ''}`}
      />
    </div>
  );
};

export default EnglishTextArea;
