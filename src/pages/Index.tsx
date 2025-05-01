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
import { Github, Twitter, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close sidebar automatically when switching from desktop to mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile]);
  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header onSidebarToggle={() => setIsOpen(!isOpen)} />
      
      <div className="flex-1 flex">
        {/* Main content */}
        <main className="flex-1 container mx-auto py-8 sm:py-10 px-5 sm:px-8 animate-fade-in">
          <div className="mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-6">IBN-AI</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl text-base sm:text-lg leading-relaxed">
              Help build an Ibọnọ translation AI model by contributing English-Ibọnọ translation pairs. 
              Your contributions will help preserve and promote the Ibọnọ language for future generations.
            </p>
          </div>

          <div className="card-enhanced p-6 sm:p-8 mb-10 sm:mb-14 transition-all">
            <h2 className="sm:text-2xl mb-6 sm:mb-8 text-center text-slate-950 font-bold text-xl">Contribute Translations</h2>
            <TranslationForm />
          </div>
          
          {/* Ibeno Information Section */}
          <div className="mt-10 sm:mt-16">
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
      
      <footer className="mt-auto bg-gradient-to-r from-blue-900 to-teal-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
            {/* Column 1: About */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-teal-200 bg-clip-text text-transparent">
                IBN-AI Project
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                A community-driven initiative to develop AI translation tools for the Ibọnọ language,
                preserving linguistic heritage through modern technology.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-5 pt-3">
                <a href="https://github.com/Josebert2001" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-blue-200 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://x.com/JosephR90978798?s=09" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-blue-200 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="mailto:robertsunday333@gmail.com" aria-label="Email" className="text-blue-200 hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
            
            {/* Column 2: Quick Links */}
            
            
            {/* Column 3: Community */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-teal-200">Community</h3>
              <p className="text-blue-100 text-sm">
                "Courageous Hearts, Brilliant Minds, Boundless Kindness"
              </p>
              <p className="text-blue-200 text-xs italic">
                We are a people of strength, wisdom, and compassion — standing tall like the ocean that cradles our home.
              </p>
              <a href="#" className="inline-flex items-center mt-2 text-teal-200 hover:text-white transition-colors text-sm group">
                Learn more about Ibọnọ culture
                <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            {/* Column 4: Contact */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-teal-200">Contact Us</h3>
              <div className="space-y-3 text-sm">
                
                <p className="text-blue-100">
                  <span className="block font-medium">Email:</span>
                  <a href="mailto:robertsunday333@gmail.com" className="hover:text-white transition-colors">
                    robertsunday333@gmail.com
                  </a>
                </p>
                <p className="text-blue-100">
                  <span className="block font-medium">Phone:</span>
                  <a href="tel:+2347083057837" className="hover:text-white transition-colors">
                    07083057837
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Separator */}
          <Separator className="bg-blue-700/50 my-6" />
          
          {/* Bottom section */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-blue-200">
            <div className="mb-4 sm:mb-0">
              © {new Date().getFullYear()} IBN-AI Project by JR Digital Insights. All rights reserved.
            </div>
            <div className="flex gap-6 flex-wrap justify-center">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;