import { memo } from "react";
import { ImageData, formatBytes } from "@/lib/imageUtils";
import { Check, X } from "lucide-react";

interface ImageThumbnailProps {
  image: ImageData;
  isSelected: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

const ImageThumbnail = memo(({ 
  image, 
  isSelected, 
  onToggle, 
  onRemove 
}: ImageThumbnailProps) => {
  return (
    <div 
      className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
        isSelected 
          ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' 
          : 'ring-1 ring-border hover:ring-muted-foreground'
      }`}
      onClick={onToggle}
    >
      <img
        src={image.url}
        alt={image.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Selection overlay */}
      <div className={`absolute inset-0 transition-colors ${
        isSelected ? 'bg-accent/20' : 'bg-transparent group-hover:bg-black/20'
      }`} />
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <Check className="w-3 h-3 text-accent-foreground" />
        </div>
      )}
      
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
      >
        <X className="w-3 h-3 text-destructive-foreground" />
      </button>
      
      {/* Image info tooltip on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white truncate">{image.name}</p>
        <p className="text-[9px] text-white/70">{formatBytes(image.size)}</p>
      </div>
    </div>
  );
});

ImageThumbnail.displayName = 'ImageThumbnail';

export default ImageThumbnail;
