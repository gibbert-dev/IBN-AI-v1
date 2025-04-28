import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveTranslation } from "@/utils/databaseUtils";
import { toast } from "@/components/ui/use-toast";

const TranslationForm = () => {
  const [englishText, setEnglishText] = useState("");
  const [ibonoText, setIbonoText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    setIsSubmitting(true);
    
    try {
      await saveTranslation(englishText, ibonoText);
      toast({
        title: "Success!",
        description: "Translation saved to the database.",
      });
      
      // Clear the form
      setEnglishText("");
      setIbonoText("");
    } catch (error) {
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
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-ibonai-green to-ibonai-lightGreen text-white">
        <CardTitle className="text-2xl">Add New Translation</CardTitle>
        <CardDescription className="text-white/90 text-base">
          Contribute to the Ibọnọ language dataset by adding a new translation pair
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          <div>
            <label htmlFor="english" className="block text-sm font-medium mb-2">
              English Text
            </label>
            <Textarea
              id="english"
              placeholder="Enter English text"
              value={englishText}
              onChange={(e) => setEnglishText(e.target.value)}
              rows={4}
              className="w-full text-lg"
            />
          </div>
          
          <div>
            <label htmlFor="ibono" className="block text-sm font-medium mb-2">
              Ibọnọ Translation
            </label>
            <Textarea
              id="ibono"
              placeholder="Enter Ibọnọ translation"
              value={ibonoText}
              onChange={(e) => setIbonoText(e.target.value)}
              rows={4}
              className="w-full text-lg"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button 
            type="submit" 
            disabled={isSubmitting}
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
