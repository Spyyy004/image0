import { useState } from "react";
import { ImageData, formatBytes } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import { Maximize2, FileDown, RefreshCw, Trash2, X } from "lucide-react";
import ResizeTool from "./ResizeTool";
import CompressTool from "./CompressTool";
import ConvertTool from "./ConvertTool";
import MetadataTool from "./MetadataTool";

interface ImageProcessorProps {
  imageData: ImageData;
  onReset: () => void;
}

type Tool = 'resize' | 'compress' | 'convert' | 'metadata';

const tools: { id: Tool; label: string; icon: React.ElementType }[] = [
  { id: 'resize', label: 'Resize', icon: Maximize2 },
  { id: 'compress', label: 'Compress', icon: FileDown },
  { id: 'convert', label: 'Convert', icon: RefreshCw },
  { id: 'metadata', label: 'Strip Metadata', icon: Trash2 },
];

const ImageProcessor = ({ imageData, onReset }: ImageProcessorProps) => {
  const [activeTool, setActiveTool] = useState<Tool>('resize');

  const renderTool = () => {
    switch (activeTool) {
      case 'resize':
        return <ResizeTool imageData={imageData} />;
      case 'compress':
        return <CompressTool imageData={imageData} />;
      case 'convert':
        return <ConvertTool imageData={imageData} />;
      case 'metadata':
        return <MetadataTool imageData={imageData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{imageData.name}</h2>
          <p className="text-sm text-muted-foreground">
            {imageData.width} × {imageData.height}px • {formatBytes(imageData.size)}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="w-4 h-4 mr-2" />
          New Image
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="glass-panel rounded-2xl p-4 overflow-hidden">
          <div className="relative aspect-video flex items-center justify-center bg-muted/30 rounded-xl overflow-hidden">
            <img
              src={imageData.url}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Tools */}
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
                <span className="hidden sm:inline">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Tool content */}
          <div key={activeTool}>
            {renderTool()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageProcessor;
