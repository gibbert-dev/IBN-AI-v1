
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const TranslationDemo = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // This is a demo function simulating translation - in a real app this would call your ML model API
  const simulateTranslation = async (text: string) => {
    setIsTranslating(true);
    
    // Simple simulation of translation for demo purposes
    // In reality, you would call your trained model API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulated Ibọnọ translation with common words
    const demoTranslations: Record<string, string> = {
      "hello": "mma",
      "thank you": "ẹsọ",
      "good morning": "ọtọnwa mma",
      "how are you": "mmọ ádi?",
      "water": "mmọng",
      "food": "ádiá",
      "welcome": "ọkkọ",
    };
    
    let result = text.toLowerCase();
    
    // Replace known words with their translations
    Object.entries(demoTranslations).forEach(([english, ibono]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      result = result.replace(regex, ibono);
    });
    
    // Add a note explaining this is just a demo
    if (result === text.toLowerCase()) {
      result = "(Demo only - actual translation would come from the trained model)";
    } else {
      result += " (Demo translation with limited vocabulary)";
    }
    
    setTranslatedText(result);
    setIsTranslating(false);
  };

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    simulateTranslation(inputText);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-ibonai-darkBlue text-white">
        <CardTitle>Translation Demo</CardTitle>
        <CardDescription className="text-white/80">
          See how your model would translate English to Ibọnọ
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="demo-input" className="block text-sm font-medium mb-1">
              English Text
            </label>
            <Textarea
              id="demo-input"
              placeholder="Enter text to translate (try 'hello' or 'thank you')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="translation-output" className="block text-sm font-medium mb-1">
              Ibọnọ Translation
            </label>
            <div className="border rounded-md p-3 min-h-[80px] bg-muted/30">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {translatedText || "Translation will appear here"}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Button 
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          className="bg-ibonai-orange hover:bg-ibonai-orange/90"
        >
          {isTranslating ? "Translating..." : "Translate"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranslationDemo;
