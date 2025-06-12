import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "@/utils/syncService";
import { Search, Filter, X, Download } from "lucide-react";
import { Translation } from "@/utils/databaseUtils";
import { LocalTranslation } from "@/utils/indexedDbService";

interface SearchFilters {
  searchTerm: string;
  minLength: number;
  maxLength: number;
  dateFrom: string;
  dateTo: string;
  hasSpecialChars: boolean;
}

const AdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    minLength: 0,
    maxLength: 1000,
    dateFrom: "",
    dateTo: "",
    hasSpecialChars: false
  });
  const [results, setResults] = useState<(Translation | LocalTranslation)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const allTranslations = await getTranslations();
      
      let filtered = allTranslations.filter(translation => {
        // Text search
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          const englishMatch = translation.english.toLowerCase().includes(searchLower);
          const ibonoMatch = translation.ibono.toLowerCase().includes(searchLower);
          if (!englishMatch && !ibonoMatch) return false;
        }
        
        // Length filters
        const ibonoLength = translation.ibono.length;
        if (ibonoLength < filters.minLength || ibonoLength > filters.maxLength) {
          return false;
        }
        
        // Date filters
        if (filters.dateFrom && translation.created_at) {
          const createdDate = new Date(translation.created_at);
          const fromDate = new Date(filters.dateFrom);
          if (createdDate < fromDate) return false;
        }
        
        if (filters.dateTo && translation.created_at) {
          const createdDate = new Date(translation.created_at);
          const toDate = new Date(filters.dateTo);
          if (createdDate > toDate) return false;
        }
        
        // Special characters filter
        if (filters.hasSpecialChars) {
          const specialChars = /[ọịǝn̄]/;
          if (!specialChars.test(translation.ibono)) return false;
        }
        
        return true;
      });
      
      setResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      minLength: 0,
      maxLength: 1000,
      dateFrom: "",
      dateTo: "",
      hasSpecialChars: false
    });
    setResults([]);
  };

  const exportResults = () => {
    if (results.length === 0) return;
    
    const csv = [
      "English,Ibọnọ,Created At",
      ...results.map(r => `"${r.english}","${r.ibono}","${r.created_at || ''}"`)
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "search_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-ibonai-blue" />
          Advanced Search
        </CardTitle>
        <CardDescription>
          Search and filter through the translation dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search in English or Ibọnọ..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Min Length</label>
                <Input
                  type="number"
                  value={filters.minLength}
                  onChange={(e) => setFilters(prev => ({ ...prev, minLength: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Max Length</label>
                <Input
                  type="number"
                  value={filters.maxLength}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxLength: parseInt(e.target.value) || 1000 }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date From</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date To</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="specialChars"
                checked={filters.hasSpecialChars}
                onChange={(e) => setFilters(prev => ({ ...prev, hasSpecialChars: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="specialChars" className="text-sm">
                Contains special Ibọnọ characters (ọ, ị, ǝ, n̄)
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{results.length} results found</Badge>
              </div>
              <Button onClick={exportResults} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Results
              </Button>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-3 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm font-medium text-gray-600">English</div>
                      <div className="text-sm">{result.english}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Ibọnọ</div>
                      <div className="text-sm">{result.ibono}</div>
                    </div>
                  </div>
                  {result.created_at && (
                    <div className="text-xs text-gray-500 mt-2">
                      Created: {new Date(result.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {results.length === 0 && filters.searchTerm && !isSearching && (
          <div className="text-center py-8 text-muted-foreground">
            No translations found matching your search criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;