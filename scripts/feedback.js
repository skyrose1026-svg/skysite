const feedbackForm = document.querySelector("[data-feedback-form]");

if (feedbackForm) {
  const status = document.querySelector("[data-feedback-status]");
  const linkContainer = document.querySelector("[data-feedback-link-container]");

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!feedbackForm.reportValidity()) return;

    const formData = new FormData(feedbackForm);
    const page = String(formData.get("page") || "").trim();
    const details = String(formData.get("details") || "").trim();
    if (page) {
      try {
        const pageUrl = new URL(page);
        if (pageUrl.protocol !== "https:" && pageUrl.protocol !== "http:") {
          throw new Error("Use a valid web address for the guide page.");
        }
      } catch {
        status.textContent = "Enter a valid web address for the guide page, or leave it blank.";
        status.className = "form-status form-status--error";
        return;
      }
    }

    const issueUrl = new URL("https://github.com/skyrose1026-svg/skysite/issues/new");
    issueUrl.searchParams.set("title", "Guide correction suggestion");
    issueUrl.searchParams.set(
      "body",
      [
        "## Guide correction",
        "",
        `Page: ${page || "(not specified)"}`,
        "",
        details,
        "",
        "---",
        "Please do not include exact coordinates, private-property details, sensitive species locations, or personal information."
      ].join("\n")
    );

    const link = document.createElement("a");
    link.className = "button button--primary";
    link.href = issueUrl.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open prefilled correction issue";
    linkContainer.replaceChildren(link);
    linkContainer.hidden = false;
    status.textContent = "Your correction is ready. Review it on GitHub before submitting.";
    status.className = "form-status";
    link.focus();
  });
}
