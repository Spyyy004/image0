export interface ImageData {
  id: string;
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

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Type definitions for FileSystemEntry API (webkit)
interface FileSystemEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  fullPath: string;
}

interface FileSystemFileEntry extends FileSystemEntry {
  isFile: true;
  isDirectory: false;
  file(callback: (file: File) => void): void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  isFile: false;
  isDirectory: true;
  createReader(): FileSystemDirectoryReader;
}

interface FileSystemDirectoryReader {
  readEntries(callback: (entries: FileSystemEntry[]) => void): void;
}

// Recursively extract image files from directory entry
const extractFilesFromEntry = async (
  entry: FileSystemEntry,
  files: File[] = []
): Promise<File[]> => {
  if (entry.isFile) {
    return new Promise((resolve) => {
      (entry as FileSystemFileEntry).file((file: File) => {
        // Only add image files
        if (file.type.startsWith('image/')) {
          files.push(file);
        }
        resolve(files);
      });
    });
  } else if (entry.isDirectory) {
    const dirReader = (entry as FileSystemDirectoryEntry).createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve) => {
      const readEntries: FileSystemEntry[] = [];
      const read = () => {
        dirReader.readEntries((batch) => {
          if (batch.length === 0) {
            resolve(readEntries);
          } else {
            readEntries.push(...batch);
            read();
          }
        });
      };
      read();
    });

    // Recursively process all entries
    for (const subEntry of entries) {
      await extractFilesFromEntry(subEntry, files);
    }
  }
  return files;
};

// Extract image files from DataTransfer (supports folders)
export const extractImageFilesFromDataTransfer = async (
  dataTransfer: DataTransfer
): Promise<File[]> => {
  const files: File[] = [];
  const items = Array.from(dataTransfer.items);

  for (const item of items) {
    // Check if it's a directory (folder)
    if (item.webkitGetAsEntry) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        const extractedFiles = await extractFilesFromEntry(entry);
        files.push(...extractedFiles);
      }
    } else {
      // Fallback to regular file
      const file = item.getAsFile();
      if (file && file.type.startsWith('image/')) {
        files.push(file);
      }
    }
  }

  return files;
};

export const loadImage = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      resolve({
        id: generateId(),
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

// Batch load multiple images with concurrency control
export const loadImages = async (
  files: File[],
  onProgress?: (loaded: number, total: number) => void
): Promise<ImageData[]> => {
  const results: ImageData[] = [];
  const total = files.length;
  let loaded = 0;

  // Process in parallel batches of 4 for performance
  const batchSize = 4;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        try {
          const result = await loadImage(file);
          loaded++;
          onProgress?.(loaded, total);
          return result;
        } catch {
          loaded++;
          onProgress?.(loaded, total);
          return null;
        }
      })
    );
    results.push(...batchResults.filter((r): r is ImageData => r !== null));
  }

  return results;
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

// Download multiple blobs as individual files (sequential to avoid browser blocking)
export const downloadBlobs = async (
  blobs: { blob: Blob; filename: string }[],
  onProgress?: (downloaded: number, total: number) => void
) => {
  for (let i = 0; i < blobs.length; i++) {
    downloadBlob(blobs[i].blob, blobs[i].filename);
    onProgress?.(i + 1, blobs.length);
    // Small delay to prevent browser blocking
    if (i < blobs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
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

// Batch processing utilities
export interface BatchProcessResult {
  imageId: string;
  blob: Blob;
  filename: string;
}

export const batchResize = async (
  images: ImageData[],
  options: ResizeOptions,
  onProgress?: (processed: number, total: number) => void
): Promise<BatchProcessResult[]> => {
  const results: BatchProcessResult[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      const blob = await resizeImage(image, options);
      const extension = image.name.split('.').pop() || 'jpg';
      const baseName = image.name.replace(/\.[^.]+$/, '');
      results.push({
        imageId: image.id,
        blob,
        filename: `${baseName}_${options.width}x${options.height}.${extension}`,
      });
    } catch (error) {
      console.error(`Failed to resize ${image.name}:`, error);
    }
    onProgress?.(i + 1, images.length);
  }
  
  return results;
};

export const batchCompress = async (
  images: ImageData[],
  options: CompressOptions,
  onProgress?: (processed: number, total: number) => void
): Promise<BatchProcessResult[]> => {
  const results: BatchProcessResult[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      const blob = await compressImage(image, options);
      const baseName = image.name.replace(/\.[^.]+$/, '');
      results.push({
        imageId: image.id,
        blob,
        filename: `${baseName}_compressed.jpg`,
      });
    } catch (error) {
      console.error(`Failed to compress ${image.name}:`, error);
    }
    onProgress?.(i + 1, images.length);
  }
  
  return results;
};

export const batchConvert = async (
  images: ImageData[],
  format: OutputFormat,
  onProgress?: (processed: number, total: number) => void
): Promise<BatchProcessResult[]> => {
  const results: BatchProcessResult[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      const blob = await convertImage(image, format);
      const baseName = image.name.replace(/\.[^.]+$/, '');
      const extension = getFileExtension(format);
      results.push({
        imageId: image.id,
        blob,
        filename: `${baseName}.${extension}`,
      });
    } catch (error) {
      console.error(`Failed to convert ${image.name}:`, error);
    }
    onProgress?.(i + 1, images.length);
  }
  
  return results;
};

export const batchRemoveMetadata = async (
  images: ImageData[],
  onProgress?: (processed: number, total: number) => void
): Promise<BatchProcessResult[]> => {
  const results: BatchProcessResult[] = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    try {
      const blob = await removeMetadata(image);
      const extension = image.name.split('.').pop() || 'jpg';
      const baseName = image.name.replace(/\.[^.]+$/, '');
      results.push({
        imageId: image.id,
        blob,
        filename: `${baseName}_clean.${extension}`,
      });
    } catch (error) {
      console.error(`Failed to remove metadata from ${image.name}:`, error);
    }
    onProgress?.(i + 1, images.length);
  }
  
  return results;
};
