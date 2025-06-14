
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations, deleteTranslation, clearAllTranslations } from "@/utils/databaseUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { X, Download, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import ExportOptions from "./ExportOptions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import EditableContext from "./EditableContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DatasetViewer = () => {
  const [translations, setTranslations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "english" | "ibono">("newest");
  
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
  
  // Filtered and sorted translations with memoization
  const filteredAndSortedTranslations = useMemo(() => {
    let filtered = translations;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = translations.filter(t => 
        t.english.toLowerCase().includes(search) ||
        t.ibono.toLowerCase().includes(search) ||
        (t.context && t.context.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case "oldest":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case "english":
          return a.english.localeCompare(b.english);
        case "ibono":
          return a.ibono.localeCompare(b.ibono);
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [translations, searchTerm, sortBy]);
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedTranslations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTranslations = filteredAndSortedTranslations.slice(startIndex, endIndex);
  
  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, itemsPerPage]);
  
  const handleDelete = async (id: string) => {
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

  const handleContextUpdate = (id: string, newContext: string) => {
    setTranslations(prev => 
      prev.map(t => 
        t.id === id ? { ...t, context: newContext } : t
      )
    );
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

  // Helper: skeleton rows
  const SkeletonRows = () => (
    <>
      {[...Array(5)].map((_, idx) => (
        <TableRow key={idx}>
          <TableCell><Skeleton className="h-4 w-36" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-64" /></TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

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
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="english">A-Z (EN)</SelectItem>
                    <SelectItem value="ibono">A-Z (IB)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">English</TableHead>
                      <TableHead className="w-[200px]">Ibọnọ</TableHead>
                      <TableHead className="w-[300px]">Context</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SkeletonRows />
                  </TableBody>
                </Table>
                <div className="p-4 text-center text-muted-foreground animate-pulse">Loading translations...</div>
              </div>
            ) : filteredAndSortedTranslations.length > 0 ? (
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">English</TableHead>
                        <TableHead className="w-[200px]">Ibọnọ</TableHead>
                        <TableHead className="w-[300px]">Context</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTranslations.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.english}</TableCell>
                          <TableCell>{item.ibono}</TableCell>
                          <TableCell>
                            <EditableContext
                              id={item.id}
                              context={item.context}
                              onUpdate={handleContextUpdate}
                            />
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 outline-none focus-visible:ring-2 focus-visible:ring-ibonai-green"
                              tabIndex={0}
                              aria-label="Delete entry"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedTranslations.length)} of {filteredAndSortedTranslations.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {searchTerm ? "No translations found matching your search." : "No translations added yet. Start by adding some translations using the form above."}
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
