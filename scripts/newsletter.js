const signupLink = document.querySelector("[data-newsletter-signup]");
const signupMessage = document.querySelector("[data-newsletter-setup-message]");
const signupUrl = window.NEWSLETTER_SIGNUP_URL;

if (signupUrl) {
  try {
    const url = new URL(signupUrl);
    if (url.protocol !== "https:") throw new Error("The signup form URL must use HTTPS.");
    signupLink.href = url.href;
    signupLink.hidden = false;
    signupMessage.textContent = "Signup is handled securely by our mailing-list provider.";
  } catch (error) {
    signupMessage.textContent = error.message || "The mailing-list signup URL is invalid.";
    signupMessage.className = "form-status form-status--error";
    console.error(error);
  }
}
