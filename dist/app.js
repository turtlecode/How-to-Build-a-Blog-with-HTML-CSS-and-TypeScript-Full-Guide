"use strict";
// Blog data (example, stored locally; 
// in a real application, an API could be used)
let blogs = [
    { id: 1, title: "Turtles and Coding",
        content: "Content-1" },
    { id: 2, title: "Web Development 101",
        content: "Content-2" }
];
// Safely selecting DOM elements with type safety
const blogList = document.getElementById("blogList");
const addBlogButton = document.getElementById("addBlogButton");
const addModal = document.getElementById("addModal");
const closeAddModalBtn = document.querySelector("#addModal .close");
const addForm = document.getElementById("addForm");
const editModal = document.getElementById("editModal");
const closeEditModalBtn = document.querySelector("#editModal .close");
const editForm = document.getElementById("editForm");
let currentBlogId = null;
// Dynamically render blogs
function renderBlogs() {
    blogList.innerHTML = "";
    blogs.forEach((blog) => {
        const card = document.createElement("div");
        card.className = "blog-card";
        card.innerHTML = `
            <div>
                <h3>${blog.title}</h3>
                <p>${blog.content}</p>
            </div>
            <button class="delete-button" data-id="${blog.id}">Delete</button>
        `;
        card.addEventListener("click", (event) => {
            if (!event.target.classList.contains("delete-button")) {
                showEditModal(blog);
            }
        });
        blogList.appendChild(card);
    });
    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", (event) => {
            // Used Event instead of MouseEvent
            event.stopPropagation();
            const id = parseInt(button.dataset.id || "0");
            deleteBlog(id);
        });
    });
}
// Show add blog modal
function showAddModal() {
    addModal.style.display = "block";
}
// Close modal
function closeAddModal() {
    addModal.style.display = "none";
}
function closeEditModal() {
    editModal.style.display = "none";
    currentBlogId = null;
}
// Add new blog
function addBlog(event) {
    event.preventDefault();
    const titleInput = document.getElementById("addTitle");
    const contentInput = document.getElementById("addContent");
    const newBlog = {
        id: Date.now(), // Unique ID using timestamp
        title: titleInput.value,
        content: contentInput.value
    };
    blogs.push(newBlog);
    renderBlogs();
    closeAddModal();
    titleInput.value = "";
    contentInput.value = "";
}
// Show edit blog modal
function showEditModal(blog) {
    currentBlogId = blog.id;
    const titleInput = document.getElementById("editTitle");
    const contentInput = document.getElementById("editContent");
    titleInput.value = blog.title;
    contentInput.value = blog.content;
    editModal.style.display = "block";
}
// Update blog
function updateBlog(event) {
    event.preventDefault();
    if (currentBlogId !== null) {
        const titleInput = document.getElementById("editTitle");
        const contentInput = document.getElementById("editContent");
        const updatedBlog = {
            id: currentBlogId,
            title: titleInput.value,
            content: contentInput.value
        };
        blogs = blogs.map(blog => blog.id === currentBlogId ? updatedBlog : blog);
        renderBlogs();
        closeEditModal();
    }
}
// Delete blog
function deleteBlog(id) {
    blogs = blogs.filter(blog => blog.id !== id);
    renderBlogs();
}
// Event listeners
addBlogButton.addEventListener("click", showAddModal);
closeAddModalBtn.addEventListener("click", closeAddModal); // Updated variable name
addForm.addEventListener("submit", addBlog);
closeEditModalBtn.addEventListener("click", closeEditModal); // Updated variable name
editForm.addEventListener("submit", updateBlog);
// Render blogs when the page loads
document.addEventListener("DOMContentLoaded", renderBlogs);
// Close modal when clicking outside
window.addEventListener("click", (event) => {
    if (event.target === addModal) {
        closeAddModal();
    }
    if (event.target === editModal) {
        closeEditModal();
    }
});
