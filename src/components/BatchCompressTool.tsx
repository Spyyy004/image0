import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ImageData, batchCompress, downloadBlobs, formatBytes } from "@/lib/imageUtils";
import { Download } from "lucide-react";

interface BatchCompressToolProps {
  images: ImageData[];
}

const BatchCompressTool = memo(({ images }: BatchCompressToolProps) => {
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: '' });

  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  const estimatedSize = Math.round(totalSize * (quality / 100) * 0.7); // Rough estimate
  const estimatedReduction = Math.round((1 - estimatedSize / totalSize) * 100);

  const handleDownloadAll = useCallback(async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setProgress({ current: 0, total: images.length, phase: 'Compressing' });
    
    try {
      const results = await batchCompress(
        images,
        { quality: quality / 100 },
        (processed, total) => {
          setProgress({ current: processed, total, phase: 'Compressing' });
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
      console.error('Batch compress failed:', error);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, phase: '' });
    }
  }, [images, quality]);

  const progressPercent = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Quality slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-muted-foreground">Quality</label>
          <span className="text-sm font-mono text-foreground">{quality}%</span>
        </div>
        <Slider
          value={[quality]}
          onValueChange={(value) => setQuality(value[0])}
          min={10}
          max={100}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Smaller file</span>
          <span>Higher quality</span>
        </div>
      </div>

      {/* Size comparison */}
      <div className="p-4 rounded-xl bg-secondary space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total original size</span>
          <span className="text-sm font-mono text-foreground">{formatBytes(totalSize)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Est. compressed size</span>
          <span className="text-sm font-mono text-foreground">{formatBytes(estimatedSize)}</span>
        </div>
        {estimatedReduction > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Est. reduction</span>
            <span className="text-sm font-mono text-accent font-medium">
              ~{estimatedReduction}%
            </span>
          </div>
        )}
      </div>

      {/* PNG note */}
      {images.some(img => img.type === 'image/png') && (
        <p className="text-xs text-muted-foreground">
          Note: PNG files will be converted to JPEG for compression.
        </p>
      )}

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

      {/* Download button */}
      <Button
        variant="hero"
        onClick={handleDownloadAll}
        disabled={isProcessing || images.length === 0}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        {isProcessing 
          ? `${progressPercent}%` 
          : `Compress ${images.length} Image${images.length !== 1 ? 's' : ''}`
        }
      </Button>
    </div>
  );
});

BatchCompressTool.displayName = 'BatchCompressTool';

export default BatchCompressTool;
