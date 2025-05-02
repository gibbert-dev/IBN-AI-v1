import { useState } from "react";
import { saveTranslation } from "@/utils/databaseUtils";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/db/translationsDB";

// Import our new components
import DuplicateTranslationAlert from "./translation/DuplicateTranslationAlert";
import IbonoTextArea from "./translation/IbonoTextArea";
import EnglishTextArea from "./translation/EnglishTextArea";
import TranslationFormContainer from "./translation/TranslationFormContainer";
import useEnglishDetection from "@/hooks/useEnglishDetection";

const TranslationForm = () => {
  const [englishText, setEnglishText] = useState("");
  const [ibonoText, setIbonoText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<{
    type: 'exact' | 'english',
    translation: { english: string, ibono: string }
  } | null>(null);
  
  const { validateIbonoInput, validationError, setValidationError } = useEnglishDetection();

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
      if (navigator.onLine) {
        // Try online save first
        const result = await saveTranslation(englishText, ibonoText);
        
        if (result.isDuplicate && result.existingTranslation) {
          const isExactMatch = result.existingTranslation.ibono.trim().toLowerCase() === ibonoText.trim().toLowerCase();
          
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
            description: "Translation saved to the database.",
          });
          
          // Clear the form only on success
          setEnglishText("");
          setIbonoText("");
        }
      } else {
        // Save locally when offline
        await db.translations.add({
          text: englishText,
          translation: ibonoText,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          synced: 0  // 0 means unsynced
        });

        toast({
          title: "Saved Offline",
          description: "Translation saved locally. Will sync when online.",
        });

        // Clear the form
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
