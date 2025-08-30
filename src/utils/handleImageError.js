/**
 * Handle image loading errors with fallback
 * Prevents infinite loading loops by tracking failed images
 */

// Track images that have already failed to prevent infinite loops
const failedImages = new Set()

export function handleImageError(event) {
  const img = event.target
  const originalSrc = img.src
  
  // Don't retry if this is already the fallback image
  if (originalSrc.includes('/default.jpeg')) {
    return
  }
  
  // If this image has already failed, don't try again
  if (failedImages.has(originalSrc)) {
    return
  }
  
  // Mark this image as failed
  failedImages.add(originalSrc)
  
  // Set to fallback image
  img.src = '/default.jpeg'
  
  // Optional: Clear failed images cache after some time to allow retries
  setTimeout(() => {
    failedImages.delete(originalSrc)
  }, 60000) // Clear after 1 minute
}

// Export a composable for Vue components
export function useImageError() {
  return {
    handleImageError
  }
}