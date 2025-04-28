
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import TranslationForm from "@/components/TranslationForm";
import DatasetViewer from "@/components/DatasetViewer";
import MLPipeline from "@/components/MLPipeline";
import TranslationDemo from "@/components/TranslationDemo";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ibonai-darkBlue mb-2">Ibn-AI Builder</h1>
          <p className="text-gray-600 max-w-3xl">
            Build your own Ibọnọ translation AI model by collecting English-Ibọnọ translation pairs. 
            This platform helps you gather data, prepare it for training, and eventually deploy a custom 
            language model for the Ibọnọ language.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TranslationForm />
          <TranslationDemo />
        </div>
        
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
      </main>
      
      <footer className="bg-ibonai-darkBlue text-white py-4 px-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            Ibn-AI Builder - Preserving the Ibọnọ language through AI technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
