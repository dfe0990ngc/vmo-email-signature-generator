// Cloudinary upload utility with image optimization
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME || 'duybphdbl';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUD_PRESET || 'profile_preset';

/**
 * Optimizes an image file before upload
 * @param {File} file - The image file to optimize
 * @returns {Promise<File>} - The optimized image file
 */
export const optimizeImageForUpload = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions (target width: 400px)
      const targetWidth = 400;
      const aspectRatio = img.height / img.width;
      const targetHeight = targetWidth * aspectRatio;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Fill with white background to avoid transparency issues
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      
      // Draw the image on top of white background
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to blob (JPEG with 0.85 quality for better compression)
      canvas.toBlob((blob) => {
        // Create a new File object from the blob
        const optimizedFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(optimizedFile);
      }, 'image/jpeg', 0.85);
    };
    
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an optimized image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The Cloudinary secure URL
 */
export const uploadToCloudinary = async (file) => {
  try {
    // First optimize the image
    const optimizedFile = await optimizeImageForUpload(file);
    
    // Create FormData for Cloudinary upload
    const formData = new FormData();
    formData.append('file', optimizedFile);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);
    
    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Image optimization error:', error);
    throw new Error(`Failed to optimize image: ${error.message}`);
  }
};
