import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageData, convertImage, downloadBlob, OutputFormat, getFileExtension } from "@/lib/imageUtils";
import { Download, Check } from "lucide-react";

interface ConvertToolProps {
  imageData: ImageData;
}

const formats: { label: string; value: OutputFormat; description: string }[] = [
  { label: "JPEG", value: "image/jpeg", description: "Best for photos, smaller files" },
  { label: "PNG", value: "image/png", description: "Lossless, supports transparency" },
  { label: "WebP", value: "image/webp", description: "Modern format, great compression" },
];

const ConvertTool = ({ imageData }: ConvertToolProps) => {
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>("image/webp");
  const [isProcessing, setIsProcessing] = useState(false);

  const currentFormat = imageData.type as OutputFormat;

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const blob = await convertImage(imageData, selectedFormat);
      const baseName = imageData.name.replace(/\.[^.]+$/, '');
      const extension = getFileExtension(selectedFormat);
      downloadBlob(blob, `${baseName}.${extension}`);
    } catch (error) {
      console.error('Failed to convert image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current format */}
      <div className="p-4 rounded-xl bg-secondary">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current format</span>
          <span className="text-sm font-mono text-foreground uppercase">
            {imageData.type.replace('image/', '')}
          </span>
        </div>
      </div>

      {/* Format selection */}
      <div>
        <label className="block text-sm text-muted-foreground mb-3">Convert to</label>
        <div className="space-y-2">
          {formats.map((format) => {
            const isCurrentFormat = format.value === currentFormat;
            const isSelected = format.value === selectedFormat;
            
            return (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                disabled={isCurrentFormat}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  isSelected && !isCurrentFormat
                    ? 'border-accent bg-accent/10'
                    : isCurrentFormat
                    ? 'border-border bg-muted/50 opacity-50 cursor-not-allowed'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{format.label}</span>
                      {isCurrentFormat && (
                        <span className="text-xs text-muted-foreground">(current)</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{format.description}</p>
                  </div>
                  {isSelected && !isCurrentFormat && (
                    <Check className="w-5 h-5 text-accent" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transparency warning */}
      {selectedFormat === 'image/jpeg' && imageData.type === 'image/png' && (
        <p className="text-xs text-muted-foreground">
          Note: JPEG doesn't support transparency. Transparent areas will be filled with white.
        </p>
      )}

      {/* Download button */}
      <Button
        variant="hero"
        onClick={handleDownload}
        disabled={isProcessing || selectedFormat === currentFormat}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        {isProcessing ? 'Converting...' : `Download as ${selectedFormat.replace('image/', '').toUpperCase()}`}
      </Button>
    </div>
  );
};

export default ConvertTool;
