import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "@/utils/syncService";
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Translation } from "@/utils/databaseUtils";
import { LocalTranslation } from "@/utils/indexedDbService";

interface QualityIssue {
  id: string;
  type: 'duplicate' | 'length' | 'format' | 'encoding';
  severity: 'low' | 'medium' | 'high';
  description: string;
  translation: Translation | LocalTranslation;
  suggestion?: string;
}

const QualityChecker = () => {
  const [issues, setIssues] = useState<QualityIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    passed: 0,
    issues: 0,
    score: 0
  });

  const runQualityCheck = async () => {
    setIsChecking(true);
    try {
      const translations = await getTranslations();
      const foundIssues: QualityIssue[] = [];
      
      // Check for duplicates
      const seen = new Map<string, Translation | LocalTranslation>();
      translations.forEach((translation, index) => {
        const key = `${translation.english.toLowerCase().trim()}-${translation.ibono.toLowerCase().trim()}`;
        if (seen.has(key)) {
          foundIssues.push({
            id: `duplicate-${index}`,
            type: 'duplicate',
            severity: 'high',
            description: 'Exact duplicate translation found',
            translation,
            suggestion: 'Consider removing this duplicate entry'
          });
        } else {
          seen.set(key, translation);
        }
      });
      
      // Check for length issues
      translations.forEach((translation, index) => {
        if (translation.english.length < 3) {
          foundIssues.push({
            id: `short-english-${index}`,
            type: 'length',
            severity: 'medium',
            description: 'English text is very short',
            translation,
            suggestion: 'Consider adding more context to the English text'
          });
        }
        
        if (translation.ibono.length < 2) {
          foundIssues.push({
            id: `short-ibono-${index}`,
            type: 'length',
            severity: 'medium',
            description: 'Ibọnọ text is very short',
            translation,
            suggestion: 'Ensure the Ibọnọ translation is complete'
          });
        }
        
        if (translation.english.length > 500) {
          foundIssues.push({
            id: `long-english-${index}`,
            type: 'length',
            severity: 'low',
            description: 'English text is very long',
            translation,
            suggestion: 'Consider breaking into smaller translations'
          });
        }
      });
      
      // Check for format issues
      translations.forEach((translation, index) => {
        // Check for excessive whitespace
        if (translation.english !== translation.english.trim() || 
            translation.ibono !== translation.ibono.trim()) {
          foundIssues.push({
            id: `whitespace-${index}`,
            type: 'format',
            severity: 'low',
            description: 'Contains leading or trailing whitespace',
            translation,
            suggestion: 'Remove extra whitespace'
          });
        }
        
        // Check for multiple consecutive spaces
        if (/\s{2,}/.test(translation.english) || /\s{2,}/.test(translation.ibono)) {
          foundIssues.push({
            id: `spaces-${index}`,
            type: 'format',
            severity: 'low',
            description: 'Contains multiple consecutive spaces',
            translation,
            suggestion: 'Replace multiple spaces with single spaces'
          });
        }
        
        // Check for missing punctuation consistency
        const englishEndsWithPunct = /[.!?]$/.test(translation.english.trim());
        const ibonoEndsWithPunct = /[.!?]$/.test(translation.ibono.trim());
        
        if (englishEndsWithPunct !== ibonoEndsWithPunct) {
          foundIssues.push({
            id: `punctuation-${index}`,
            type: 'format',
            severity: 'low',
            description: 'Inconsistent punctuation between languages',
            translation,
            suggestion: 'Ensure both translations have consistent punctuation'
          });
        }
      });
      
      // Check for encoding issues
      translations.forEach((translation, index) => {
        // Check for common encoding problems
        if (translation.ibono.includes('?') && translation.ibono.includes('�')) {
          foundIssues.push({
            id: `encoding-${index}`,
            type: 'encoding',
            severity: 'high',
            description: 'Possible character encoding issue',
            translation,
            suggestion: 'Check for corrupted special characters'
          });
        }
      });
      
      setIssues(foundIssues);
      
      // Calculate quality score
      const total = translations.length;
      const issueCount = foundIssues.length;
      const passed = total - issueCount;
      const score = total > 0 ? Math.round((passed / total) * 100) : 100;
      
      setStats({
        total,
        passed,
        issues: issueCount,
        score
      });
      
    } catch (error) {
      console.error("Quality check error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const getSeverityColor = (severity: QualityIssue['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: QualityIssue['severity']) => {
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-ibonai-green" />
          Quality Checker
        </CardTitle>
        <CardDescription>
          Analyze translation quality and identify potential issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Run Check Button */}
        <Button 
          onClick={runQualityCheck} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking Quality...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Run Quality Check
            </>
          )}
        </Button>

        {/* Quality Score */}
        {stats.total > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-ibonai-green">{stats.score}%</div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.issues}</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
          </div>
        )}

        {/* Issues List */}
        {issues.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Quality Issues</h3>
              <Badge variant="secondary">{issues.length} issues found</Badge>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
              {issues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={getSeverityColor(issue.severity)}>
                        {getSeverityIcon(issue.severity)}
                      </div>
                      <span className="font-medium">{issue.description}</span>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">English:</span> {issue.translation.english}
                    </div>
                    <div>
                      <span className="font-medium">Ibọnọ:</span> {issue.translation.ibono}
                    </div>
                  </div>
                  
                  {issue.suggestion && (
                    <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      <span className="font-medium">Suggestion:</span> {issue.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Issues */}
        {stats.total > 0 && issues.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600">Excellent Quality!</h3>
            <p className="text-muted-foreground">No quality issues found in your translations.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QualityChecker;