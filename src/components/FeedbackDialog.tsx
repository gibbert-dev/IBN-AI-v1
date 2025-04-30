import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";

const FeedbackDialog = () => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({ title: "Feedback required", description: "Please enter your feedback.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    // Here you could send feedback to an API or service
    setTimeout(() => {
      setSubmitting(false);
      setFeedback("");
      setOpen(false);
      toast({ title: "Thank you!", description: "Your feedback has been submitted." });
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">Feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>Let us know your suggestions or report an issue.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Your feedback..."
            rows={4}
            className="w-full"
            disabled={submitting}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
