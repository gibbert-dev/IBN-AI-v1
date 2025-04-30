
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import TranslationForm from "@/components/TranslationForm";
import DatasetViewer from "@/components/DatasetViewer";
import MLPipeline from "@/components/MLPipeline";
import TranslationDemo from "@/components/TranslationDemo";
import IbenoInfo from "@/components/IbenoInfo";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close sidebar automatically when switching from desktop to mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header onSidebarToggle={() => setIsOpen(!isOpen)} />
      
      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1 container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
              IBN-AI: Ibọnọ Translation Project
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl text-base sm:text-lg leading-relaxed">
              Help build an Ibọnọ translation AI model by contributing English-Ibọnọ translation pairs. 
              Your contributions will help preserve and promote the Ibọnọ language for future generations.
            </p>
          </div>

          <div className="card-enhanced p-5 sm:p-8 mb-8 sm:mb-12 transition-all">
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-800 dark:text-teal-400 mb-4 sm:mb-6">Contribute Translations</h2>
            <TranslationForm />
          </div>
          
          {/* Ibeno Information Section */}
          <div className="mt-8 sm:mt-16">
            <IbenoInfo />
          </div>
        </main>

        {/* Sidebar Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side={isMobile ? "bottom" : "right"} className={`${isMobile ? 'h-[80vh] w-full rounded-t-xl' : 'w-[90vw] sm:w-[540px]'} p-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900`}>
            <div className="h-full overflow-y-auto p-4 sm:p-6">
              <div className="space-y-6 sm:space-y-8">
                <TranslationDemo />
                
                <div className="mt-6 sm:mt-8">
                  <Tabs defaultValue="dataset" className="w-full">
                    <TabsList className="mb-4 bg-blue-100/50 dark:bg-blue-900/30">
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
      
      <footer className="bg-gradient-to-r from-blue-800 to-teal-800 text-white py-10 sm:py-14 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gradient-primary bg-gradient-to-r from-blue-300 to-teal-200 bg-clip-text text-transparent">
                IBN-AI Project
              </h3>
              <p className="text-blue-100 text-sm sm:text-base max-w-md">
                A community-driven initiative to develop AI translation tools for the Ibọnọ language,
                preserving linguistic heritage through modern technology.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" aria-label="GitHub" className="text-blue-200 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="text-blue-200 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="Email" className="text-blue-200 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-200">Quick Links</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    About the Project
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    Translation Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    Contribute
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    Dataset Information
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-200">Ibọnọ Community</h3>
              <p className="text-blue-100 text-sm sm:text-base">
                "Courageous Hearts, Brilliant Minds, Boundless Kindness"
              </p>
              <p className="text-blue-200 text-xs sm:text-sm italic">
                We are a people of strength, wisdom, and compassion — standing tall like the ocean that cradles our home. 
              </p>
              <a href="#" className="inline-flex items-center mt-2 text-teal-200 hover:text-white transition-colors text-sm">
                Learn more about Ibọnọ culture
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
          
          <Separator className="my-6 bg-blue-600/30" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-blue-200">
            <div className="mb-4 sm:mb-0">
              © {new Date().getFullYear()} IBN-AI Project. All rights reserved.
            </div>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
