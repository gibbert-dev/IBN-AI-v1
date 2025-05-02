
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface DuplicateTranslationAlertProps {
  type: 'exact' | 'english';
  translation: {
    english: string;
    ibono: string;
  };
}

const DuplicateTranslationAlert = ({ type, translation }: DuplicateTranslationAlertProps) => {
  return (
    <Alert variant="default" className={`${
      type === 'exact' 
        ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
        : 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
    }`}>
      {type === 'exact' 
        ? <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        : <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      }
      <AlertTitle className="font-medium">
        {type === 'exact' 
          ? "Duplicate Translation Detected" 
          : "Similar Translation Found"}
      </AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        {type === 'exact' 
          ? "This exact English-Ibọnọ pair already exists in the database."
          : `This English text already has a translation: "${translation.ibono}"`}
      </AlertDescription>
    </Alert>
  );
};

export default DuplicateTranslationAlert;
