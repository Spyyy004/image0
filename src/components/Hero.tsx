import { Button } from "@/components/ui/button";
import { Shield, Zap, Lock } from "lucide-react";

interface HeroProps {
  onStartClick: () => void;
}

const Hero = ({ onStartClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-in">
        {/* Logo/Brand */}
        <div className="mb-8">
          <span className="font-mono text-sm text-muted-foreground tracking-wider">
            image0.dev
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
          Professional Image Tools.
          <br />
          <span className="text-muted-foreground">100% In-Browser. Zero Uploads.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
          Resize, compress, and convert images directly on your device.
          <br className="hidden sm:block" />
          Your files never leave your browser.
        </p>

        {/* CTA */}
        <Button 
          variant="hero" 
          size="xl" 
          onClick={onStartClick}
          className="mb-8"
        >
          Start Editing Images
        </Button>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            <span>No uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span>No tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span>No account required</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-2.5 bg-muted-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
