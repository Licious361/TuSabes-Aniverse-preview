// Public configuration — no passwords, API keys, or private customer data.
// Cloudflare Pages only: enable AFTER binding WAITLIST, approving privacy,
// configuring abuse controls, and testing valid/invalid/duplicate submissions.
// On GitHub Pages, leave signupEnabled=false because Pages cannot execute Functions.
window.ANIVERSE_CONFIG=Object.freeze({
  signupEnabled:false,
  signupEndpoint:"/api/signup"
});
