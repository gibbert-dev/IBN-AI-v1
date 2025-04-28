import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import TranslationForm from "@/components/TranslationForm";
import DatasetViewer from "@/components/DatasetViewer";
import MLPipeline from "@/components/MLPipeline";
import TranslationDemo from "@/components/TranslationDemo";
import IbenoInfo from "@/components/IbenoInfo";
import { useState } from "react";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onSidebarToggle={() => setIsOpen(!isOpen)} />
      
      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-ibonai-darkBlue mb-2">IBN-AI</h1>
            <p className="text-gray-600 max-w-3xl">
              Build your own Ibọnọ translation AI model by collecting English-Ibọnọ translation pairs. 
              Add new translations below to help grow the dataset.
            </p>
          </div>

          <TranslationForm />
          
          {/* Ibeno Information Section */}
          <div className="mt-12">
            <IbenoInfo />
          </div>
        </main>

        {/* Sidebar Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-6">
                <TranslationDemo />
                
                <div className="mt-6">
                  <Tabs defaultValue="dataset" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="dataset">Dataset Management</TabsTrigger>
                      <TabsTrigger value="pipeline">ML Pipeline</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="dataset">
                      <DatasetViewer />
                    </TabsContent>
                    
                    <TabsContent value="pipeline">
                      <MLPipeline />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <footer className="bg-ibonai-darkBlue text-white py-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6 text-center">
            <div className="flex items-center justify-center text-sm font-medium">
              <span className="mr-2">Developed with</span>
              <span className="text-red-500 animate-pulse text-xl">❤️</span>
              <span className="ml-2">by Josebert</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-semibold mb-2">
                🌊 Ibeno People
              </div>
              <p className="text-lg text-white/90 font-medium">
                Courageous Hearts, Brilliant Minds, Boundless Kindness
              </p>
              <p className="text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
                We are a people of strength, wisdom, and compassion — standing tall like the ocean that cradles our home. 
                Our language carries the legacy of great minds and kind souls. 
                With every word, we build a future as vast and vibrant as our spirit.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
