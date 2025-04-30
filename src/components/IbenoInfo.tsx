import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
const IbenoInfo = () => {
  const isMobile = useIsMobile();
  return <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient mb-4">
          About the Ibọnọ Language
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
          Ibọnọ is a Nigerian language spoken by the Ibeno people, an Obolo dialect continuum of Akwa Ibom State.
          It is an endangered language that needs documentation and preservation efforts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Characteristics</CardTitle>
            <CardDescription>Key features of the Ibọnọ language</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li>Niger-Congo language family</li>
              <li>Tonal system with high, mid, and low tones</li>
              <li>Subject-Verb-Object (SVO) word order</li>
              <li>Rich noun class system</li>
              <li>Extensive use of prefixes and suffixes</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-center sm:justify-start gap-2 sm:gap-3 pt-4">
            <Button variant="outline" size={isMobile ? "sm" : "default"} className="min-w-20 sm:min-w-24 text-xs sm:text-sm font-medium">
              Learn More
            </Button>
            <Button size={isMobile ? "sm" : "default"} className="min-w-20 sm:min-w-24 text-xs sm:text-sm font-medium bg-ibonai-green hover:bg-ibonai-green/90">
              Resources
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cultural Significance</CardTitle>
            <CardDescription>Why the Ibọnọ language matters</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li>Core part of Ibeno cultural identity</li>
              <li>Contains unique expressions and idioms</li>
              <li>Preserves indigenous knowledge systems</li>
              <li>Connects to ancestral traditions</li>
              <li>Important for community cohesion</li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-center sm:justify-start gap-2 sm:gap-3 pt-4">
            <Button variant="outline" size={isMobile ? "sm" : "default"} className="min-w-20 sm:min-w-24 text-xs sm:text-sm font-medium">
              Culture
            </Button>
            <Button size={isMobile ? "sm" : "default"} className="min-w-20 sm:min-w-24 text-xs sm:text-sm font-medium bg-ibonai-blue hover:bg-ibonai-blue/90">
              Community
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        
        
        
      </div>
    </div>;
};
export default IbenoInfo;