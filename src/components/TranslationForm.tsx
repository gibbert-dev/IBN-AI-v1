import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { saveTranslation } from "@/utils/syncService"; // Changed to use syncService
import DuplicateTranslationAlert from "./translation/DuplicateTranslationAlert";
import IbonoTextArea from "./translation/IbonoTextArea";
import EnglishTextArea from "./translation/EnglishTextArea";
import TranslationFormContainer from "./translation/TranslationFormContainer";
import SuggestionAlert from "./translation/SuggestionAlert";
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
  
  const { 
    validateIbonoInput, 
    validateEnglishInput, 
    validationError, 
    setValidationError,
    suggestions,
    hasExtraSpaces,
    potentialEnglishDetected,
    acceptEnglishWords
  } = useEnglishDetection();
  
  const [englishValidationError, setEnglishValidationError] = useState<string | null>(null);
  const [englishHasExtraSpaces, setEnglishHasExtraSpaces] = useState<boolean>(false);
  
  const { isOnline } = useOfflineStatus();
  
  const handleIbonoChange = (text: string) => {
    setIbonoText(text);
    setValidationError(null);
    
    if (duplicateAlert) setDuplicateAlert(null);
    
    // Check if the input appears to be English and for repeated words
    const error = validateIbonoInput(text);
    if (error) {
      setValidationError(error);
    }
  };

  const handleEnglishChange = (text: string) => {
    setEnglishText(text);
    setEnglishValidationError(null);
    
    if (duplicateAlert) setDuplicateAlert(null);
    
    // Check for repeated words and typos in English text
    const error = validateEnglishInput(text);
    if (error) {
      setEnglishValidationError(error);
    }
  };

  const handleReplaceSuggestion = (replacement: string) => {
    if (!suggestions) return;
    
    // Replace the typo with the suggested correction
    const regex = new RegExp(`\\b${suggestions.text}\\b`, 'gi');
    const correctedText = englishText.replace(regex, replacement);
    setEnglishText(correctedText);
    setEnglishValidationError(null);
  };

  // Add a handler for accepting English words in Ibono
  const handleAcceptEnglishWords = () => {
    acceptEnglishWords(ibonoText);
    toast({
      title: "English Words Accepted",
      description: "These words will be accepted in your Ibọnọ translations.",
    });
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
    const ibonoError = validateIbonoInput(ibonoText);
    if (ibonoError && !potentialEnglishDetected) {
      setValidationError(ibonoError);
      toast({
        title: "Validation Error",
        description: ibonoError,
        variant: "destructive"
      });
      return;
    }
    
    // If user has decided to accept English words, allow submission even with validation error
    if (ibonoError && potentialEnglishDetected) {
      // If they haven't clicked "Accept as Valid", show an error
      toast({
        title: "Validation Error",
        description: "Please click 'Accept as Valid' to confirm use of English words or correct your translation.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for repeated words in English text
    const englishError = validateEnglishInput(englishText);
    if (englishError) {
      setEnglishValidationError(englishError);
      toast({
        title: "Validation Error",
        description: englishError,
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
      isSubmitDisabled={(!!validationError && !potentialEnglishDetected) || !!englishValidationError}
      showOfflineIndicator={true}
    >
      {duplicateAlert && (
        <DuplicateTranslationAlert 
          type={duplicateAlert.type} 
          translation={duplicateAlert.translation} 
        />
      )}
      
      {suggestions && !duplicateAlert && (
        <SuggestionAlert 
          text={suggestions.text}
          replacements={suggestions.replacements}
          onReplace={handleReplaceSuggestion}
        />
      )}
      
      <IbonoTextArea 
        value={ibonoText}
        onChange={handleIbonoChange}
        validationError={validationError}
        duplicateType={duplicateAlert?.type === 'exact' ? 'exact' : null}
        hasExtraSpaces={hasExtraSpaces}
        potentialEnglishDetected={potentialEnglishDetected}
        onAcceptEnglish={handleAcceptEnglishWords}
      />
      
      <EnglishTextArea 
        value={englishText}
        onChange={handleEnglishChange}
        hasDuplicateAlert={!!duplicateAlert}
        validationError={englishValidationError}
        suggestions={suggestions}
        onReplaceSuggestion={handleReplaceSuggestion}
        hasExtraSpaces={englishHasExtraSpaces}
      />
    </TranslationFormContainer>
  );
};

export default TranslationForm;
