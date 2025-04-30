import React from "react";
import { toast } from "@/components/ui/use-toast";

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode
}, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    toast({ title: "Unexpected Error", description: "Something went wrong. Please refresh the page.", variant: "destructive" });
    // Optionally log error to a service
  }
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen flex items-center justify-center text-center"><div><h1 className="text-2xl font-bold mb-2">Something went wrong</h1><p className="text-gray-600">Please refresh the page or try again later.</p></div></div>;
    }
    return this.props.children;
  }
}
