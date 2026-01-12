import { useState, useMemo } from "react";
import { ImageData, formatBytes } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface BeforeAfterPreviewProps {
  original: ImageData;
  processedBlob: Blob | null;
  processedSize?: number;
  viewMode?: 'side-by-side' | 'toggle';
}

const BeforeAfterPreview = ({
  original,
  processedBlob,
  processedSize,
  viewMode = 'side-by-side'
}: BeforeAfterPreviewProps) => {
  const [showProcessed, setShowProcessed] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  // Create object URL for processed image
  useMemo(() => {
    if (processedBlob) {
      const url = URL.createObjectURL(processedBlob);
      setProcessedUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
        setProcessedUrl(null);
      }
    }
  }, [processedBlob]);

  if (viewMode === 'toggle') {
    return (
      <div className="space-y-3">
        <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
          {showProcessed && processedUrl ? (
            <img
              src={processedUrl}
              alt="Processed"
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={original.url}
              alt="Original"
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={!showProcessed ? "default" : "outline"}
              size="sm"
              onClick={() => setShowProcessed(false)}
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Original
            </Button>
            <Button
              variant={showProcessed ? "default" : "outline"}
              size="sm"
              onClick={() => setShowProcessed(true)}
              disabled={!processedBlob}
            >
              <Eye className="w-4 h-4 mr-2" />
              Processed
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {!showProcessed ? (
              <span>{formatBytes(original.size)}</span>
            ) : processedSize ? (
              <span>{formatBytes(processedSize)}</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // Side-by-side view
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
          <img
            src={original.url}
            alt="Original"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Original</p>
          <p className="text-sm font-mono text-foreground">{formatBytes(original.size)}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden">
          {processedUrl ? (
            <img
              src={processedUrl}
              alt="Processed"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <p className="text-sm">No preview</p>
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Processed</p>
          {processedSize ? (
            <p className="text-sm font-mono text-foreground">{formatBytes(processedSize)}</p>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterPreview;

