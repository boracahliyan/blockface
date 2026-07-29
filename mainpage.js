const API_BASE_URL = "https://blockface.onrender.com";
const loggeduser = sessionStorage.getItem("loggeduser");
const content_block = document.querySelector("#content_block");



function getcontent(){
    return fetch(`${API_BASE_URL}/posts`)
    .then(raw_data => {
        if(!raw_data.ok)
            throw new Error("Can not accest the network")
        return raw_data.json();
    });
}


function post_maker(element){

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


    const post_image = document.createElement("img");
    post_image.src = element.image;

    const post_content = document.createElement("p");
    post_content.classList.add("post_content");
    post_content.textContent = element.content;

   // --- EKLENEN KISIM: Action Bar (Like + Comment Butonları Kutusu) ---
    const actions_bar = document.createElement("div");
    actions_bar.classList.add("post_actions_bar");

    // Like Butonu
    let likesCount = element.likes || 0;
    const like_button = document.createElement("button");
    like_button.classList.add("win-btn", "like_button");
    like_button.textContent = `👍 Like (${likesCount})`;

    // Comment Butonu
    const comment_button = document.createElement("button");
    comment_button.classList.add("win-btn", "comment-button");
    comment_button.textContent = "Comments";

    actions_bar.appendChild(like_button);
    actions_bar.appendChild(comment_button);
    
    // -----------------------------------------------------------------

    windowBody.appendChild(post_header);
    windowBody.appendChild(post_image);
    windowBody.appendChild(post_content);
    windowBody.appendChild(actions_bar);

   
    post.appendChild(titleBar);
    post.appendChild(windowBody);

    content_block.prepend(post);


    like_button.addEventListener("click", () => {
        fetch(`${API_BASE_URL}/posts/${element._id}/like`, {
            method: "PATCH"
        })
        .then(res => {
            if (res.ok) {
                likesCount += 1;
                like_button.textContent = `👍 Like (${likesCount})`;
            } else {
                alert("Failed to like post.");
            }
        })
        .catch(err => console.error("Error liking post:", err));
    });

    comment_button.addEventListener("click", () => {
    window.location.href = `comments.html?id=${element._id}`;
    });


}

function post_loader(){
    getcontent().then(posts => posts.forEach(element => {
        post_maker(element);
    }))
}

post_loader();