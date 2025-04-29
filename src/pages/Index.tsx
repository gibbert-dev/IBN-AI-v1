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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header onSidebarToggle={() => setIsOpen(!isOpen)} />
      
      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
              IBN-AI: Ibọnọ Translation Project
            </h1>
            <p className="text-gray-600 max-w-3xl text-lg sm:text-xl leading-relaxed">
              Help build an Ibọnọ translation AI model by contributing English-Ibọnọ translation pairs. 
              Your contributions will help preserve and promote the Ibọnọ language for future generations.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 sm:p-8 rounded-xl shadow-lg mb-12 border border-teal-100">
            <h2 className="text-2xl font-semibold text-teal-800 mb-6">Contribute Translations</h2>
            <TranslationForm />
          </div>
          
          {/* Ibeno Information Section */}
          <div className="mt-16">
            <IbenoInfo />
          </div>
        </main>

        {/* Sidebar Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-[90vw] sm:w-[540px] p-0 bg-gradient-to-br from-white to-blue-50">
            <div className="h-full overflow-y-auto p-4 sm:p-6">
              <div className="space-y-8">
                <TranslationDemo />
                
                <div className="mt-8">
                  <Tabs defaultValue="dataset" className="w-full">
                    <TabsList className="mb-4 bg-blue-100/50">
                      <TabsTrigger value="dataset" className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                        Dataset Management
                      </TabsTrigger>
                      <TabsTrigger value="pipeline" className="text-sm sm:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                        ML Pipeline
                      </TabsTrigger>
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
      
      <footer className="bg-gradient-to-r from-blue-900 via-teal-900 to-blue-900 text-white py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-8 text-center">
            <div className="flex items-center justify-center text-sm sm:text-base font-medium">
              <span className="mr-2">Developed with</span>
              <span className="text-red-500 animate-pulse text-xl">❤️</span>
              <span className="ml-2">by Josebert</span>
            </div>
            <div className="space-y-4">
              <div className="text-2xl sm:text-3xl font-semibold mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                🌊 Ibeno People
              </div>
              <p className="text-lg sm:text-xl text-blue-100 font-medium">
                Courageous Hearts, Brilliant Minds, Boundless Kindness
              </p>
              <p className="text-sm sm:text-base text-teal-100/80 max-w-2xl mx-auto leading-relaxed">
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
