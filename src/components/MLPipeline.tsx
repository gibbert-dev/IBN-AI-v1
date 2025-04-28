
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MLPipeline = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ML Pipeline Overview</CardTitle>
        <CardDescription>
          How your translations become an AI model
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <PipelineStep 
            number={1}
            title="Data Collection"
            description="Collect English-Ibọnọ translation pairs using the form"
          />
          <div className="hidden md:block text-gray-400">→</div>
          <div className="block md:hidden text-gray-400">↓</div>
          
          <PipelineStep 
            number={2}
            title="Data Export"
            description="Export dataset as JSON/CSV for preprocessing"
          />
          <div className="hidden md:block text-gray-400">→</div>
          <div className="block md:hidden text-gray-400">↓</div>
          
          <PipelineStep 
            number={3}
            title="Model Training"
            description="Train translation model using Hugging Face"
          />
          <div className="hidden md:block text-gray-400">→</div>
          <div className="block md:hidden text-gray-400">↓</div>
          
          <PipelineStep 
            number={4}
            title="Deployment"
            description="Deploy the trained model for translation"
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface PipelineStepProps {
  number: number;
  title: string;
  description: string;
}

const PipelineStep = ({ number, title, description }: PipelineStepProps) => {
  return (
    <div className="flex flex-col items-center text-center max-w-[200px]">
      <div className="w-10 h-10 rounded-full bg-ibonai-green text-white flex items-center justify-center font-bold mb-2">
        {number}
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default MLPipeline;
