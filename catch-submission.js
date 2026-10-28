const catchForm = document.querySelector("[data-catch-submission-form]");
const catchStatus = document.querySelector("[data-catch-submission-status]");
const catchEndpoint = window.CATCH_SUBMISSION_ENDPOINT;

if (catchEndpoint) {
  try {
    const url = new URL(catchEndpoint);
    if (url.protocol !== "https:") {
      throw new Error("The catch submission endpoint must use HTTPS.");
    }
    catchForm.action = url.href;
    catchForm.hidden = false;
    catchStatus.textContent = "Your submission will be sent securely to our form provider and reviewed before anything is published.";
  } catch (error) {
    catchStatus.textContent = error.message || "The catch submission form is not configured correctly.";
    catchStatus.className = "form-status form-status--error";
    console.error(error);
  }
}

catchForm.addEventListener("submit", (event) => {
  const photo = catchForm.elements.namedItem("photo").files[0];
  if (!photo) return;
  if (!photo.type.startsWith("image/")) {
    event.preventDefault();
    catchStatus.textContent = "Choose an image file for your catch photo.";
    catchStatus.className = "form-status form-status--error";
  } else if (photo.size > 8 * 1024 * 1024) {
    event.preventDefault();
    catchStatus.textContent = "The photo must be 8 MB or smaller.";
    catchStatus.className = "form-status form-status--error";
  }
});
