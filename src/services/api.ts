
// Legacy API file - now imports from decomposed modules
// This maintains backward compatibility

// Re-export everything from the new modular structure
export * from './index';

// Import the legacy default export
import { API } from './apiConfig';
export default API;
