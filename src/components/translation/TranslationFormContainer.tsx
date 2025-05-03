
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import OfflineIndicator from "../OfflineIndicator";

interface TranslationFormContainerProps {
  children: ReactNode;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitDisabled: boolean;
  showOfflineIndicator?: boolean;
}

const TranslationFormContainer = ({ 
  children, 
  isSubmitting, 
  onSubmit,
  isSubmitDisabled,
  showOfflineIndicator = false
}: TranslationFormContainerProps) => {
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-ibonai-green to-ibonai-lightGreen text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Add New Translation</CardTitle>
            <CardDescription className="text-white/90 text-base">
              Contribute to the Ibọnọ language dataset by adding a new translation pair
            </CardDescription>
          </div>
          {showOfflineIndicator && <OfflineIndicator />}
        </div>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="pt-6 space-y-6">
          {children}
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button 
            type="submit" 
            disabled={isSubmitting || isSubmitDisabled}
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

export default TranslationFormContainer;
