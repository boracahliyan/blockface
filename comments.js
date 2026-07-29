const API_BASE_URL = "https://blockface.onrender.com";
const loggeduser = sessionStorage.getItem("loggeduser");
const content_block = document.querySelector("#content_block");


const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');


function load_page_content() {
    if (!postId) {
        content_block.innerHTML = "<h2 style='color: white;'>No Post ID found</h2>";
        return;
    }


    fetch(`${API_BASE_URL}/posts`)
        .then(res => res.json())
        .then(posts => {
            const currentPost = posts.find(p => p._id === postId);
            if (currentPost) {
                render_main_post(currentPost);
                render_comment_form();
                load_comments();
            } else {
                content_block.innerHTML = "<h2 style='color: white;'>Post not found</h2>";
            }
        })
        .catch(err => console.error("Error fetching post:", err));
}


function render_main_post(element) {
    const post = document.createElement("div");
    post.classList.add("window", "post_block");

    const titleBar = document.createElement("div");
    titleBar.classList.add("title-bar");

    const titleText = document.createElement("div");
    titleText.classList.add("title-bar-text");
    titleText.textContent = `Post by ${element.adder || "Anonymous"}`;

    const titleControls = document.createElement("div");
    titleControls.classList.add("title-bar-controls");
    titleControls.innerHTML = `
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
    `;

    titleBar.appendChild(titleText);
    titleBar.appendChild(titleControls);

    const windowBody = document.createElement("div");
    windowBody.classList.add("window-body");

    const post_header = document.createElement("h3");
    post_header.classList.add("post_header");
    post_header.textContent = element.title;

    windowBody.appendChild(post_header);

    if (element.image && element.image !== "undefined" && element.image !== "null") {
        const post_image = document.createElement("img");
        post_image.src = element.image;
        windowBody.appendChild(post_image);
    }

    const post_content = document.createElement("p");
    post_content.classList.add("post_content");
    post_content.textContent = element.content;

    windowBody.appendChild(post_content);
    post.appendChild(titleBar);
    post.appendChild(windowBody);

    content_block.appendChild(post);
}


function render_comment_form() {
    const formWindow = document.createElement("div");
    formWindow.classList.add("window", "comment_section");

    const titleBar = document.createElement("div");
    titleBar.classList.add("title-bar");
    const titleText = document.createElement("div");
    titleText.classList.add("title-bar-text");
    titleText.textContent = `Write a Comment: ${loggeduser}`;
    titleBar.appendChild(titleText);

    const windowBody = document.createElement("div");
    windowBody.classList.add("window-body");

    
    const comment_input = document.createElement("textarea");
    comment_input.classList.add("comment-input-area");
    comment_input.placeholder = "What are your thoughts?";

    const submit_button = document.createElement("button");
    submit_button.classList.add("win-btn");
    submit_button.textContent = "Post Comment";

    submit_button.addEventListener("click", () => {
        if (!comment_input.value.trim()) {
            alert("Comment cannot be empty!");
            return;
        }

        const newComment = {
            postId: postId,
            commenter: loggeduser || "Anonymous",
            text: comment_input.value
        };

        fetch(`${API_BASE_URL}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newComment)
        })
        .then(res => {
            if (res.ok) {
                comment_input.value = "";
                load_comments();
            } else {
                alert("Failed to post comment.");
            }
        })
        .catch(err => console.error("Error posting comment:", err));
    });

    windowBody.appendChild(comment_input);
    windowBody.appendChild(submit_button);
    formWindow.appendChild(titleBar);
    formWindow.appendChild(windowBody);

    content_block.appendChild(formWindow);
}


function load_comments() {
    
    const existingComments = document.querySelectorAll(".comment-item");
    existingComments.forEach(comment => comment.remove());

    fetch(`${API_BASE_URL}/comments/${postId}`)
        .then(res => res.json())
        .then(comments => {
            comments.forEach(comment => {
                const commentBox = document.createElement("div");
                commentBox.classList.add("window", "comment_section", "comment-item"); // comment-item temizleme için işaretçi

                const titleBar = document.createElement("div");
                titleBar.classList.add("title-bar");
                const titleText = document.createElement("div");
                titleText.classList.add("title-bar-text");
                titleText.textContent = `Comment by ${comment.commenter}`;
                titleBar.appendChild(titleText);

                const windowBody = document.createElement("div");
                windowBody.classList.add("window-body");

                const commentText = document.createElement("p");
                commentText.classList.add("comment_text");
                commentText.textContent = comment.text;

                windowBody.appendChild(commentText);
                commentBox.appendChild(titleBar);
                commentBox.appendChild(windowBody);

                content_block.appendChild(commentBox);
            });
        })
        .catch(err => console.error("Error loading comments:", err));
}


load_page_content();