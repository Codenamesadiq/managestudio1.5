/**
 * ManageStudio Client API Configuration
 * 
 * - In development (import.meta.env.DEV): Relative URL ('') uses Vite's proxy to localhost:3001
 * - In production: Points to Render SaaS backend (https://studio-manager-saas.onrender.com)
 *   or custom VITE_API_URL override if provided.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
