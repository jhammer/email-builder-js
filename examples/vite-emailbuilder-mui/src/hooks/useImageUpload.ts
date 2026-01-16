import { useCallback, useRef, useState } from 'react';

import { getImageUploadConfig, uploadImage } from '../services/imageUpload';

interface UseImageUploadResult {
  isUploading: boolean;
  error: string | null;
  isConfigured: boolean;
  selectAndUploadImage: () => Promise<string | null>;
}

export function useImageUpload(): UseImageUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isConfigured = getImageUploadConfig() !== null;

  const selectAndUploadImage = useCallback(async (): Promise<string | null> => {
    return new Promise((resolve) => {
      // Create a hidden file input
      if (!fileInputRef.current) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);
        fileInputRef.current = input;
      }

      const input = fileInputRef.current;

      const handleChange = async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        setIsUploading(true);
        setError(null);

        try {
          const url = await uploadImage(file);
          resolve(url);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          setError(errorMessage);
          resolve(null);
        } finally {
          setIsUploading(false);
          input.value = '';
        }
      };

      input.onchange = handleChange;
      input.click();
    });
  }, []);

  return {
    isUploading,
    error,
    isConfigured,
    selectAndUploadImage,
  };
}
