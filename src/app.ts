// Blog type definition
interface Blog {
    id: number;
    title: string;
    content: string;
}

// Blog data (example, stored locally; 
// in a real application, an API could be used)
let blogs: Blog[] = [
    { id: 1, title: "Turtles and Coding", 
        content: "Content-1" },
    { id: 2, title: "Web Development 101", 
        content: "Content-2" }
];

// Safely selecting DOM elements with type safety
const blogList = document.getElementById("blogList") as HTMLDivElement;
const addBlogButton = document.getElementById("addBlogButton") as HTMLButtonElement;
const addModal = document.getElementById("addModal") as HTMLDivElement;
const closeAddModalBtn = document.querySelector("#addModal .close") as HTMLElement; 
const addForm = document.getElementById("addForm") as HTMLFormElement;
const editModal = document.getElementById("editModal") as HTMLDivElement;
const closeEditModalBtn = document.querySelector("#editModal .close") as HTMLElement; 
const editForm = document.getElementById("editForm") as HTMLFormElement;
let currentBlogId: number | null = null;

// Dynamically render blogs
function renderBlogs(): void {
    blogList.innerHTML = "";
    blogs.forEach((blog: Blog) => {
        const card = document.createElement("div");
        card.className = "blog-card";
        card.innerHTML = `
            <div>
                <h3>${blog.title}</h3>
                <p>${blog.content}</p>
            </div>
            <button class="delete-button" data-id="${blog.id}">Delete</button>
        `;
        card.addEventListener("click", (event: MouseEvent) => {
            if (!(event.target as HTMLElement).classList.contains("delete-button")) {
                showEditModal(blog);
            }
        });
        blogList.appendChild(card);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", (event: Event) => { 
            // Used Event instead of MouseEvent
            event.stopPropagation();
            const id = parseInt((button as HTMLButtonElement).dataset.id || "0");
            deleteBlog(id);
        });
    });
}

// Show add blog modal
function showAddModal(): void {
    addModal.style.display = "block";
}

// Close modal
function closeAddModal(): void {
    addModal.style.display = "none";
}

function closeEditModal(): void {
    editModal.style.display = "none";
    currentBlogId = null;
}

// Add new blog
function addBlog(event: Event): void {
    event.preventDefault();
    const titleInput = document.getElementById("addTitle") as HTMLInputElement;
    const contentInput = document.getElementById("addContent") as HTMLTextAreaElement;
    const newBlog: Blog = {
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
function showEditModal(blog: Blog): void {
    currentBlogId = blog.id;
    const titleInput = document.getElementById("editTitle") as HTMLInputElement;
    const contentInput = document.getElementById("editContent") as HTMLTextAreaElement;
    titleInput.value = blog.title;
    contentInput.value = blog.content;
    editModal.style.display = "block";
}

// Update blog
function updateBlog(event: Event): void {
    event.preventDefault();
    if (currentBlogId !== null) {
        const titleInput = document.getElementById("editTitle") as HTMLInputElement;
        const contentInput = document.getElementById("editContent") as HTMLTextAreaElement;
        const updatedBlog: Blog = {
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
function deleteBlog(id: number): void {
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
window.addEventListener("click", (event: MouseEvent) => {
    if (event.target === addModal) {
        closeAddModal();
    }
    if (event.target === editModal) {
        closeEditModal();
    }
});