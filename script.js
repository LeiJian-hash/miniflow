// MiniFlow - 简单本地社交动态应用
// 数据存储在 localStorage，支持发布与查看

(function () {
  "use strict";

  var STORAGE_KEY = "miniflow_posts";
  var MAX_CHARS = 280;

  var contentInput = document.getElementById("content-input");
  var publishBtn = document.getElementById("publish-btn");
  var charCount = document.getElementById("char-count");
  var feedList = document.getElementById("feed-list");

  // ---------- 数据层 ----------
  function loadPosts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function formatTime(timestamp) {
    var d = new Date(timestamp);
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" +
      pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  // 渲染单条动态的 HTML（对内容做转义，防 XSS）
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c];
    });
  }

  // ---------- 渲染 ----------
  function render() {
    var posts = loadPosts();
    feedList.innerHTML = "";

    if (posts.length === 0) {
      var empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "还没有动态，发一条吧～";
      feedList.appendChild(empty);
      return;
    }

    posts.forEach(function (post) {
      var li = document.createElement("li");
      li.className = "post";
      li.innerHTML =
        '<div class="avatar">' + escapeHtml(post.author.charAt(0)) + "</div>" +
        '<div class="post-body">' +
          '<div class="post-meta">' +
            '<span class="post-author">' + escapeHtml(post.author) + "</span>" +
            '<span class="post-time">' + formatTime(post.createdAt) + "</span>" +
          "</div>" +
          '<p class="post-content">' + escapeHtml(post.content) + "</p>" +
          '<div class="post-actions">' +
            '<button class="btn-delete" data-id="' + post.id + '">删除</button>' +
          "</div>" +
        "</div>";
      feedList.appendChild(li);
    });
  }

  // ---------- 交互 ----------
  function updateCharCount() {
    var len = contentInput.value.length;
    charCount.textContent = len + " / " + MAX_CHARS;
    charCount.classList.toggle("exceeded", len > MAX_CHARS);
    publishBtn.disabled = len === 0 || len > MAX_CHARS;
  }

  function publish() {
    var content = contentInput.value.trim();
    if (!content || content.length > MAX_CHARS) return;

    var posts = loadPosts();
    posts.unshift({
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      author: "我",
      content: content,
      createdAt: Date.now()
    });
    savePosts(posts);

    contentInput.value = "";
    updateCharCount();
    render();
  }

  function deletePost(id) {
    var posts = loadPosts().filter(function (p) {
      return p.id !== id;
    });
    savePosts(posts);
    render();
  }

  publishBtn.addEventListener("click", publish);

  contentInput.addEventListener("input", updateCharCount);

  contentInput.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") publish();
  });

  feedList.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-delete")) {
      deletePost(e.target.getAttribute("data-id"));
    }
  });

  // 初始化
  updateCharCount();
  render();
})();
