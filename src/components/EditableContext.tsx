
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Edit3, Check, X } from "lucide-react";
import { updateTranslation } from "@/utils/databaseUtils";

interface EditableContextProps {
  id: string;
  context?: string;
  onUpdate: (id: string, newContext: string) => void;
}

const EditableContext = ({ id, context, onUpdate }: EditableContextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(context || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      await updateTranslation(id, { context: editValue.trim() || undefined });
      onUpdate(id, editValue.trim());
      setIsEditing(false);
      
      toast({
        title: "Context updated",
        description: "The context has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating context:", error);
      toast({
        title: "Error",
        description: "Failed to update context. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(context || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder="Add context or definition..."
          rows={2}
          className="text-sm"
        />
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving}
            className="h-6 px-2"
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-6 px-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-2">
      <div className="flex-1">
        {context?.trim() ? (
          <span className="text-sm">{context}</span>
        ) : (
          <span className="text-muted-foreground text-xs italic">No context</span>
        )}
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default EditableContext;
