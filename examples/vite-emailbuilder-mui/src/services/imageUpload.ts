import { getAppConfig } from '../getConfiguration';

interface PresignedUrlResponse {
  url: string;
  fields?: Record<string, string>;
  publicUrl: string;
}

export function isImageUploadConfigured(): boolean {
  return getAppConfig().presignedUrlEndpoint !== null;
}

export async function uploadImage(file: File): Promise<string> {
  const { presignedUrlEndpoint } = getAppConfig();
  if (!presignedUrlEndpoint) {
    throw new Error('Image upload not configured. Set presignedUrlEndpoint in config.');
  }

  // Request presigned URL from the endpoint
  const presignedResponse = await fetch(presignedUrlEndpoint, {
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
