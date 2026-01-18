// src/lib/api.ts
import { invoke } from '@tauri-apps/api/core';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Tauri runtime detection
  if (typeof window !== 'undefined' && (window as any).__TAURI__) {
    // Desktop: map endpoint to invoke command
    const command = endpoint.replace('/api/', '').replace(/\/.*/, '');
    const payload = { ...options.body, endpoint };
    return invoke(command, payload);
  } else {
    // Web: use native fetch
    const url = `${import.meta.env.PUBLIC_API_URL || ''}${endpoint}`;
    return fetch(url, options);
  }
}


