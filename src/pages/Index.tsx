import { useState, useRef, useCallback } from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Privacy from "@/components/Privacy";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import BatchImageProcessor from "@/components/BatchImageProcessor";
import { ImageData } from "@/lib/imageUtils";

const Index = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartClick = useCallback(() => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleImagesLoad = useCallback((newImages: ImageData[]) => {
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleReset = useCallback(() => {
    // Clean up all object URLs
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
  }, [images]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const handleAddMore = useCallback(() => {
    // Trigger the file input in the uploader
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero onStartClick={handleStartClick} />

      {/* How It Works */}
      <HowItWorks />

      {/* Editor Section */}
      <section ref={editorRef} className="py-24 px-4 bg-card" id="editor">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {images.length > 0 ? 'Edit your images' : 'Start editing'}
            </h2>
            {images.length === 0 && (
              <p className="text-muted-foreground">
                Drop one or more images below to get started
              </p>
            )}
          </div>

          {images.length > 0 ? (
            <BatchImageProcessor 
              images={images} 
              onReset={handleReset}
              onAddMore={handleAddMore}
              onRemoveImage={handleRemoveImage}
            />
          ) : (
            <ImageUploader onImagesLoad={handleImagesLoad} />
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
