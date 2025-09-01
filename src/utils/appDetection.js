/**
 * Detect if the current environment is a WebView/App
 * Common methods to detect WebView:
 * 1. Custom User Agent
 * 2. JavaScript Interface injection
 * 3. Custom URL scheme
 */

export const isInApp = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  
  // Method 1: Check for custom User Agent strings
  // You can customize this based on your WebView implementation
  const webViewIdentifiers = [
    'MoguApp',           // Custom identifier for your app
    'WebView',           // Generic WebView
    'wv',                // Common WebView identifier
    'mogumanga',         // Your app specific identifier
  ]
  
  const hasWebViewIdentifier = webViewIdentifiers.some(identifier => 
    userAgent.toLowerCase().includes(identifier.toLowerCase())
  )
  
  // Method 2: Check for JavaScript interface (Android)
  // Your Android WebView might inject a JavaScript interface
  const hasAndroidInterface = typeof window.Android !== 'undefined' || 
                              typeof window.MoguApp !== 'undefined'
  
  // Method 3: Check for iOS specific WebView indicators
  const isIOSWebView = /iPhone|iPod|iPad/.test(userAgent) && 
                       !/Safari/.test(userAgent) && 
                       !/CriOS/.test(userAgent) && 
                       !/FxiOS/.test(userAgent)
  
  // Method 4: Check for custom global variables or functions
  // that your WebView might inject
  const hasCustomGlobals = typeof window.isNativeApp !== 'undefined' ||
                          typeof window.nativeApp !== 'undefined'
  
  // Method 5: Check URL parameters (if your app adds special params)
  const urlParams = new URLSearchParams(window.location.search)
  const hasAppParam = urlParams.get('app') === 'true' || 
                     urlParams.get('source') === 'app' ||
                     urlParams.get('platform') === 'webview'
  
  // Method 6: Check localStorage flag (set by your WebView)
  const hasAppFlag = localStorage.getItem('isInApp') === 'true'
  
  return hasWebViewIdentifier || 
         hasAndroidInterface || 
         isIOSWebView || 
         hasCustomGlobals || 
         hasAppParam ||
         hasAppFlag
}

/**
 * Set app flag manually (useful for testing or when app is detected via other means)
 */
export const setAppFlag = (isApp) => {
  localStorage.setItem('isInApp', isApp ? 'true' : 'false')
}

/**
 * Get platform information
 */
export const getPlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  
  if (/android/i.test(userAgent)) {
    return 'android'
  }
  
  if (/iPhone|iPad|iPod/.test(userAgent)) {
    return 'ios'
  }
  
  return 'web'
}

/**
 * Initialize app detection and communicate with native app if available
 */
export const initAppDetection = () => {
  // Try to communicate with the native app
  try {
    // Android WebView communication
    if (window.Android && window.Android.onWebLoaded) {
      window.Android.onWebLoaded()
    }
    
    // iOS WebView communication using postMessage
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.onWebLoaded) {
      window.webkit.messageHandlers.onWebLoaded.postMessage({})
    }
    
    // Custom WebView communication
    if (window.MoguApp && window.MoguApp.initialize) {
      window.MoguApp.initialize()
    }
  } catch (error) {
    console.log('Native app communication not available')
  }
  
  // Log detection result for debugging
  if (import.meta.env.DEV) {
    console.log('App Detection:', {
      isInApp: isInApp(),
      platform: getPlatform(),
      userAgent: navigator.userAgent
    })
  }
}