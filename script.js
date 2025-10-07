// 初始化
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["未分類"];
let editIndex = null;

const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const saveBtn = document.getElementById("saveBtn");
const postList = document.getElementById("postList");
const categorySelect = document.getElementById("categorySelect");
const newCategoryInput = document.getElementById("newCategoryInput");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoryList = document.getElementById("categoryList");
const imageInput = document.getElementById("imageInput");

// 渲染分類選單
function renderCategories() {
  categorySelect.innerHTML = "";
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  categoryList.innerHTML = "";
  categories.forEach((cat, index) => {
    const div = document.createElement("div");
    div.className = "category-tag";
    div.innerHTML = `${cat} <span onclick="deleteCategory(${index})">✖</span>`;
    categoryList.appendChild(div);
  });
  localStorage.setItem("categories", JSON.stringify(categories));
}

// 新增分類
addCategoryBtn.addEventListener("click", () => {
  const newCat = newCategoryInput.value.trim();
  if (!newCat) return alert("請輸入分類名稱");
  if (categories.includes(newCat)) return alert("分類已存在");
  categories.push(newCat);
  newCategoryInput.value = "";
  renderCategories();
});

// 刪除分類
function deleteCategory(index) {
  if (categories[index] === "未分類") return alert("不能刪除預設分類");
  const cat = categories[index];
  if (confirm(`確定要刪除分類「${cat}」嗎？`)) {
    posts = posts.map(p => p.category === cat ? { ...p, category: "未分類" } : p);
    categories.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderCategories();
    renderPosts();
  }
}

// 渲染文章
function renderPosts() {
  postList.innerHTML = "";
  posts.forEach((post, index) => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h3>${post.title}</h3>
      <small>分類：${post.category}</small>
      <p>${post.content}</p>
      ${post.image ? `<img src="${post.image}" alt="封面圖">` : ""}
      <button onclick="editPost(${index})">✏️ 編輯</button>
      <button class="delete" onclick="deletePost(${index})">🗑 刪除</button>
    `;
    postList.appendChild(div);
  });
}

// 儲存文章
saveBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const category = categorySelect.value;
  const file = imageInput.files[0];

  if (!title || !content) return alert("標題與內容都要填寫");

  // 將圖片轉成 Base64 儲存
  const saveData = (imgBase64 = null) => {
    const postData = { title, content, category, image: imgBase64 };

    if (editIndex !== null) {
      posts[editIndex] = postData;
      editIndex = null;
      saveBtn.textContent = "儲存文章";
    } else {
      posts.push(postData);
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    titleInput.value = "";
    contentInput.value = "";
    imageInput.value = "";
    renderPosts();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = e => saveData(e.target.result);
    reader.readAsDataURL(file);
  } else {
    saveData();
  }
});

// 編輯文章
function editPost(index) {
  const post = posts[index];
  titleInput.value = post.title;
  contentInput.value = post.content;
  categorySelect.value = post.category;
  editIndex = index;
  saveBtn.textContent = "更新文章";
}

// 刪除文章
function deletePost(index) {
  if (confirm("確定要刪除這篇文章嗎？")) {
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
}

// 初始化
renderCategories();
renderPosts();
