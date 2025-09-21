// Polyfills for Excalidraw compatibility
import process from 'process'

// Make process available globally
if (typeof window !== 'undefined') {
  window.process = process
  window.global = window.global || window
}

// Ensure process.env is available
if (typeof process !== 'undefined' && !process.env) {
  process.env = {}
}

// Also make process available globally for Vite's internal files
if (typeof globalThis !== 'undefined') {
  globalThis.process = process
  globalThis.global = globalThis.global || globalThis
}

export {}
