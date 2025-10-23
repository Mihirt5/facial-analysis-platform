"use client";

// Centralized TensorFlow.js loader to prevent multiple loadings and kernel registration warnings
// This ensures only one instance of TensorFlow is loaded across the entire application

declare global {
  interface Window {
    tf?: any;
    faceLandmarksDetection?: any;
    tensorflowLoaded?: boolean;
  }
}

interface TensorFlowConfig {
  version?: string;
  backend?: 'cpu' | 'webgl';
  preferLocal?: boolean;
}

class TensorFlowLoader {
  private static instance: TensorFlowLoader;
  private loadingPromise: Promise<void> | null = null;
  private isLoaded = false;

  private constructor() {}

  static getInstance(): TensorFlowLoader {
    if (!TensorFlowLoader.instance) {
      TensorFlowLoader.instance = new TensorFlowLoader();
    }
    return TensorFlowLoader.instance;
  }

  async loadTensorFlow(config: TensorFlowConfig = {}): Promise<void> {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    // If already loaded, return immediately
    if (this.isLoaded && window.tf) {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Start loading
    this.loadingPromise = this._loadTensorFlow(config);
    return this.loadingPromise;
  }

  private async _loadTensorFlow(config: TensorFlowConfig): Promise<void> {
    const {
      version = '4.15.0',
      backend = 'cpu',
      preferLocal = true
    } = config;

    try {
      console.log('Loading TensorFlow.js...');

      // Load TensorFlow Core
      if (typeof window !== 'undefined' && !window.tf) {
        if (preferLocal) {
          await this.loadWithFallbacks([
            `/parallellabs/tf-core.js`,
            `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@${version}/dist/tf.min.js`
          ]);
        } else {
          await this.loadScript(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@${version}/dist/tf.min.js`);
        }
      }

      // Load TensorFlow Converter
      if (typeof window !== 'undefined' && !window.tf?.converter) {
        if (preferLocal) {
          await this.loadWithFallbacks([
            `/parallellabs/tf-converter.js`,
            `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@${version}/dist/tf-converter.min.js`
          ]);
        } else {
          await this.loadScript(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@${version}/dist/tf-converter.min.js`);
        }
      }

      // Load Backend
      const backendUrls = backend === 'webgl' 
        ? [
            `/parallellabs/tf-backend-webgl.js`,
            `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@${version}/dist/tf-backend-webgl.min.js`
          ]
        : [
            `/parallellabs/tf-backend-cpu.js`,
            `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-cpu@${version}/dist/tf-backend-cpu.min.js`
          ];

      if (preferLocal) {
        await this.loadWithFallbacks(backendUrls);
      } else {
        const cdnUrl = backendUrls[1];
        if (cdnUrl) {
          await this.loadScript(cdnUrl); // Use CDN URL
        } else {
          throw new Error('CDN URL not available');
        }
      }

      // Set backend and initialize
      if (typeof window !== 'undefined' && window.tf && window.tf.ready) {
        const tf = window.tf;
        
        // Try to set the preferred backend
        const tryBackends = async (names: string[]) => {
          for (const name of names) {
            try {
              const hasFactory = typeof tf.findBackendFactory === 'function' 
                ? tf.findBackendFactory(name) 
                : (tf as any).engine?.().registry?.[name];
              
              if (hasFactory) {
                const ok = await tf.setBackend(name);
                if (ok) {
                  console.log(`TensorFlow backend set to: ${name}`);
                  return name;
                }
              }
            } catch (e) {
              console.warn(`Failed to set backend ${name}:`, e);
            }
          }
          return null;
        };

        let selected = await tryBackends([backend]);
        if (!selected) {
          // Fallback to other backends
          const fallbacks = backend === 'webgl' ? ['cpu'] : ['webgl'];
          selected = await tryBackends(fallbacks);
        }

        if (!selected) {
          throw new Error(`No TensorFlow backend found. Tried: ${backend}, ${backend === 'webgl' ? 'cpu' : 'webgl'}`);
        }

        await tf.ready();
        console.log('TensorFlow.js loaded and ready');
      }

      this.isLoaded = true;
      if (typeof window !== 'undefined') {
        window.tensorflowLoaded = true;
      }

    } catch (error) {
      console.error('Failed to load TensorFlow.js:', error);
      this.loadingPromise = null; // Reset so we can try again
      throw error;
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private async loadWithFallbacks(urls: string[]): Promise<void> {
    let lastError: any;
    
    for (const url of urls) {
      try {
        await this.loadScript(url);
        return;
      } catch (error) {
        lastError = error;
        console.warn(`Failed to load ${url}, trying next...`);
      }
    }
    
    throw lastError || new Error(`Failed to load any of: ${urls.join(', ')}`);
  }

  async loadFaceLandmarksDetection(): Promise<void> {
    if (typeof window !== 'undefined' && window.faceLandmarksDetection) {
      return Promise.resolve();
    }

    try {
      console.log('Loading Face Landmarks Detection...');
      
      await this.loadWithFallbacks([
        '/parallellabs/face-landmarks-detection.js',
        'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection',
        'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection/dist/face-landmarks-detection.min.js',
        'https://unpkg.com/@tensorflow-models/face-landmarks-detection',
        'https://unpkg.com/@tensorflow-models/face-landmarks-detection/dist/face-landmarks-detection.min.js',
      ]);

      console.log('Face Landmarks Detection loaded');
    } catch (error) {
      console.error('Failed to load Face Landmarks Detection:', error);
      throw error;
    }
  }

  async loadAnalysisScript(): Promise<void> {
    if (typeof window !== 'undefined' && window.analyseCriteria) {
      return Promise.resolve();
    }

    try {
      console.log('Loading Analysis Script...');
      
      await this.loadWithFallbacks([
        '/parallellabs/analysis.js',
        '/public/parallellabs/analysis.js',
      ]);

      // Setup database if available
      try {
        const setupDb = (window as any).setupDatabase;
        if (typeof setupDb === 'function' && !(window as any).database) {
          (window as any).database = await setupDb();
        }
      } catch (e) {
        console.warn('Falling back to empty database entries', e);
        (window as any).database = (window as any).database || { entries: {} };
      }

      console.log('Analysis Script loaded');
    } catch (error) {
      console.error('Failed to load Analysis Script:', error);
      throw error;
    }
  }

  // Public method to check if TensorFlow is loaded
  isTensorFlowLoaded(): boolean {
    return this.isLoaded && typeof window !== 'undefined' && !!window.tf;
  }

  // Public method to get TensorFlow instance
  getTensorFlow(): any {
    return typeof window !== 'undefined' ? window.tf : null;
  }

  // Public method to get Face Landmarks Detection
  getFaceLandmarksDetection(): any {
    return typeof window !== 'undefined' ? window.faceLandmarksDetection : null;
  }
}

// Export singleton instance
export const tensorFlowLoader = TensorFlowLoader.getInstance();

// Convenience function for easy usage
export async function ensureTensorFlow(config?: TensorFlowConfig): Promise<void> {
  return tensorFlowLoader.loadTensorFlow(config);
}

export async function ensureFaceLandmarksDetection(): Promise<void> {
  await ensureTensorFlow();
  return tensorFlowLoader.loadFaceLandmarksDetection();
}

export async function ensureAnalysisScript(): Promise<void> {
  await ensureTensorFlow();
  await ensureFaceLandmarksDetection();
  return tensorFlowLoader.loadAnalysisScript();
}
