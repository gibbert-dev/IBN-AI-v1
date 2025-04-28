import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const IbenoInfo = () => {
  const [activeTab, setActiveTab] = useState("about");

  const culturalFacts = [
    { id: "1", title: "Rich Maritime Heritage", content: "Ibeno is known for its rich fishing tradition and maritime culture, with generations of skilled fishermen contributing to its economy." },
    { id: "2", title: "Beautiful Beaches", content: "Home to one of the longest sand beaches in West Africa, Ibeno Beach stretches over 45km along the Atlantic coast." },
    { id: "3", title: "Local Festivals", content: "The community celebrates various cultural festivals throughout the year, showcasing traditional dances and ceremonies." },
    { id: "4", title: "Traditional Cuisine", content: "Ibeno is famous for its fresh seafood dishes and traditional cooking methods passed down through generations." }
  ];

  return (
    <Card className="w-full mt-8 shadow-lg border border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold tracking-tight">Discover Ibeno</CardTitle>
        <CardDescription className="text-white/90 text-base">
          Explore the culture, history, and beauty of Ibeno
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 bg-white rounded-b-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-blue-50 rounded-lg mb-2">
            <TabsTrigger value="about" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900 transition-colors">About</TabsTrigger>
            <TabsTrigger value="culture" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900 transition-colors">Culture</TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900 transition-colors">Gallery</TabsTrigger>
            <TabsTrigger value="facts" className="data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900 transition-colors">Fun Facts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="mt-4">
            <div className="prose max-w-none text-gray-700 text-base leading-relaxed">
              <p>Ibeno is a coastal Local Government Area in Akwa Ibom State, Nigeria, known for its beautiful beaches, rich fishing heritage, and vibrant culture. Located along the Atlantic coast, it serves as home to diverse communities and plays a significant role in Nigeria's maritime economy.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="culture" className="mt-4">
            <Accordion type="single" collapsible>
              {culturalFacts.map((fact) => (
                <AccordionItem key={fact.id} value={fact.id} className="border-b last:border-b-0">
                  <AccordionTrigger className="font-semibold text-blue-800 hover:bg-blue-50 transition-colors px-2 py-2 rounded-md">{fact.title}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 bg-blue-50 rounded-md px-4 py-2 mb-2">{fact.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1,2,3].map((i) => (
                <div key={i} className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border border-blue-200 shadow-inner">
                  <span className="text-sm text-blue-700 font-medium">Image Placeholder</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="facts" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold mb-2 text-blue-800">Did You Know?</h3>
                <p className="text-gray-700">Ibeno Beach is one of the longest sand beaches in West Africa!</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold mb-2 text-blue-800">Geography</h3>
                <p className="text-gray-700">Ibeno is located in the coastal southern part of Akwa Ibom State, bordered by the Atlantic Ocean.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IbenoInfo;