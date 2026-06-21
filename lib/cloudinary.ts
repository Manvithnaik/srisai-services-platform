/**
 * Cloudinary Upload Utility
 * Uploads images directly to Cloudinary using unsigned uploads.
 * No API secret is exposed — only the upload preset is used.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

/**
 * Upload a single image file to Cloudinary.
 * Returns the secure HTTPS URL of the uploaded image.
 */
export function uploadSingleImage(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'shree-devi-services');

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          loaded: e.loaded,
          total: e.total,
          percent: Math.round((e.loaded / e.total) * 100),
        });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url as string);
        } catch {
          reject(new Error('Invalid Cloudinary response'));
        }
      } else {
        // Parse Cloudinary's error body for a useful message
        let cloudinaryMsg = `HTTP ${xhr.status}`;
        try {
          const errData = JSON.parse(xhr.responseText);
          if (errData?.error?.message) cloudinaryMsg = errData.error.message;
        } catch { /* ignore */ }
        console.error('[Cloudinary] Upload error response:', xhr.responseText);
        reject(new Error(`Cloudinary upload failed: ${cloudinaryMsg}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.open('POST', UPLOAD_URL);
    xhr.send(formData);
  });
}

/**
 * Upload multiple image files to Cloudinary in parallel.
 * Returns an array of secure URLs in the same order as the input files.
 * onProgress is called with the overall progress (0–100).
 */
export async function uploadImages(
  files: File[],
  onProgress?: (overallPercent: number) => void
): Promise<string[]> {
  if (files.length === 0) return [];

  const progressMap = new Map<number, number>();

  const uploads = files.map((file, index) =>
    uploadSingleImage(file, (p) => {
      progressMap.set(index, p.percent);
      if (onProgress) {
        const total = Array.from(progressMap.values()).reduce((a, b) => a + b, 0);
        onProgress(Math.round(total / files.length));
      }
    })
  );

  return Promise.all(uploads);
}
