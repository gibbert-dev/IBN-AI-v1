
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/AuthModal";
import { Globe, Users, Brain, Shield, Zap, Heart } from "lucide-react";

const Welcome = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: Globe,
      title: "Language Preservation",
      description: "Help preserve the beautiful Ibọnọ language for future generations through AI technology."
    },
    {
      icon: Brain,
      title: "AI-Powered Translation",
      description: "Contribute to building an advanced AI translation model for English-Ibọnọ language pairs."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a passionate community working together to preserve linguistic heritage."
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Every translation is carefully reviewed to ensure accuracy and cultural authenticity."
    },
    {
      icon: Zap,
      title: "Real-time Progress",
      description: "Track your contributions and see the collective impact of the community."
    },
    {
      icon: Heart,
      title: "Cultural Impact",
      description: "Make a meaningful difference in preserving Ibọnọ culture and traditions."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-6">
                IBN-AI
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                Preserving Ibọnọ Language Through AI
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join our mission to build the world's first comprehensive AI translation system for the Ibọnọ language. 
                Help preserve linguistic heritage while advancing technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setShowAuthModal(true)}
                  className="text-lg px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-3 border-blue-600 text-blue-700 hover:bg-blue-50"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 sm:py-24 bg-white/50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Join IBN-AI?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Be part of a groundbreaking project that combines cutting-edge AI with cultural preservation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white/80 dark:bg-gray-900/80">
                    <CardHeader>
                      <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Make History?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of contributors who are helping to preserve the Ibọnọ language and build the future of AI translation.
              </p>
              <Button 
                size="lg" 
                onClick={() => setShowAuthModal(true)}
                className="text-lg px-12 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                Start Contributing Today
              </Button>
            </div>
          </div>
        </div>

        {/* Cultural Quote */}
        <div className="bg-gradient-to-r from-blue-900 to-teal-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <blockquote className="text-xl sm:text-2xl font-light italic mb-4">
              "Courageous Hearts, Brilliant Minds, Boundless Kindness"
            </blockquote>
            <p className="text-blue-200">
              We are a people of strength, wisdom, and compassion — standing tall like the ocean that cradles our home.
            </p>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Welcome;
