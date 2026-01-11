import { useCallback, useState, memo } from "react";
import { Upload, Image as ImageIcon, Images } from "lucide-react";
import { loadImages, ImageData } from "@/lib/imageUtils";

interface ImageUploaderProps {
  onImagesLoad: (images: ImageData[]) => void;
}

const ImageUploader = memo(({ onImagesLoad }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 0 });

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) return;
    
    setIsLoading(true);
    setLoadProgress({ loaded: 0, total: imageFiles.length });
    
    try {
      const images = await loadImages(imageFiles, (loaded, total) => {
        setLoadProgress({ loaded, total });
      });
      
      if (images.length > 0) {
        onImagesLoad(images);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setIsLoading(false);
      setLoadProgress({ loaded: 0, total: 0 });
    }
  }, [onImagesLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset input to allow selecting same files again
    e.target.value = '';
  }, [handleFiles]);

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
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center animate-pulse">
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground font-medium mb-1">
              Loading images...
            </p>
            <p className="text-muted-foreground text-sm">
              {loadProgress.loaded} of {loadProgress.total} loaded
            </p>
          </div>
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
              Drop your images here
            </p>
            <p className="text-muted-foreground text-sm mb-3">
              or click to browse • JPG, PNG, WebP supported
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-accent">
              <Images className="w-4 h-4" />
              <span>Batch processing supported</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;
