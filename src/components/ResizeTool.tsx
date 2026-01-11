import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ImageData, resizeImage, downloadBlob } from "@/lib/imageUtils";
import { Download, RotateCcw } from "lucide-react";

interface ResizeToolProps {
  imageData: ImageData;
}

const presets = [
  { label: "512px", width: 512 },
  { label: "1024px", width: 1024 },
  { label: "1920px", width: 1920 },
  { label: "Instagram", width: 1080 },
  { label: "Twitter", width: 1200 },
];

const ResizeTool = ({ imageData }: ResizeToolProps) => {
  const [width, setWidth] = useState(imageData.width);
  const [height, setHeight] = useState(imageData.height);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const aspectRatio = imageData.width / imageData.height;

  useEffect(() => {
    setWidth(imageData.width);
    setHeight(imageData.height);
  }, [imageData]);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const handlePreset = (presetWidth: number) => {
    handleWidthChange(presetWidth);
  };

  const handleReset = () => {
    setWidth(imageData.width);
    setHeight(imageData.height);
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const blob = await resizeImage(imageData, {
        width,
        height,
        maintainAspectRatio,
      });
      const extension = imageData.name.split('.').pop() || 'jpg';
      const baseName = imageData.name.replace(/\.[^.]+$/, '');
      downloadBlob(blob, `${baseName}_${width}x${height}.${extension}`);
    } catch (error) {
      console.error('Failed to resize image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasChanges = width !== imageData.width || height !== imageData.height;

  return (
    <div className="space-y-6">
      {/* Dimension inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
            className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Height (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
            className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Aspect ratio toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Maintain aspect ratio</span>
        <Switch
          checked={maintainAspectRatio}
          onCheckedChange={setMaintainAspectRatio}
        />
      </div>

      {/* Presets */}
      <div>
        <label className="block text-sm text-muted-foreground mb-3">Quick presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="secondary"
              size="sm"
              onClick={() => handlePreset(preset.width)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!hasChanges}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          variant="hero"
          onClick={handleDownload}
          disabled={isProcessing || !hasChanges}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Download'}
        </Button>
      </div>
    </div>
  );
};

export default ResizeTool;
