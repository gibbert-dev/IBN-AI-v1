
import { Textarea } from "@/components/ui/textarea";
import SpecialCharacterButtons from "./SpecialCharacterButtons";

interface IbonoTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  validationError: string | null;
  duplicateType?: 'exact' | null;
  hasExtraSpaces?: boolean;
}

const IbonoTextArea = ({ 
  value, 
  onChange, 
  validationError, 
  duplicateType,
  hasExtraSpaces = false
}: IbonoTextAreaProps) => {
  const addSpecialChar = (char: string) => {
    const ibonoTextarea = document.getElementById('ibono') as HTMLTextAreaElement;
    if (ibonoTextarea) {
      const start = ibonoTextarea.selectionStart || 0;
      const end = ibonoTextarea.selectionEnd || 0;
      const newValue = ibonoTextarea.value.substring(0, start) + char + ibonoTextarea.value.substring(end);
      
      // Update the textarea value and state
      ibonoTextarea.value = newValue;
      onChange(newValue);
      
      // Set cursor position after inserted character
      ibonoTextarea.focus();
      ibonoTextarea.setSelectionRange(start + char.length, start + char.length);
    }
  };

  const handleFixSpaces = () => {
    // Replace multiple spaces with single space
    const fixedText = value.replace(/\s+/g, ' ');
    onChange(fixedText);
  };

  return (
    <div>
      <label htmlFor="ibono" className="block text-sm font-medium mb-2">
        Ibọnọ Translation
      </label>
      <Textarea
        id="ibono"
        placeholder="Enter Ibọnọ translation"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`w-full text-lg ${
          validationError 
            ? 'border-red-500 focus-visible:ring-red-500' 
            : duplicateType === 'exact' 
              ? 'border-amber-500 focus-visible:ring-amber-500' 
              : hasExtraSpaces
                ? 'border-blue-400 focus-visible:ring-blue-400'
                : ''
        }`}
        // Set spellCheck to false for Ibọnọ because browsers don't have Ibọnọ dictionaries
        spellCheck={false}
      />
      
      {validationError && (
        <p className="mt-2 text-sm text-red-600">{validationError}</p>
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
      
      <SpecialCharacterButtons onCharacterSelect={addSpecialChar} />
    </div>
  );
};

export default IbonoTextArea;
