'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, GripVertical } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
}

interface ImageUploadProps {
  productId?: string;
  initialImages?: ProductImage[];
  onImagesChange?: (images: ProductImage[]) => void;
}

export function ImageUpload({ productId, initialImages = [], onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Upload to Cloudinary via API
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload image');
        }

        const { url } = await uploadRes.json();

        // If productId exists, save to database
        if (productId) {
          const imageRes = await fetch(`/api/products/${productId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, alt: file.name }),
          });

          if (!imageRes.ok) {
            throw new Error('Failed to save image');
          }

          return await imageRes.json();
        } else {
          // For new products, just return temporary image object
          return {
            id: `temp-${Date.now()}-${Math.random()}`,
            url,
            alt: file.name,
            position: images.length,
          };
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages];
      setImages(newImages);
      onImagesChange?.(newImages);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Only call API if it's a saved image (not temp)
      if (!imageId.startsWith('temp-') && productId) {
        const res = await fetch(`/api/products/images/${imageId}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete image');
        }
      }

      const newImages = images.filter((img) => img.id !== imageId);
      setImages(newImages);
      onImagesChange?.(newImages);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Update positions
    const updatedImages = newImages.map((img, idx) => ({
      ...img,
      position: idx,
    }));

    setImages(updatedImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);

    // Save new positions to database if product exists
    if (productId) {
      try {
        const res = await fetch(`/api/products/${productId}/images`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: images.map((img) => ({ id: img.id, position: img.position })),
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to update positions');
        }
      } catch (error) {
        console.error('Error updating positions:', error);
      }
    }

    onImagesChange?.(images);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Product Images</label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <span className="text-sm text-gray-500">
            Drag images to reorder. First image is the primary image.
          </span>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group border-2 rounded-lg overflow-hidden cursor-move ${
                index === 0 ? 'border-blue-500' : 'border-gray-200'
              } ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.alt || ''}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2 bg-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4" />
                </div>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
