
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { saveTranslation } from "@/utils/syncService"; // Changed to use syncService
import DuplicateTranslationAlert from "./translation/DuplicateTranslationAlert";
import IbonoTextArea from "./translation/IbonoTextArea";
import EnglishTextArea from "./translation/EnglishTextArea";
import TranslationFormContainer from "./translation/TranslationFormContainer";
import useEnglishDetection from "@/hooks/useEnglishDetection";
import { useOfflineStatus } from "@/context/OfflineContext";

const TranslationForm = () => {
  const [englishText, setEnglishText] = useState("");
  const [ibonoText, setIbonoText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<{
    type: 'exact' | 'english',
    translation: { english: string, ibono: string }
  } | null>(null);
  
  const { validateIbonoInput, validationError, setValidationError } = useEnglishDetection();
  const { isOnline } = useOfflineStatus();
  
  const handleIbonoChange = (text: string) => {
    setIbonoText(text);
    setValidationError(null);
    
    if (duplicateAlert) setDuplicateAlert(null);
    
    // Check if the input appears to be English
    const error = validateIbonoInput(text);
    if (error) {
      setValidationError(error);
    }
  };

  const handleEnglishChange = (text: string) => {
    setEnglishText(text);
    if (duplicateAlert) setDuplicateAlert(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!englishText.trim() || !ibonoText.trim()) {
      toast({
        title: "Validation Error",
        description: "Both English and Ibọnọ fields are required.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for English in Ibọnọ field
    const error = validateIbonoInput(ibonoText);
    if (error) {
      setValidationError(error);
      toast({
        title: "Validation Error",
        description: "The Ibọnọ field appears to contain English text.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setDuplicateAlert(null);
    
    try {
      console.log("Saving translation:", { englishText, ibonoText });
      const result = await saveTranslation(englishText, ibonoText);
      console.log("Save result:", result);
      
      if (result.isDuplicate && result.existingTranslation) {
        // Check if it's an exact match or just the English text match
        const isExactMatch = 
          result.existingTranslation.ibono.trim().toLowerCase() === ibonoText.trim().toLowerCase();
        
        setDuplicateAlert({
          type: isExactMatch ? 'exact' : 'english',
          translation: {
            english: result.existingTranslation.english,
            ibono: result.existingTranslation.ibono
          }
        });
        
        toast({
          title: "Duplicate Translation",
          description: isExactMatch 
            ? "This exact translation already exists in the database." 
            : "A different translation for this English text already exists.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: isOnline 
            ? "Translation saved to the database." 
            : "Translation saved locally and will be synced when you're online.",
        });
        
        // Clear the form only on success
        setEnglishText("");
        setIbonoText("");
      }
    } catch (error) {
      console.error("Error saving translation:", error);
      toast({
        title: "Error",
        description: "Failed to save translation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TranslationFormContainer 
      isSubmitting={isSubmitting} 
      onSubmit={handleSubmit}
      isSubmitDisabled={!!validationError}
      showOfflineIndicator={true}
    >
      {duplicateAlert && (
        <DuplicateTranslationAlert 
          type={duplicateAlert.type} 
          translation={duplicateAlert.translation} 
        />
      )}
      
      <IbonoTextArea 
        value={ibonoText}
        onChange={handleIbonoChange}
        validationError={validationError}
        duplicateType={duplicateAlert?.type === 'exact' ? 'exact' : null}
      />
      
      <EnglishTextArea 
        value={englishText}
        onChange={handleEnglishChange}
        hasDuplicateAlert={!!duplicateAlert}
      />
    </TranslationFormContainer>
  );
};

export default TranslationForm;
