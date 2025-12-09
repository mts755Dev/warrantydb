import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { fileToBase64, formatFileSize } from '../../utils/helpers';
import type { PhotoUpload as PhotoUploadType } from '../../types';
import { generateId } from '../../utils/helpers';

interface PhotoUploadProps {
  label?: string;
  photos: PhotoUploadType[];
  onChange: (photos: PhotoUploadType[]) => void;
  maxPhotos?: number;
  maxFileSize?: number; // in MB
  type: 'installation' | 'inspection' | 'corrosion' | 'general';
}

export function PhotoUpload({ 
  label, 
  photos, 
  onChange, 
  maxPhotos = 10,
  maxFileSize = 5,
  type
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsUploading(true);

    const newPhotos: PhotoUploadType[] = [];
    const maxBytes = maxFileSize * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        continue;
      }
      
      // Check file size
      if (file.size > maxBytes) {
        setError(`${file.name} exceeds ${maxFileSize}MB limit`);
        continue;
      }
      
      // Check max photos
      if (photos.length + newPhotos.length >= maxPhotos) {
        setError(`Maximum ${maxPhotos} photos allowed`);
        break;
      }

      try {
        const base64 = await fileToBase64(file);
        newPhotos.push({
          id: generateId(),
          filename: file.name,
          url: base64,
          type,
          uploadedAt: new Date().toISOString(),
        });
      } catch {
        setError(`Failed to process ${file.name}`);
      }
    }

    onChange([...photos, ...newPhotos]);
    setIsUploading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (photoId: string) => {
    onChange(photos.filter(p => p.id !== photoId));
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Upload Button */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || photos.length >= maxPhotos}
          leftIcon={isUploading ? <Loader2 className="animate-spin" /> : <Upload className="w-4 h-4" />}
        >
          {isUploading ? 'Uploading...' : 'Upload Photos'}
        </Button>
        <p className="mt-2 text-sm text-surface-500">
          {photos.length}/{maxPhotos} photos • Max {maxFileSize}MB per file
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div 
              key={photo.id} 
              className="relative group rounded-lg overflow-hidden border border-surface-200 bg-surface-50"
            >
              <div className="aspect-square relative">
                <img
                  src={photo.url}
                  alt={photo.filename}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(photo.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Photo Info */}
              <div className="p-2 bg-white border-t border-surface-200">
                <p className="text-xs text-surface-600 truncate">{photo.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <div 
          className="border-2 border-dashed border-surface-300 rounded-lg p-8 text-center
                     hover:border-primary-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-10 h-10 mx-auto text-surface-400 mb-3" />
          <p className="text-surface-600 font-medium">Click to upload photos</p>
          <p className="text-sm text-surface-500 mt-1">or drag and drop</p>
        </div>
      )}
    </div>
  );
}

