const API_BASE_URL = "https://blockface.onrender.com";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get('id');
const menu_button = document.querySelector(".menu_button");




function getcontent(){
    return fetch(`${API_BASE_URL}/posts`)
    .then(raw_data => {
        if(!raw_data.ok)
            throw new Error("Can not accest the network")
        return raw_data.json();
    });
}



function post_maker(element){

   // Create Window Container
    const post = document.createElement("div");
    post.classList.add("window", "post_block");

    // Title Bar Structure
    const titleBar = document.createElement("div");
    titleBar.classList.add("title-bar");

    const titleText = document.createElement("div");
    titleText.classList.add("title-bar-text");
    titleText.textContent = `Edit Post — ${element.adder || "Anonymous"}`;

    const titleControls = document.createElement("div");
    titleControls.classList.add("title-bar-controls");
    titleControls.innerHTML = `
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
    `;

    titleBar.appendChild(titleText);
    titleBar.appendChild(titleControls);

    // Window Body
    const windowBody = document.createElement("div");
    windowBody.classList.add("window-body");

    // Title Input Group
    const titleGroup = document.createElement("div");
    titleGroup.classList.add("field-group");
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title:";
    const post_header = document.createElement("input");
    post_header.type = "text";
    post_header.value = element.title;
    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(post_header);

    // Content Textarea Group
    const contentGroup = document.createElement("div");
    contentGroup.classList.add("field-group");
    const contentLabel = document.createElement("label");
    contentLabel.textContent = "Content:";
    const post_content = document.createElement("textarea");
    post_content.value = element.content;
    contentGroup.appendChild(contentLabel);
    contentGroup.appendChild(post_content);

    // Save Button
    const save_button = document.createElement("button");
    save_button.classList.add("win-btn", "save_btn");
    save_button.textContent = "Save Changes";

    save_button.addEventListener("click", () => {
        const updatedPost = {
            title: post_header.value,
            content: post_content.value
        };

        fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPost)
        })
        .then(res => {
            if (res.ok) {
                alert("Post updated successfully!");
                window.location.href = "postsedit.html";
            } else {
                alert("Failed to update post.");
            }
        })
        .catch(err => console.error("Error updating post:", err));
    });

    // Assemble Body
    windowBody.appendChild(titleGroup);
    windowBody.appendChild(contentGroup);
    windowBody.appendChild(save_button);

    // Assemble Full Window
    post.appendChild(titleBar);
    post.appendChild(windowBody);

    content_block.prepend(post);

}



function post_loader(){
    getcontent().then(posts => posts.forEach(element => {
        if(element._id == postId){
        post_maker(element);}
    }))
}

post_loader();


menu_button.addEventListener("click",() => {
    window.location.href = "postsedit.html"
})