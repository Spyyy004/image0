import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageData, removeMetadata, downloadBlob, formatBytes } from "@/lib/imageUtils";
import { Download, ShieldCheck, MapPin, Camera, Calendar } from "lucide-react";

interface MetadataToolProps {
  imageData: ImageData;
}

const MetadataTool = ({ imageData }: MetadataToolProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const blob = await removeMetadata(imageData);
      const extension = imageData.name.split('.').pop() || 'jpg';
      const baseName = imageData.name.replace(/\.[^.]+$/, '');
      downloadBlob(blob, `${baseName}_clean.${extension}`);
      setIsComplete(true);
    } catch (error) {
      console.error('Failed to remove metadata:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const metadataTypes = [
    { icon: MapPin, label: "GPS location data" },
    { icon: Camera, label: "Camera & device info" },
    { icon: Calendar, label: "Date & time stamps" },
  ];

  return (
    <div className="space-y-6">
      {/* Info card */}
      <div className="p-4 rounded-xl bg-secondary space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Remove all metadata</h4>
            <p className="text-sm text-muted-foreground">
              Strip EXIF and other metadata from your image before sharing.
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
      <div className="p-4 rounded-xl border border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">File size</span>
          <span className="font-mono text-foreground">{formatBytes(imageData.size)}</span>
        </div>
      </div>

      {/* Success message */}
      {isComplete && (
        <div className="p-4 rounded-xl bg-success-muted border border-accent/20">
          <p className="text-sm text-accent flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            All metadata removed before download
          </p>
        </div>
      )}

      {/* Download button */}
      <Button
        variant="hero"
        onClick={handleDownload}
        disabled={isProcessing}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        {isProcessing ? 'Processing...' : 'Download Clean Image'}
      </Button>
    </div>
  );
};

export default MetadataTool;
