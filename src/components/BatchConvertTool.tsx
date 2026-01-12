import { useState, useCallback, memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageData, batchConvert, downloadBlobs, OutputFormat, convertImage } from "@/lib/imageUtils";
import { Download, Check } from "lucide-react";
import BeforeAfterPreview from "./BeforeAfterPreview";

interface BatchConvertToolProps {
  images: ImageData[];
}

const formats: { label: string; value: OutputFormat; description: string }[] = [
  { label: "JPEG", value: "image/jpeg", description: "Best for photos, smaller files" },
  { label: "PNG", value: "image/png", description: "Lossless, supports transparency" },
  { label: "WebP", value: "image/webp", description: "Modern format, great compression" },
];

const BatchConvertTool = memo(({ images }: BatchConvertToolProps) => {
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>("image/webp");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: '' });
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewSize, setPreviewSize] = useState<number | undefined>(undefined);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  // Count how many images would actually be converted
  const imagesNeedingConversion = images.filter(
    img => img.type !== selectedFormat
  );

  const handleDownloadAll = useCallback(async () => {
    if (imagesNeedingConversion.length === 0) return;
    
    setIsProcessing(true);
    setProgress({ current: 0, total: imagesNeedingConversion.length, phase: 'Converting' });
    
    try {
      const results = await batchConvert(
        imagesNeedingConversion,
        selectedFormat,
        (processed, total) => {
          setProgress({ current: processed, total, phase: 'Converting' });
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
      console.error('Batch convert failed:', error);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, phase: '' });
    }
  }, [imagesNeedingConversion, selectedFormat]);

  const progressPercent = progress.total > 0 
    ? Math.round((progress.current / progress.total) * 100) 
    : 0;

  // Generate preview when format changes
  useEffect(() => {
    if (images.length === 0) {
      setPreviewBlob(null);
      setPreviewSize(undefined);
      return;
    }

    const generatePreview = async () => {
      setIsGeneratingPreview(true);
      try {
        const firstImage = images[0];
        const blob = await convertImage(firstImage, selectedFormat);
        setPreviewBlob(blob);
        setPreviewSize(blob.size);
      } catch (error) {
        console.error('Failed to generate preview:', error);
        setPreviewBlob(null);
        setPreviewSize(undefined);
      } finally {
        setIsGeneratingPreview(false);
      }
    };

    const timeoutId = setTimeout(generatePreview, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [selectedFormat, images]);

  // Count current formats
  const formatCounts = images.reduce((acc, img) => {
    const format = img.type.replace('image/', '').toUpperCase();
    acc[format] = (acc[format] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Preview */}
      {images.length > 0 && (
        <div className="p-4 rounded-xl bg-secondary">
          <h3 className="text-sm font-medium text-foreground mb-3">Preview</h3>
          {isGeneratingPreview ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <p className="text-sm">Generating preview...</p>
            </div>
          ) : (
            <BeforeAfterPreview
              original={images[0]}
              processedBlob={previewBlob}
              processedSize={previewSize}
              viewMode="side-by-side"
            />
          )}
        </div>
      )}

      {/* Current formats summary */}
      <div className="p-4 rounded-xl bg-secondary">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current formats</span>
          <div className="flex gap-2">
            {Object.entries(formatCounts).map(([format, count]) => (
              <span key={format} className="text-sm font-mono text-foreground">
                {count} {format}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Format selection */}
      <div>
        <label className="block text-sm text-muted-foreground mb-3">Convert all to</label>
        <div className="space-y-2">
          {formats.map((format) => {
            const isSelected = format.value === selectedFormat;
            
            return (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-foreground">{format.label}</span>
                    <p className="text-sm text-muted-foreground mt-1">{format.description}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-accent" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversion info */}
      <div className="p-4 rounded-xl border border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Images to convert</span>
          <span className="font-mono text-foreground">
            {imagesNeedingConversion.length} of {images.length}
          </span>
        </div>
        {images.length - imagesNeedingConversion.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {images.length - imagesNeedingConversion.length} image(s) already in {selectedFormat.replace('image/', '').toUpperCase()} format
          </p>
        )}
      </div>

      {/* Transparency warning */}
      {selectedFormat === 'image/jpeg' && images.some(img => img.type === 'image/png') && (
        <p className="text-xs text-muted-foreground">
          Note: JPEG doesn't support transparency. Transparent areas will be filled with white.
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
        disabled={isProcessing || imagesNeedingConversion.length === 0}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        {isProcessing 
          ? `${progressPercent}%` 
          : imagesNeedingConversion.length === 0
            ? 'All images already in this format'
            : `Convert ${imagesNeedingConversion.length} Image${imagesNeedingConversion.length !== 1 ? 's' : ''}`
        }
      </Button>
    </div>
  );
});

BatchConvertTool.displayName = 'BatchConvertTool';

export default BatchConvertTool;
