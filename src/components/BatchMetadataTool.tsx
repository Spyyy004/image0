import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageData, batchRemoveMetadata, downloadBlobs, formatBytes } from "@/lib/imageUtils";
import { Download, ShieldCheck, MapPin, Camera, Calendar } from "lucide-react";

interface BatchMetadataToolProps {
  images: ImageData[];
}

const metadataTypes = [
  { icon: MapPin, label: "GPS location data" },
  { icon: Camera, label: "Camera & device info" },
  { icon: Calendar, label: "Date & time stamps" },
];

const BatchMetadataTool = memo(({ images }: BatchMetadataToolProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: '' });

  const totalSize = images.reduce((sum, img) => sum + img.size, 0);

  const handleDownloadAll = useCallback(async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setIsComplete(false);
    setProgress({ current: 0, total: images.length, phase: 'Removing metadata' });
    
    try {
      const results = await batchRemoveMetadata(
        images,
        (processed, total) => {
          setProgress({ current: processed, total, phase: 'Removing metadata' });
        }
      );
      
      setProgress({ current: 0, total: results.length, phase: 'Downloading' });
      
      await downloadBlobs(
        results.map(r => ({ blob: r.blob, filename: r.filename })),
        (downloaded, total) => {
          setProgress({ current: downloaded, total, phase: 'Downloading' });
        }
      );
      
      setIsComplete(true);
    } catch (error) {
      console.error('Batch metadata removal failed:', error);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, phase: '' });
    }
  }, [images]);

  const progressPercent = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Info card */}
      <div className="p-4 rounded-xl bg-secondary space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">
              Remove metadata from {images.length} image{images.length !== 1 ? 's' : ''}
            </h4>
            <p className="text-sm text-muted-foreground">
              Strip EXIF and other metadata from all selected images before sharing.
            </p>
          </div>
        </div>
      </div>

      {/* What gets removed */}
      <div>
        <label className="block text-sm text-muted-foreground mb-3">What will be removed</label>
        <div className="space-y-2">
          {metadataTypes.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* File info */}
      <div className="p-4 rounded-xl border border-border space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total images</span>
          <span className="font-mono text-foreground">{images.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Combined size</span>
          <span className="font-mono text-foreground">{formatBytes(totalSize)}</span>
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

      {/* Success message */}
      {isComplete && !isProcessing && (
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-sm text-accent flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            All metadata removed from {images.length} image{images.length !== 1 ? 's' : ''}
          </p>
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
          : `Download ${images.length} Clean Image${images.length !== 1 ? 's' : ''}`
        }
      </Button>
    </div>
  );
});

BatchMetadataTool.displayName = 'BatchMetadataTool';

export default BatchMetadataTool;
