
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations, deleteTranslation, clearAllTranslations } from "@/utils/databaseUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { X, Download, Trash2, Eye } from "lucide-react";
import ExportOptions from "./ExportOptions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DatasetViewer = () => {
  const [translations, setTranslations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
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

  const exportAsJSON = async () => {
    if (translations.length === 0) {
      toast({
        title: "Export failed",
        description: "There is no data to export.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const jsonData = JSON.stringify(translations, null, 2);
      const blob = new Blob([jsonData], { 
        type: "application/json;charset=utf-8"
      });
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
      console.error("JSON export error:", error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export data.",
        variant: "destructive"
      });
    }
  };

  const exportAsCSV = async () => {
    if (translations.length === 0) {
      toast({
        title: "Export failed",
        description: "There is no data to export.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const headers = "id,english,ibono,context,created_at\n";
      const rows = translations.map(t => 
        `${t.id},"${t.english.replace(/"/g, '""')}","${t.ibono.replace(/"/g, '""')}","${(t.context || '').replace(/"/g, '""')}",${t.created_at || ''}`
      ).join("\n");
      
      const csvData = headers + rows;
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

  const translationsWithContext = translations.filter(t => t.context?.trim());
  const contextPercentage = translations.length > 0 ? Math.round((translationsWithContext.length / translations.length) * 100) : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dataset Management</CardTitle>
        <CardDescription className="flex items-center gap-4">
          <span>{translations.length} entries collected</span>
          <Badge variant="secondary" className="text-xs">
            {contextPercentage}% with context
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Data</TabsTrigger>
            <TabsTrigger value="export">Export Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-4">
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
                      <TableHead className="w-[60px]">Context</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {translations.slice(0, 50).map((item) => (
                      <>
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.english}</TableCell>
                          <TableCell>{item.ibono}</TableCell>
                          <TableCell>
                            {item.context?.trim() ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs text-sm">{item.context}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
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
                        {expandedRow === item.id && item.context?.trim() && (
                          <TableRow>
                            <TableCell colSpan={4} className="bg-muted/50 p-4">
                              <div className="text-sm">
                                <span className="font-medium text-muted-foreground">Context: </span>
                                <span>{item.context}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
                {translations.length > 50 && (
                  <div className="p-4 text-center text-sm text-muted-foreground border-t">
                    Showing first 50 entries. Use export options to download complete dataset.
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No translations added yet. Start by adding some translations using the form above.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="export">
            <ExportOptions />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 justify-between border-t pt-4">
        <div>
          <Button 
            variant="destructive" 
            onClick={handleClearAll}
            disabled={translations.length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportAsCSV}
            disabled={translations.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Quick CSV
          </Button>
          <Button 
            onClick={exportAsJSON}
            disabled={translations.length === 0}
            className="bg-ibonai-green hover:bg-ibonai-green/90 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Quick JSON
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DatasetViewer;
