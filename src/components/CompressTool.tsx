import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ImageData, compressImage, downloadBlob, formatBytes } from "@/lib/imageUtils";
import { Download } from "lucide-react";

interface CompressToolProps {
  imageData: ImageData;
}

const CompressTool = ({ imageData }: CompressToolProps) => {
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);

  useEffect(() => {
    // Estimate compressed size
    const estimate = async () => {
      try {
        const blob = await compressImage(imageData, { quality: quality / 100 });
        setEstimatedSize(blob.size);
      } catch (error) {
        setEstimatedSize(null);
      }
    };
    
    const timer = setTimeout(estimate, 300);
    return () => clearTimeout(timer);
  }, [quality, imageData]);

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const blob = await compressImage(imageData, { quality: quality / 100 });
      const baseName = imageData.name.replace(/\.[^.]+$/, '');
      downloadBlob(blob, `${baseName}_compressed.jpg`);
    } catch (error) {
      console.error('Failed to compress image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reduction = estimatedSize 
    ? Math.round((1 - estimatedSize / imageData.size) * 100)
    : null;

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
          <span className="text-sm text-muted-foreground">Original size</span>
          <span className="text-sm font-mono text-foreground">{formatBytes(imageData.size)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Compressed size</span>
          <span className="text-sm font-mono text-foreground">
            {estimatedSize ? formatBytes(estimatedSize) : '—'}
          </span>
        </div>
        {reduction !== null && reduction > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Reduction</span>
            <span className="text-sm font-mono text-accent font-medium">
              -{reduction}%
            </span>
          </div>
        )}
      </div>

      {/* Note about PNG */}
      {imageData.type === 'image/png' && (
        <p className="text-xs text-muted-foreground">
          Note: PNG files will be converted to JPEG for compression.
        </p>
      )}

      {/* Download button */}
      <Button
        variant="hero"
        onClick={handleDownload}
        disabled={isProcessing}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        {isProcessing ? 'Compressing...' : 'Download Compressed'}
      </Button>
    </div>
  );
};

export default CompressTool;
