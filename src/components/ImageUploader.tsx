import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { loadImage, ImageData } from "@/lib/imageUtils";

interface ImageUploaderProps {
  onImageLoad: (imageData: ImageData) => void;
}

const ImageUploader = ({ onImageLoad }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const imageData = await loadImage(file);
      onImageLoad(imageData);
    } catch (error) {
      console.error('Failed to load image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onImageLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      className={`drop-zone relative w-full max-w-2xl mx-auto p-12 sm:p-16 text-center cursor-pointer transition-all duration-200 ${
        isDragging ? 'drop-zone-active scale-[1.02]' : 'hover:border-muted-foreground/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center animate-pulse">
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Loading image...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-accent/20' : 'bg-secondary'
          }`}>
            <Upload className={`w-7 h-7 transition-colors ${
              isDragging ? 'text-accent' : 'text-muted-foreground'
            }`} />
          </div>
          <div>
            <p className="text-foreground font-medium mb-1">
              Drop your image here
            </p>
            <p className="text-muted-foreground text-sm">
              or click to browse • JPG, PNG, WebP supported
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
