import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatasetViewer from "@/components/DatasetViewer";
import TranslationDemo from "@/components/TranslationDemo";
import MLPipeline from "@/components/MLPipeline";
import AdvancedSearch from "@/components/AdvancedSearch";
import QualityChecker from "@/components/QualityChecker";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Mobile nav bar for /management
const ManagementMobileNav = ({ current, onTab }) => (
  <nav
    className="md:hidden fixed bottom-0 left-0 z-30 w-full bg-white border-t border-gray-200 dark:bg-gray-900 flex justify-around py-2 shadow-lg"
    aria-label="Management Navigation"
    role="tablist"
  >
    {[
      { key: "dataset", label: "Dataset" },
      { key: "search", label: "Search" },
      { key: "quality", label: "Quality" },
      { key: "pipeline", label: "ML" }
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => onTab(tab.key)}
        tabIndex={0}
        aria-selected={current === tab.key}
        className={
          `flex-1 px-2 py-1 text-xs flex flex-col items-center
          ${current === tab.key
            ? 'text-blue-600 font-bold border-b-2 border-blue-600'
            : 'text-gray-600 dark:text-gray-300'}`
        }
        role="tab"
        aria-label={tab.label}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

// Generic skeleton loader (used as loading fallback)
function TabLoadingSkeleton({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[200px] animate-pulse">
      <Loader2 className="h-7 w-7 mr-2 text-blue-500 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

// Error fallback for tabs
function TabError({ error }: { error: any }) {
  return (
    <div className="p-6 bg-red-50 rounded-lg text-red-800 text-center">
      <div className="font-bold text-lg mb-2">Something went wrong:</div>
      <div className="text-xs break-words">{error?.message || error?.toString() || "Unknown error"}</div>
    </div>
  );
}

const TABS_META = [
  { key: "dataset", label: "Dataset", short: "1", render: () => <><TranslationDemo /><div className="mt-6"><DatasetViewer /></div></> },
  { key: "search", label: "Search", short: "2", render: () => <AdvancedSearch /> },
  { key: "quality", label: "Quality", short: "3", render: () => <QualityChecker /> },
  { key: "pipeline", label: "ML", short: "4", render: () => <MLPipeline /> },
];

const ManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dataset");
  const tabRefs = useRef<{[key:string]: HTMLButtonElement | null}>({});

  // Keyboard shortcuts: 1/2/3/4 => switch tabs
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["1", "2", "3", "4"].includes(e.key)) {
        setActiveTab(TABS_META[parseInt(e.key, 10) - 1].key);
        // focus button (ARIA+keyboard UX)
        tabRefs.current[TABS_META[parseInt(e.key, 10) - 1].key]?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Keep Keyboard and Mobile Navigation in sync
  const handleTabChange = (val: string) => setActiveTab(val);

  // Responsive layout and ARIA support
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      p-0 md:px-2">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mt-6 mb-4 px-2 sm:px-0 flex items-center justify-between">
        <h1
          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
          tabIndex={0}
          aria-label="Dataset and AI Management"
        >
          Dataset & AI Management
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="text-blue-700 border-blue-600 dark:text-blue-200 dark:border-blue-400"
          aria-label="Back to Home"
        >
          Back to Home
        </Button>
      </div>

      {/* Desktop tabs */}
      <div className="hidden md:block flex-1 w-full max-w-6xl mx-auto pb-14">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full" aria-label="Management Tabs">
          <TabsList
            className="mb-4 bg-blue-100/50 dark:bg-blue-900/30 grid grid-cols-4 w-full"
            role="tablist"
            aria-label="Management Tab List"
          >
            {TABS_META.map((tab, idx) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-teal-500 data-[state=active]:text-white focus-visible:outline focus-visible:outline-2"
                tabIndex={0}
                ref={el => (tabRefs.current[tab.key] = el)}
                aria-label={tab.label}
                aria-selected={activeTab === tab.key}
                aria-controls={tab.key + "-panel"}
                role="tab"
              >
                {tab.label}
                <span className="ml-1 opacity-60 text-[10px]">[{tab.short}]</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Content with ErrorBoundary+Loading fallback */}
          {TABS_META.map(tab => (
            <TabsContent
              key={tab.key}
              value={tab.key}
              id={tab.key + "-panel"}
              aria-labelledby={tab.key}
              role="tabpanel"
              tabIndex={0}
            >
              <ErrorBoundary fallback={<TabError error="Could not load section." />}>
                <React.Suspense fallback={<TabLoadingSkeleton label={`Loading ${tab.label}...`} />}>
                  {tab.render()}
                </React.Suspense>
              </ErrorBoundary>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="block md:hidden pt-2 pb-20">
        {/* Tabs fake: use One Panel with only activeTab rendered for speed + a11y */}
        <div className="max-w-3xl mx-auto">
          <ErrorBoundary fallback={<TabError error="Could not load section." />}>
            <React.Suspense fallback={<TabLoadingSkeleton label={`Loading ${TABS_META.find(t=>t.key===activeTab)?.label ?? ""}...`} />}>
              {TABS_META.find(tab => tab.key === activeTab)?.render()}
            </React.Suspense>
          </ErrorBoundary>
        </div>
        <ManagementMobileNav current={activeTab} onTab={handleTabChange} />
      </div>
    </div>
  );
};

export default ManagementPage;
