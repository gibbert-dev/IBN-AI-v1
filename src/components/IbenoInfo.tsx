import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const IbenoInfo = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const sections = [
    {
      id: "background",
      title: "Background",
      content: `The Ibeno people are primarily located in Ibeno Local Government Area (LGA) of Akwa Ibom State, Nigeria, a coastal region known for fishing and oil activities. The Obolo people, also called Andoni or Doni, are a multi-ethnic group found in Rivers State, Akwa Ibom State, and other nearby states, occupying the Cross River Basin in the Niger Delta.`
    },
    {
      id: "connection",
      title: "Connection to Obolo",
      content: `The Ibeno people are part of the Obolo ethnic group, particularly in Akwa Ibom State. This is supported by shared language, Ibọnọ (also known as Obolo or Ibono-Obolo), and historical interactions. Sources confirm that the Obolo ethnic group comprises both Ibono (Ibeno) and Eastern Obolo, highlighting their shared identity.`
    }
  ];

  const linguisticInfo = [
    {
      id: "classification",
      title: "Language Classification",
      content: `Ibọnọ (pronounced [ee-boh-naw]), also known as Obolo, is a distinct language spoken by the Ibeno and Eastern Obolo people. Linguistic studies, including those by Kay Williamson (1987), categorize it within the Lower Cross branch of the Cross River group, highlighting its unique linguistic structure and relation to neighboring languages.`
    },
    {
      id: "dialects",
      title: "Dialects and Relationships",
      content: `The Iko dialect in Eastern Obolo is closely related to the Okoroutip dialect in Ibeno LGA. While Ibọnọ has adopted some terms from neighboring languages like Ibibio and Efik, it maintains its distinct linguistic structure, grammar, and core vocabulary as an independent language.`
    }
  ];

  const culturalAspects = [
    {
      id: "traditions",
      title: "Traditional Practices",
      content: `The Ibeno people maintain rich cultural traditions including the Ekpe society, traditional governance systems, and maritime customs. These practices have been preserved through generations and continue to play vital roles in community life.`
    },
    {
      id: "institutions",
      title: "Cultural Institutions",
      content: `Traditional institutions like Ekpe, Obon, and Uke are integral to Ibeno culture and are also recognized in broader Obolo culture. These institutions help preserve and transmit cultural knowledge and values across generations.`
    }
  ];

  const historicalContext = [
    {
      id: "migration",
      title: "Historical Migration",
      content: `Both the Ibeno and Obolo people migrated from areas around the Cross River basin centuries ago, settling along the Atlantic coastline. This migration was part of a broader movement in the Niger Delta region, involving interactions with groups like Bonny, Okrika, Kalabari, and Nkoro.`
    },
    {
      id: "development",
      title: "Cultural Development",
      content: `The Ibeno people developed their distinct identity while maintaining strong cultural and linguistic ties with the broader Obolo community. Their strategic coastal location made them important players in maritime trade and cultural exchange.`
    }
  ];

  return (
    <Card className="w-full mt-8 shadow-lg border border-border">
      <CardHeader className="bg-gradient-header text-white rounded-t-lg p-6">
        <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">The Ibeno People</CardTitle>
        <CardDescription className="text-white/90 text-base md:text-lg">
          A comprehensive exploration of Ibeno heritage, language, and identity
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[600px] pr-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted rounded-lg mb-4 sticky top-0">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-brand data-[state=active]:text-white transition-all"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="language" 
                className="data-[state=active]:bg-gradient-brand data-[state=active]:text-white transition-all"
              >
                Language
              </TabsTrigger>
              <TabsTrigger 
                value="culture" 
                className="data-[state=active]:bg-gradient-brand data-[state=active]:text-white transition-all"
              >
                Culture
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-gradient-brand data-[state=active]:text-white transition-all"
              >
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4 space-y-6">
              {sections.map((section) => (
                <div key={section.id} className="p-6 bg-gradient-card rounded-lg border border-border hover:shadow-md transition-all">
                  <h3 className="font-semibold mb-3 text-primary text-xl">{section.title}</h3>
                  <p className="text-foreground/80 leading-relaxed">{section.content}</p>
                </div>
              ))}
              <div className="p-6 bg-gradient-card rounded-lg border border-border">
                <h3 className="font-semibold mb-3 text-primary text-xl">Classification Complexity</h3>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  While some sources group Ibeno with Ibibio, Annang, Ekid, and Oron due to shared cultural elements, evidence strongly supports their classification as part of the Obolo ethnic group, particularly in Akwa Ibom State context.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  This complexity reflects the fluid nature of ethnic identities in Nigeria, where groups can be classified differently based on various cultural, linguistic, and administrative criteria.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="language" className="mt-4">
              <div className="space-y-6">
                {linguisticInfo.map((info) => (
                  <div key={info.id} className="p-6 bg-gradient-card rounded-lg border border-border">
                    <h3 className="font-semibold mb-3 text-primary text-xl">{info.title}</h3>
                    <p className="text-foreground/80 leading-relaxed">{info.content}</p>
                  </div>
                ))}
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="influence" className="bg-gradient-card rounded-lg border border-border">
                    <AccordionTrigger className="px-6 hover:bg-accent/5">
                      <span className="text-primary font-semibold">Language Evolution & Influence</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <p className="text-foreground/80 leading-relaxed">
                        Just as English incorporates loanwords from French, Latin, and Italian, Ibọnọ has adopted certain words from neighboring languages. However, these borrowings don't diminish its status as an independent language with its own distinct structure and core vocabulary.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="culture" className="mt-4">
              <div className="space-y-6">
                {culturalAspects.map((aspect) => (
                  <div key={aspect.id} className="p-6 bg-gradient-card rounded-lg border border-border">
                    <h3 className="font-semibold mb-3 text-primary text-xl">{aspect.title}</h3>
                    <p className="text-foreground/80 leading-relaxed">{aspect.content}</p>
                  </div>
                ))}
                <div className="p-6 bg-gradient-card rounded-lg border border-border">
                  <h3 className="font-semibold mb-3 text-primary text-xl">Maritime Heritage</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    The coastal location has profoundly shaped Ibeno culture, with fishing and maritime activities being central to both economy and cultural identity. This maritime heritage is reflected in traditions, celebrations, and daily life.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <div className="space-y-6">
                {historicalContext.map((context) => (
                  <div key={context.id} className="p-6 bg-gradient-card rounded-lg border border-border">
                    <h3 className="font-semibold mb-3 text-primary text-xl">{context.title}</h3>
                    <p className="text-foreground/80 leading-relaxed">{context.content}</p>
                  </div>
                ))}
                <div className="p-6 bg-gradient-card rounded-lg border border-border">
                  <h3 className="font-semibold mb-3 text-primary text-xl">Administrative Context</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    While Ibeno and Eastern Obolo are separate Local Government Areas, they share deep ethnic and cultural connections. The administrative boundaries don't fully reflect the broader ethnic ties that bind these communities together under the Obolo identity.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const App = () => {
  return (
    <div className="w-full max-w-none px-4 md:px-6 lg:px-8">
      <IbenoInfo />
    </div>
  );
};

export default App;