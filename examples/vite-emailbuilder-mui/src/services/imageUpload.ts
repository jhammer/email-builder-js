/**
 * Configuration for the S3 image upload service.
 * The presignedUrlEndpoint should return a JSON response with:
 * - url: The presigned URL to upload to
 * - fields: (optional) Additional form fields for the upload
 * - publicUrl: The public URL where the image will be accessible after upload
 */
export interface ImageUploadConfig {
  presignedUrlEndpoint: string;
}

interface PresignedUrlResponse {
  url: string;
  fields?: Record<string, string>;
  publicUrl: string;
}

let config: ImageUploadConfig | null = null;

export function configureImageUpload(uploadConfig: ImageUploadConfig): void {
  config = uploadConfig;
}

export function getImageUploadConfig(): ImageUploadConfig | null {
  return config;
}

export async function uploadImage(file: File): Promise<string> {
  if (!config) {
    throw new Error('Image upload not configured. Call configureImageUpload() first.');
  }

  // Request presigned URL from the endpoint
  const presignedResponse = await fetch(config.presignedUrlEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });

  if (!presignedResponse.ok) {
    throw new Error(`Failed to get presigned URL: ${presignedResponse.statusText}`);
  }

  const presignedData: PresignedUrlResponse = await presignedResponse.json();

  // Upload the file to S3
  if (presignedData.fields) {
    // Use FormData for uploads with additional fields (e.g., POST policy)
    const formData = new FormData();
    Object.entries(presignedData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', file);

    const uploadResponse = await fetch(presignedData.url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload image: ${uploadResponse.statusText}`);
    }
  } else {
    // Use PUT for simple presigned URL uploads
    const uploadResponse = await fetch(presignedData.url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload image: ${uploadResponse.statusText}`);
    }
  }

  return presignedData.publicUrl;
}
