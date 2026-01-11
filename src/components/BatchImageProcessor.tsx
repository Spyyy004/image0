import { useState, useCallback, memo } from "react";
import { ImageData, formatBytes } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import { Maximize2, FileDown, RefreshCw, Trash2, X, Images, Plus, Trash } from "lucide-react";
import BatchResizeTool from "./BatchResizeTool";
import BatchCompressTool from "./BatchCompressTool";
import BatchConvertTool from "./BatchConvertTool";
import BatchMetadataTool from "./BatchMetadataTool";
import ImageThumbnail from "./ImageThumbnail";

interface BatchImageProcessorProps {
  images: ImageData[];
  onReset: () => void;
  onAddMore: () => void;
  onRemoveImage: (id: string) => void;
}

type Tool = 'resize' | 'compress' | 'convert' | 'metadata';

const tools: { id: Tool; label: string; icon: React.ElementType }[] = [
  { id: 'resize', label: 'Resize', icon: Maximize2 },
  { id: 'compress', label: 'Compress', icon: FileDown },
  { id: 'convert', label: 'Convert', icon: RefreshCw },
  { id: 'metadata', label: 'Strip Metadata', icon: Trash2 },
];

const BatchImageProcessor = memo(({ 
  images, 
  onReset, 
  onAddMore, 
  onRemoveImage 
}: BatchImageProcessorProps) => {
  const [activeTool, setActiveTool] = useState<Tool>('resize');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(
    new Set(images.map(img => img.id))
  );

  const toggleImageSelection = useCallback((id: string) => {
    setSelectedImages(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedImages(new Set(images.map(img => img.id)));
  }, [images]);

  const deselectAll = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  const selectedImagesList = images.filter(img => selectedImages.has(img.id));
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const selectedSize = selectedImagesList.reduce((sum, img) => sum + img.size, 0);

  const renderTool = () => {
    const props = { images: selectedImagesList };
    
    switch (activeTool) {
      case 'resize':
        return <BatchResizeTool {...props} />;
      case 'compress':
        return <BatchCompressTool {...props} />;
      case 'convert':
        return <BatchConvertTool {...props} />;
      case 'metadata':
        return <BatchMetadataTool {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Images className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {images.length} image{images.length !== 1 ? 's' : ''} loaded
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatBytes(totalSize)} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onAddMore}>
            <Plus className="w-4 h-4 mr-2" />
            Add More
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Image Grid with Selection */}
      <div className="glass-panel rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedImages.size} of {images.length} selected
            </span>
            <span className="text-sm text-muted-foreground">
              • {formatBytes(selectedSize)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={deselectAll}>
              Deselect All
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {images.map((image) => (
            <ImageThumbnail
              key={image.id}
              image={image}
              isSelected={selectedImages.has(image.id)}
              onToggle={() => toggleImageSelection(image.id)}
              onRemove={() => onRemoveImage(image.id)}
            />
          ))}
        </div>
      </div>

      {/* Tools Section */}
      <div className="glass-panel rounded-2xl p-6">
        {/* Tool tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 overflow-x-auto">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTool === tool.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tool.icon className="w-4 h-4" />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>

        {/* No selection warning */}
        {selectedImages.size === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Select at least one image to process
            </p>
          </div>
        ) : (
          <div key={activeTool}>
            {renderTool()}
          </div>
        )}
      </div>
    </div>
  );
});

BatchImageProcessor.displayName = 'BatchImageProcessor';

export default BatchImageProcessor;
