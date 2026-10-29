(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const categoryFilter = $("[data-forum-category]");
  const searchInput = $("[data-forum-search]");
  const sortInput = $("[data-forum-sort]");
  const status = $("[data-forum-status]");
  const threadList = $("[data-forum-threads]");
  const categoryList = $("[data-forum-categories]");
  const threadView = $("[data-thread-view]");
  const threadDetail = $("[data-thread-detail]");
  const threadForm = $("[data-thread-form]");
  const replyForm = $("[data-reply-form]");
  const nicknameKey = "southern-oregon-angler-forum-nickname";
  let activeThreadId = null;
  let searchTimer;

  function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.className = isError ? "form-status form-status--error" : "form-status";
  }

  async function request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { Accept: "application/json", ...options.headers }
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Forum request failed (${response.status}).`);
    return result;
  }

  function element(tag, text, className) {
    const item = document.createElement(tag);
    if (text !== undefined) item.textContent = text;
    if (className) item.className = className;
    return item;
  }

  function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
  }

  function postFormData(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function rememberNickname(value) {
    const nickname = String(value || "").trim();
    if (nickname) localStorage.setItem(nicknameKey, nickname);
    return nickname;
  }

  function fillSavedNickname() {
    const saved = localStorage.getItem(nicknameKey) || "";
    $("#forum-author").value = saved;
    $("#forum-reply-author").value = saved;
  }

  async function loadCategories() {
    const { categories } = await request("/api/forum/categories");
    categoryList.replaceChildren();
    for (const category of categories) {
      const item = element("li");
      const button = element("button", undefined, "forum-category-button");
      button.type = "button";
      button.append(element("span", category.name), element("span", String(category.threadCount), "forum-category-count"));
      button.addEventListener("click", () => {
        categoryFilter.value = category.name;
        loadThreads();
      });
      item.append(button);
      categoryList.append(item);
    }
  }

  async function loadThreads() {
    const params = new URLSearchParams();
    if (categoryFilter.value) params.set("category", categoryFilter.value);
    if (searchInput.value.trim()) params.set("q", searchInput.value.trim());
    params.set("sort", sortInput.value);
    setStatus(status, "Loading discussions…");
    try {
      const { threads } = await request(`/api/forum/threads?${params}`);
      threadList.replaceChildren();
      if (!threads.length) {
        threadList.append(element("p", "No discussions match yet. Start a new conversation.", "log-empty"));
      }
      for (const thread of threads) {
        const card = element("article", undefined, "forum-thread-card");
        const open = element("button", undefined, "forum-thread-card__open");
        open.type = "button";
        open.dataset.threadId = thread.id;
        const meta = element("span", `${thread.category} · Started by ${thread.author}`, "eyebrow");
        const heading = element("strong", thread.title);
        const preview = element("span", thread.body, "forum-thread-card__preview");
        const footerText = `${thread.reply_count} ${thread.reply_count === 1 ? "reply" : "replies"} · ${thread.last_reply_author ? `Last reply by ${thread.last_reply_author}` : "No replies yet"} · ${formatDate(thread.updated_at)}`;
        open.append(meta, heading, preview, element("span", footerText, "forum-thread-card__meta"));
        open.addEventListener("click", () => openThread(thread.id));
        card.append(open);
        threadList.append(card);
      }
      setStatus(status, `${threads.length} ${threads.length === 1 ? "discussion" : "discussions"} shown.`);
      await loadCategories();
    } catch (error) {
      threadList.replaceChildren(element("p", "Start the forum server using the instructions in the project README to load shared discussions.", "log-empty"));
      setStatus(status, `Could not connect to the shared forum: ${error.message}`, true);
    }
  }

  function renderThread(thread) {
    threadDetail.replaceChildren();
    const article = element("article", undefined, "forum-post forum-post--original");
    article.append(
      element("p", `${thread.category} · Started by ${thread.author} · ${formatDate(thread.created_at)}`, "eyebrow"),
      element("h2", thread.title),
      element("p", thread.body, "forum-post__body")
    );
    threadDetail.append(article);
    const repliesHeading = element("h3", `Replies (${thread.replies.length})`);
    threadDetail.append(repliesHeading);
    if (!thread.replies.length) {
      threadDetail.append(element("p", "No replies yet. Be the first to join in.", "field-help"));
    }
    for (const reply of thread.replies) {
      const replyCard = element("article", undefined, "forum-post forum-post--reply");
      replyCard.append(
        element("p", `${reply.author} · ${formatDate(reply.created_at)}`, "eyebrow"),
        element("p", reply.body, "forum-post__body")
      );
      threadDetail.append(replyCard);
    }
  }

  async function openThread(threadId) {
    setStatus(status, "Loading discussion…");
    try {
      const { thread } = await request(`/api/forum/threads/${encodeURIComponent(threadId)}`);
      activeThreadId = thread.id;
      renderThread(thread);
      threadView.hidden = false;
      threadView.scrollIntoView({ behavior: "smooth", block: "start" });
      setStatus(status, "");
    } catch (error) {
      setStatus(status, `Could not open that discussion: ${error.message}`, true);
    }
  }

  threadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!threadForm.reportValidity()) return;
    const submit = threadForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    setStatus($("[data-thread-status]"), "Publishing discussion…");
    const fields = postFormData(threadForm);
    fields.author = rememberNickname(fields.author);
    try {
      const { thread } = await request("/api/forum/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      });
      threadForm.reset();
      $("#forum-category").value = thread.category;
      fillSavedNickname();
      threadForm.closest("details").open = false;
      setStatus($("[data-thread-status]"), "Discussion published.");
      categoryFilter.value = "";
      searchInput.value = "";
      await loadThreads();
      await openThread(thread.id);
    } catch (error) {
      setStatus($("[data-thread-status]"), error.message, true);
    } finally {
      submit.disabled = false;
    }
  });

  replyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!activeThreadId || !replyForm.reportValidity()) return;
    const submit = replyForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    setStatus($("[data-reply-status]"), "Posting reply…");
    const fields = postFormData(replyForm);
    fields.author = rememberNickname(fields.author);
    try {
      const { thread } = await request(`/api/forum/threads/${encodeURIComponent(activeThreadId)}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      });
      replyForm.elements.body.value = "";
      renderThread(thread);
      setStatus($("[data-reply-status]"), "Reply posted.");
      await loadThreads();
    } catch (error) {
      setStatus($("[data-reply-status]"), error.message, true);
    } finally {
      submit.disabled = false;
    }
  });

  $("[data-back-to-list]").addEventListener("click", () => {
    threadView.hidden = true;
    activeThreadId = null;
  });
  $("[data-forum-refresh]").addEventListener("click", loadThreads);
  categoryFilter.addEventListener("change", loadThreads);
  sortInput.addEventListener("change", loadThreads);
  searchInput.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(loadThreads, 250);
  });
  fillSavedNickname();
  loadThreads();
})();
