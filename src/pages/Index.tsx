import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import TranslationForm from "@/components/TranslationForm";
import DatasetViewer from "@/components/DatasetViewer";
import MLPipeline from "@/components/MLPipeline";
import TranslationDemo from "@/components/TranslationDemo";
import IbenoInfo from "@/components/IbenoInfo";
import LanguageStats from "@/components/LanguageStats";
import ContributionTracker from "@/components/ContributionTracker";
import AdvancedSearch from "@/components/AdvancedSearch";
import QualityChecker from "@/components/QualityChecker";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Mail, ExternalLink } from "lucide-react";

const Index = () => {
  // Function to trigger refresh of stats components
  // (Optional: you can restore this if needed for LanguageStats/ContributionTracker)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTranslationAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="flex-1 flex">
        <main className="flex-1 container mx-auto py-8 sm:py-10 px-5 sm:px-8 animate-fade-in">
          <div className="mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-6">IBN-AI</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl text-base sm:text-lg leading-relaxed">
              Help build an Ibọnọ translation AI model by contributing English-Ibọnọ translation pairs. 
              Your contributions will help preserve and promote the Ibọnọ language for future generations.
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <LanguageStats refreshTrigger={refreshTrigger} />
            <ContributionTracker />
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
            
            {/* Column 2: Community */}
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
            
            {/* Column 3: Features */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-teal-200">Features</h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>• Translation Collection</li>
                <li>• Quality Assurance</li>
                <li>• Advanced Search</li>
                <li>• Progress Tracking</li>
                <li>• ML Pipeline</li>
                <li>• Offline Support</li>
              </ul>
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
    </div>
  );
};

export default Index;
