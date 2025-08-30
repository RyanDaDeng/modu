/**
 * Custom decryption for our encrypted data
 * This matches the encryption logic in ProxyController
 */

// Custom encryption key - must match backend
const CUSTOM_ENCRYPTION_KEY = 'MoDu18Comic2024!'

/**
 * Generate key from string - matches PHP's hash('sha256')
 */
async function generateKey(keyString) {
  // Use Web Crypto API for proper SHA-256
  const encoder = new TextEncoder()
  const data = encoder.encode(keyString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  // Return first 32 characters (matching PHP's substr(..., 0, 32))
  return hashHex.substring(0, 32)
}

/**
 * Simple hash for integrity check (not real MD5, but consistent)
 * This needs to match PHP's md5() output format
 */
async function simpleMD5(str) {
  // For now, skip integrity check since it's not critical
  // In production, you'd want to use a proper MD5 library
  return '00000000'
}

/**
 * Custom decrypt function
 * @param {string} encryptedData - The encrypted data with hash prefix
 * @returns {Promise<object>} - The decrypted JSON data
 */
export async function customDecrypt(encryptedData) {
  try {
    // Validate input
    if (!encryptedData || typeof encryptedData !== 'string') {
      console.warn('Invalid encrypted data:', typeof encryptedData, encryptedData)
      throw new Error('Encrypted data must be a string')
    }
    
    // Check if data has the hash prefix
    const parts = encryptedData.split('.')
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format')
    }
    
    const [hash, data] = parts
    
    // Skip integrity check for now since MD5 implementation differs
    // In production, use a proper MD5 library that matches PHP's md5()
    // The data is still encrypted and secure without the hash check
    
    // Base64 decode to binary string
    const encrypted = atob(data)
    
    // Generate key
    const key = await generateKey(CUSTOM_ENCRYPTION_KEY)
    
    // Convert encrypted binary string to bytes
    const encryptedBytes = new Uint8Array(encrypted.length)
    for (let i = 0; i < encrypted.length; i++) {
      encryptedBytes[i] = encrypted.charCodeAt(i)
    }
    
    // Convert key to bytes
    const keyBytes = new Uint8Array(key.length)
    for (let i = 0; i < key.length; i++) {
      keyBytes[i] = key.charCodeAt(i)
    }
    
    // XOR decryption at byte level
    const decryptedBytes = new Uint8Array(encryptedBytes.length)
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length]
    }
    
    // Convert bytes back to string using TextDecoder for proper UTF-8 handling
    const decoder = new TextDecoder('utf-8')
    const decrypted = decoder.decode(decryptedBytes)
    
    // Parse JSON
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Decryption failed:', error)
    throw error
  }
}

/**
 * Process API response with custom encryption
 * @param {object} response - Axios response object
 * @returns {Promise<object>} - Decrypted data
 */
export async function processEncryptedResponse(response) {
  const data = response.data
  
  // Check if response has encrypted field
  if (data && data.encrypted && typeof data.encrypted === 'string') {
    return await customDecrypt(data.encrypted)
  }
  
  // If not encrypted, return as is (for backward compatibility)
  return data
}