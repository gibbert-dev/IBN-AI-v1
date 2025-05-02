
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveTranslation } from "@/utils/databaseUtils";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

// Characters commonly found in English but not in Ibọnọ language
const ENGLISH_INDICATORS = ['w', 'c', 'q', 'x', 'z', 'j', 'v'];

const TranslationForm = () => {
  const [englishText, setEnglishText] = useState("");
  const [ibonoText, setIbonoText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<{
    type: 'exact' | 'english',
    translation: { english: string, ibono: string }
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Check if text appears to be English
  const detectEnglishInIbono = (text: string): boolean => {
    if (!text.trim()) return false;
    
    // Check for common English words
    const commonEnglishWords = ['the', 'and', 'this', 'that', 'with', 'for', 'from', 'have', 'who'];
    const words = text.toLowerCase().split(/\s+/);
    
    // Check for English-specific characters
    const hasEnglishChars = ENGLISH_INDICATORS.some(char => text.toLowerCase().includes(char));
    
    // Check for common English words
    const hasEnglishWords = commonEnglishWords.some(word => 
      words.includes(word) || words.some(w => w === word+'.' || w === word+',' || w === word+'!')
    );
    
    // If the text has multiple indicators of being English, flag it
    return (hasEnglishChars && text.length > 5) || hasEnglishWords;
  };

  const handleIbonoChange = (text: string) => {
    setIbonoText(text);
    setValidationError(null);
    
    if (duplicateAlert) setDuplicateAlert(null);
    
    // Check if the input appears to be English
    if (detectEnglishInIbono(text)) {
      setValidationError("This appears to be English text. Please enter Ibọnọ language text.");
    }
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
    if (detectEnglishInIbono(ibonoText)) {
      setValidationError("This appears to be English text. Please enter Ibọnọ language text.");
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
  
  const addSpecialChar = (char: string) => {
    const ibonoTextarea = document.getElementById('ibono') as HTMLTextAreaElement;
    if (ibonoTextarea) {
      const start = ibonoTextarea.selectionStart || 0;
      const end = ibonoTextarea.selectionEnd || 0;
      const newValue = ibonoTextarea.value.substring(0, start) + char + ibonoTextarea.value.substring(end);
      
      // Update the textarea value and state
      ibonoTextarea.value = newValue;
      setIbonoText(newValue);
      
      // Set cursor position after inserted character
      ibonoTextarea.focus();
      ibonoTextarea.setSelectionRange(start + char.length, start + char.length);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-ibonai-green to-ibonai-lightGreen text-white">
        <CardTitle className="text-2xl">Add New Translation</CardTitle>
        <CardDescription className="text-white/90 text-base">
          Contribute to the Ibọnọ language dataset by adding a new translation pair
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          {duplicateAlert && (
            <Alert variant="default" className={`${
              duplicateAlert.type === 'exact' 
                ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                : 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
            }`}>
              {duplicateAlert.type === 'exact' 
                ? <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                : <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              <AlertTitle className="font-medium">
                {duplicateAlert.type === 'exact' 
                  ? "Duplicate Translation Detected" 
                  : "Similar Translation Found"}
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                {duplicateAlert.type === 'exact' 
                  ? "This exact English-Ibọnọ pair already exists in the database."
                  : `This English text already has a translation: "${duplicateAlert.translation.ibono}"`}
              </AlertDescription>
            </Alert>
          )}
          
          <div>
            <label htmlFor="ibono" className="block text-sm font-medium mb-2">
              Ibọnọ Translation
            </label>
            <Textarea
              id="ibono"
              placeholder="Enter Ibọnọ translation"
              value={ibonoText}
              onChange={(e) => handleIbonoChange(e.target.value)}
              rows={4}
              className={`w-full text-lg ${
                validationError 
                  ? 'border-red-500 focus-visible:ring-red-500' 
                  : duplicateAlert?.type === 'exact' 
                    ? 'border-amber-500 focus-visible:ring-amber-500' 
                    : ''
              }`}
            />
            
            {validationError && (
              <p className="mt-2 text-sm text-red-600">{validationError}</p>
            )}
            
            <div className="mt-2 flex flex-wrap gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-sm px-2 py-1 h-8" 
                onClick={() => addSpecialChar("n̄")}
                title="n with macron below (n̄)"
                type="button"
              >
                n̄
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-sm px-2 py-1 h-8" 
                onClick={() => addSpecialChar("ǝ")}
                title="Schwa (ǝ)"
                type="button"
              >
                ǝ
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-sm px-2 py-1 h-8" 
                onClick={() => addSpecialChar("ọ")}
                title="o with dot below (ọ)"
                type="button"
              >
                ọ
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-sm px-2 py-1 h-8" 
                onClick={() => addSpecialChar("ị")}
                title="i with dot below (ị)"
                type="button"
              >
                ị
              </Button>
            </div>
          </div>
          
          <div>
            <label htmlFor="english" className="block text-sm font-medium mb-2">
              English Text
            </label>
            <Textarea
              id="english"
              placeholder="Enter English text"
              value={englishText}
              onChange={(e) => {
                setEnglishText(e.target.value);
                if (duplicateAlert) setDuplicateAlert(null);
              }}
              rows={4}
              className={`w-full text-lg ${duplicateAlert ? 'border-amber-500 focus-visible:ring-amber-500' : ''}`}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button 
            type="submit" 
            disabled={isSubmitting || !!validationError}
            size="lg"
            className="bg-ibonai-orange hover:bg-ibonai-orange/90 text-lg px-8"
          >
            {isSubmitting ? "Saving..." : "Save Translation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TranslationForm;
