export interface ImageData {
  file: File;
  url: string;
  width: number;
  height: number;
  size: number;
  type: string;
  name: string;
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

export interface CompressOptions {
  quality: number; // 0-1
}

export type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export const loadImage = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      resolve({
        file,
        url,
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
        name: file.name,
      });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

export const resizeImage = (
  imageData: ImageData,
  options: ResizeOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      let { width, height } = options;
      
      if (options.maintainAspectRatio) {
        const ratio = img.width / img.height;
        if (width && !height) {
          height = Math.round(width / ratio);
        } else if (height && !width) {
          width = Math.round(height * ratio);
        } else if (width && height) {
          // Use width as the base
          height = Math.round(width / ratio);
        }
      }

      canvas.width = width || img.width;
      canvas.height = height || img.height;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        imageData.type,
        0.92
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData.url;
  });
};

export const compressImage = (
  imageData: ImageData,
  options: CompressOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      // For PNG, we need to convert to JPEG for compression
      const outputType = imageData.type === 'image/png' ? 'image/jpeg' : imageData.type;
      
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        outputType,
        options.quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData.url;
  });
};

export const convertImage = (
  imageData: ImageData,
  format: OutputFormat
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill with white background for JPEG (no transparency)
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        format,
        0.92
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData.url;
  });
};

export const removeMetadata = (imageData: ImageData): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        imageData.type,
        0.92
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData.url;
  });
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (format: OutputFormat): string => {
  switch (format) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    default: return 'jpg';
  }
};
