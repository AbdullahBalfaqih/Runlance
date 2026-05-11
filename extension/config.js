// Configuration for Career AI extension
const CONFIG = {
  // Change this to your production URL after deployment (e.g., https://career-ai.vercel.app)
  BASE_URL: 'https://runlance.vercel.app',
  API_PATH: '/api',
  OVERLAY_PATH: '/avatar-overlay',
  DASHBOARD_PATH: '/dashboard'
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
