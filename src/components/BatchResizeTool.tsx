import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ImageData, batchResize, downloadBlobs } from "@/lib/imageUtils";
import { Download, RotateCcw } from "lucide-react";

interface BatchResizeToolProps {
  images: ImageData[];
}

const presets = [
  { label: "512px", width: 512 },
  { label: "1024px", width: 1024 },
  { label: "1920px", width: 1920 },
  { label: "Instagram", width: 1080 },
  { label: "Twitter", width: 1200 },
];

const BatchResizeTool = memo(({ images }: BatchResizeToolProps) => {
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: '' });

  const handlePreset = (presetWidth: number) => {
    setWidth(presetWidth);
    if (maintainAspectRatio) {
      // Use first image's aspect ratio as reference
      const firstImage = images[0];
      if (firstImage) {
        const ratio = firstImage.width / firstImage.height;
        setHeight(Math.round(presetWidth / ratio));
      }
    }
  };

  const handleReset = () => {
    setWidth(1024);
    setHeight(768);
    setMaintainAspectRatio(true);
  };

  const handleDownloadAll = useCallback(async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setProgress({ current: 0, total: images.length, phase: 'Processing' });
    
    try {
      const results = await batchResize(
        images,
        { width, height, maintainAspectRatio },
        (processed, total) => {
          setProgress({ current: processed, total, phase: 'Processing' });
        }
      );
      
      setProgress({ current: 0, total: results.length, phase: 'Downloading' });
      
      await downloadBlobs(
        results.map(r => ({ blob: r.blob, filename: r.filename })),
        (downloaded, total) => {
          setProgress({ current: downloaded, total, phase: 'Downloading' });
        }
      );
    } catch (error) {
      console.error('Batch resize failed:', error);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, phase: '' });
    }
  }, [images, width, height, maintainAspectRatio]);

  const progressPercent = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Dimension inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
            className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Height (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
            disabled={maintainAspectRatio}
            className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>
      </div>

      {/* Aspect ratio toggle */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-foreground">Maintain aspect ratio</span>
          <p className="text-xs text-muted-foreground">Height auto-calculated per image</p>
        </div>
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

      {/* Progress */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{progress.phase}</span>
            <span className="text-foreground font-mono">
              {progress.current}/{progress.total}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isProcessing}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          variant="hero"
          onClick={handleDownloadAll}
          disabled={isProcessing || images.length === 0}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          {isProcessing 
            ? `${progressPercent}%` 
            : `Download ${images.length} Image${images.length !== 1 ? 's' : ''}`
          }
        </Button>
      </div>
    </div>
  );
});

BatchResizeTool.displayName = 'BatchResizeTool';

export default BatchResizeTool;
