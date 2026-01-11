import { useState, useRef } from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Privacy from "@/components/Privacy";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import ImageProcessor from "@/components/ImageProcessor";
import { ImageData } from "@/lib/imageUtils";

const Index = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleStartClick = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageLoad = (data: ImageData) => {
    setImageData(data);
  };

  const handleReset = () => {
    if (imageData?.url) {
      URL.revokeObjectURL(imageData.url);
    }
    setImageData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero onStartClick={handleStartClick} />

      {/* How It Works */}
      <HowItWorks />

      {/* Editor Section */}
      <section ref={editorRef} className="py-24 px-4 bg-card" id="editor">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {imageData ? 'Edit your image' : 'Start editing'}
            </h2>
            {!imageData && (
              <p className="text-muted-foreground">
                Drop an image below to get started
              </p>
            )}
          </div>

          {imageData ? (
            <ImageProcessor imageData={imageData} onReset={handleReset} />
          ) : (
            <ImageUploader onImageLoad={handleImageLoad} />
          )}
        </div>
      </section>

      {/* Privacy Section */}
      <Privacy />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
