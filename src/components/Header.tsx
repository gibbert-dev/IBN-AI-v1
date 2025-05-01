import { useIsMobile } from "@/hooks/use-mobile";
import { Book, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import FeedbackDialog from "./FeedbackDialog";
interface HeaderProps {
  onSidebarToggle: () => void;
}
const Header = ({
  onSidebarToggle
}: HeaderProps) => {
  const isMobile = useIsMobile();
  return <header className="bg-gradient-to-r from-blue-600 via-teal-500 to-blue-400 text-white py-4 sm:py-5 px-5 sm:px-8 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button onClick={onSidebarToggle} className="p-2 sm:p-2.5 hover:bg-white/15 rounded-md transition-colors duration-200" aria-label="Toggle Sidebar">
            <Menu size={isMobile ? 22 : 24} className="opacity-95" />
          </button>
          
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            <img src={import.meta.env.BASE_URL + 'logo.png'} alt="IBN-AI Logo" className="h-10 w-10 sm:h-14 sm:w-14 object-contain filter drop-shadow-lg" loading="eager" draggable="false" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">IBN-AI</h1>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-3 sm:space-x-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size={isMobile ? "sm" : "default"} className="text-white hover:bg-white/15 transition-colors duration-200">
                <Book className="mr-2" size={isMobile ? 18 : 20} />
                <span className="hidden sm:inline text-base">About Ibeno</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-ibonai-blue">Ibọnọ Language and the Ibeno People</DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm">
                  A comprehensive overview of language and ethnicity
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-6 text-sm sm:text-base">
                <section>
                  <h3 className="font-bold text-lg text-ibonai-green mb-2">Key Points</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Research suggests the Ibeno people are part of the Obolo ethnic group, sharing language and ancestry.</li>
                    <li>Their native language, Ibọnọ, is also known as Obolo, central to their cultural identity.</li>
                    <li>There is some debate, with some sources grouping Ibeno with Ibibio, but evidence leans toward Obolo classification.</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="font-bold text-lg text-ibonai-green mb-2">Background</h3>
                  <p>The Ibeno people are primarily located in Ibeno Local Government Area (LGA) of Akwa Ibom State, Nigeria, a coastal region known for fishing and oil activities. The Obolo people, also called Andoni or Doni, are a multi-ethnic group found in Rivers State, Akwa Ibom State, and other nearby states, occupying the Cross River Basin in the Niger Delta.</p>
                </section>
                
                <section>
                  <h3 className="font-bold text-lg text-ibonai-green mb-2">Connection to Obolo</h3>
                  <p>It seems likely that the Ibeno people are part of the Obolo ethnic group, particularly in Akwa Ibom State. This is supported by shared language, Ibọnọ (also known as Obolo or Ibono-Obolo), and historical interactions. Sources like the Niger Delta Budget Monitoring Group list Ibono (Ibeno) and Eastern Obolo as part of the Obolo, indicating a strong ethnic linkage.</p>
                </section>
                
                <section>
                  <h3 className="font-bold text-lg text-ibonai-green mb-2">Cultural and Linguistic Ties</h3>
                  <p>The Ibọnọ language is classified as a Lower Cross River language, part of the Niger-Congo family, and is closely related to dialects spoken by Eastern Obolo, suggesting a shared linguistic heritage. Culturally, they share traditions like the Ekpe society, reinforcing their connection to Obolo.</p>
                </section>
                
                <section>
                  <h3 className="font-bold text-lg text-ibonai-green mb-2">Controversy and Complexity</h3>
                  <p>There is some debate, as other sources, like Wikipedia, group Ibeno with Ibibio, Annang, Ekid, and Oron, sharing personal names and traditions. This reflects the fluidity of ethnic identities in Nigeria, where groups can be classified differently based on context. However, in Akwa Ibom State, the evidence leans toward Ibeno being part of Obolo.</p>
                </section>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-bold text-lg text-ibonai-blue mb-2">Detailed Analysis</h3>
                  
                  <div className="space-y-4">
                    <section>
                      <h4 className="font-semibold text-base mb-1">Linguistic Analysis</h4>
                      <p>The native language of the Ibeno people is referred to as Ibọnọ, pronounced [ee-boh-naw], and is also known by other names such as Ibono-Obolo or Obolo. This language is classified as a Lower Cross River language, part of the Niger-Congo language family, specifically within the Efik–Ibibio-Andoni group.</p>
                    </section>
                    
                    <section>
                      <h4 className="font-semibold text-base mb-1">Historical Context</h4>
                      <p>Historically, both the Ibeno and Obolo people are believed to have migrated from areas around the Cross River basin centuries ago, settling along the Atlantic coastline. This migration is part of a broader movement in the Niger Delta region.</p>
                    </section>
                    
                    <div className="overflow-x-auto mt-4">
                      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">Aspect</th>
                            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-medium">Language</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">Ibọnọ (also Obolo/Ibono-Obolo), part of Efik–Ibibio-Andoni group</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-medium">Ethnic Group</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">Ibeno part of Obolo, debated in broader Ibibio context</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-medium">Location</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">Ibeno LGA and Eastern Obolo LGA in Akwa Ibom State, coastal Niger Delta</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-medium">Historical Ties</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">Shared migration from Cross River basin, settled along Atlantic coastline</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-medium">Cultural Practices</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">Shared institutions (Ekpe, Obon), language central to heritage</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <FeedbackDialog />
        </div>
      </div>
    </header>;
};
export default Header;