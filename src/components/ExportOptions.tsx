import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "@/utils/syncService";
import { Download, FileText, Database, Code, Settings } from "lucide-react";
import { Translation } from "@/utils/databaseUtils";
import { LocalTranslation } from "@/utils/indexedDbService";

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  extension: string;
  icon: React.ReactNode;
}

const ExportOptions = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportCount, setExportCount] = useState(0);

  const exportFormats: ExportFormat[] = [
    {
      id: 'csv',
      name: 'CSV',
      description: 'Comma-separated values for spreadsheet applications',
      extension: 'csv',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'JavaScript Object Notation for web applications',
      extension: 'json',
      icon: <Code className="h-4 w-4" />
    },
    {
      id: 'jsonl',
      name: 'JSONL',
      description: 'JSON Lines format for machine learning training',
      extension: 'jsonl',
      icon: <Database className="h-4 w-4" />
    },
    {
      id: 'tsv',
      name: 'TSV',
      description: 'Tab-separated values for data processing',
      extension: 'tsv',
      icon: <FileText className="h-4 w-4" />
    }
  ];

  const loadExportCount = async () => {
    try {
      const translations = await getTranslations();
      setExportCount(translations.length);
    } catch (error) {
      console.error("Error loading export count:", error);
    }
  };

  useState(() => {
    loadExportCount();
  });

  const exportData = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      const translations = await getTranslations();
      
      if (translations.length === 0) {
        alert("No translations to export");
        return;
      }

      let content = '';
      let mimeType = 'text/plain';
      
      switch (format.id) {
        case 'csv':
          content = generateCSV(translations);
          mimeType = 'text/csv';
          break;
        case 'json':
          content = generateJSON(translations);
          mimeType = 'application/json';
          break;
        case 'jsonl':
          content = generateJSONL(translations);
          mimeType = 'application/jsonl';
          break;
        case 'tsv':
          content = generateTSV(translations);
          mimeType = 'text/tab-separated-values';
          break;
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ibono_translations.${format.extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = (translations: (Translation | LocalTranslation)[]): string => {
    const headers = ['id', 'english', 'ibono', 'created_at'];
    const rows = translations.map(t => [
      t.id || '',
      `"${t.english.replace(/"/g, '""')}"`,
      `"${t.ibono.replace(/"/g, '""')}"`,
      t.created_at || ''
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const generateJSON = (translations: (Translation | LocalTranslation)[]): string => {
    const data = translations.map(t => ({
      id: t.id,
      english: t.english,
      ibono: t.ibono,
      created_at: t.created_at
    }));
    
    return JSON.stringify(data, null, 2);
  };

  const generateJSONL = (translations: (Translation | LocalTranslation)[]): string => {
    return translations.map(t => JSON.stringify({
      id: t.id,
      english: t.english,
      ibono: t.ibono,
      created_at: t.created_at
    })).join('\n');
  };

  const generateTSV = (translations: (Translation | LocalTranslation)[]): string => {
    const headers = ['id', 'english', 'ibono', 'created_at'];
    const rows = translations.map(t => [
      t.id || '',
      t.english.replace(/\t/g, ' '),
      t.ibono.replace(/\t/g, ' '),
      t.created_at || ''
    ]);
    
    return [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-ibonai-blue" />
          Export Options
        </CardTitle>
        <CardDescription>
          Export your translation dataset in various formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Stats */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <div className="text-sm font-medium">Ready to Export</div>
            <div className="text-2xl font-bold text-ibonai-green">{exportCount}</div>
            <div className="text-xs text-muted-foreground">translations</div>
          </div>
          <Button onClick={loadExportCount} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>

        {/* Export Formats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map((format) => (
            <div key={format.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                {format.icon}
                <span className="font-medium">{format.name}</span>
                <Badge variant="secondary">.{format.extension}</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {format.description}
              </p>
              
              <Button 
                onClick={() => exportData(format)}
                disabled={isExporting || exportCount === 0}
                className="w-full"
                variant="outline"
              >
                {isExporting ? "Exporting..." : `Export as ${format.name}`}
              </Button>
            </div>
          ))}
        </div>

        {/* Export Guidelines */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Export Guidelines</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• CSV format is best for spreadsheet applications like Excel</li>
            <li>• JSON format is ideal for web applications and APIs</li>
            <li>• JSONL format is optimized for machine learning training</li>
            <li>• TSV format is useful for data processing tools</li>
            <li>• All exports include ID, English text, Ibọnọ text, and creation date</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;