
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatasetViewer from "@/components/DatasetViewer";
import TranslationDemo from "@/components/TranslationDemo";
import MLPipeline from "@/components/MLPipeline";
import AdvancedSearch from "@/components/AdvancedSearch";
import QualityChecker from "@/components/QualityChecker";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ManagementPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-2 sm:px-0">
      <div className="w-full max-w-6xl mx-auto mt-6 mb-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Dataset & AI Management
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/")} 
          className="text-blue-700 border-blue-600 dark:text-blue-200 dark:border-blue-400"
        >
          Back to Home
        </Button>
      </div>
      <div className="flex-1 w-full max-w-6xl mx-auto pb-12">
        <Tabs defaultValue="dataset" className="w-full">
          <TabsList className="mb-4 bg-blue-100/50 dark:bg-blue-900/30 grid grid-cols-4 w-full">
            <TabsTrigger value="dataset" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              Dataset
            </TabsTrigger>
            <TabsTrigger value="search" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              Search
            </TabsTrigger>
            <TabsTrigger value="quality" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              Quality
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
              ML
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dataset">
            <TranslationDemo />
            <div className="mt-6">
              <DatasetViewer />
            </div>
          </TabsContent>
          <TabsContent value="search">
            <AdvancedSearch />
          </TabsContent>
          <TabsContent value="quality">
            <QualityChecker />
          </TabsContent>
          <TabsContent value="pipeline">
            <MLPipeline />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManagementPage;
