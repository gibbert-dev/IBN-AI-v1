
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations, deleteTranslation, clearAllTranslations, exportTranslationsAsJSON, exportTranslationsAsCSV, Translation } from "@/utils/databaseUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

const DatasetViewer = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadTranslations();
  }, []);
  
  const loadTranslations = async () => {
    setIsLoading(true);
    try {
      const data = await getTranslations();
      setTranslations(data);
    } catch (error) {
      console.error("Error fetching translations:", error);
      toast({
        title: "Error",
        description: "Failed to load translations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await deleteTranslation(id);
      await loadTranslations();
      toast({
        title: "Translation deleted",
        description: "The entry has been removed from the dataset."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete translation.",
        variant: "destructive"
      });
    }
  };
  
  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to delete all translations? This cannot be undone.")) {
      try {
        await clearAllTranslations();
        await loadTranslations();
        toast({
          title: "Dataset cleared",
          description: "All translations have been removed."
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to clear translations.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleExportJSON = async () => {
    if (translations.length === 0) {
      toast({
        title: "Export failed",
        description: "There is no data to export.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const jsonData = await exportTranslationsAsJSON();
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "ibono_translations.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "The dataset has been exported as JSON."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data.",
        variant: "destructive"
      });
    }
  };
  
  const handleExportCSV = async () => {
    if (translations.length === 0) {
      toast({
        title: "Export failed",
        description: "There is no data to export.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const csvData = await exportTranslationsAsCSV();
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "ibono_translations.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "The dataset has been exported as CSV."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Translation Dataset</CardTitle>
        <CardDescription>
          {translations.length} entries collected
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading translations...
          </div>
        ) : translations.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>English</TableHead>
                  <TableHead>Ibọnọ</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {translations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.english}</TableCell>
                    <TableCell>{item.ibono}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No translations added yet. Start by adding some translations using the form above.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between border-t pt-4">
        <div>
          <Button 
            variant="destructive" 
            onClick={handleClearAll}
            disabled={translations.length === 0}
          >
            Clear All
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            disabled={translations.length === 0}
          >
            Export as CSV
          </Button>
          <Button 
            onClick={handleExportJSON}
            disabled={translations.length === 0}
            className="bg-ibonai-green hover:bg-ibonai-green/90"
          >
            Export as JSON
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DatasetViewer;
