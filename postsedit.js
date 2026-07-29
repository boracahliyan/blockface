const API_BASE_URL = "https://blockface.onrender.com";
const loggeduser = sessionStorage.getItem("loggeduser");
const content_block = document.querySelector("#content_block");
const menu_button = document.querySelector(".menu_button");





function getcontent(){
    return fetch(`${API_BASE_URL}/posts`)
    .then(raw_data => {
        if(!raw_data.ok)
            throw new Error("Cannot accest the network")
        return raw_data.json();
    });
}

function delete_post(post_id){
    if(confirm("Are you sure about deleting this post?")){
        fetch(`${API_BASE_URL}/posts/${post_id}`,{
            method: "DELETE"
        })
        .then(res =>{ 
            if(res.ok){
                alert("Post is deleted");
                window.location.reload();
            }else{
                alert("Failed to delete post.")
            }
        })
        .catch(err => 
            console.error("Error",err)
        );
    }
}


function post_maker(element){


    const post = document.createElement("div");
    post.classList.add("window", "post_block");


    const titleBar = document.createElement("div");
    titleBar.classList.add("title-bar");

    const titleText = document.createElement("div");
    titleText.classList.add("title-bar-text");
    titleText.textContent = `Author: ${element.adder || "Anonymous"}`;

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

    
    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("post_actions");

    const post_edit = document.createElement("a");
    post_edit.classList.add("win-btn", "rewrite_link");
    post_edit.href = `postrewrite.html?id=${element._id}`;
    post_edit.textContent = "Rewrite Post";

    const post_delete = document.createElement("button");
    post_delete.classList.add("win-btn", "delete_button");
    post_delete.textContent = "Delete Post";

    actionsContainer.appendChild(post_edit);
    actionsContainer.appendChild(post_delete);

  
    const post_header = document.createElement("h3");
    post_header.classList.add("post_header");
    post_header.textContent = element.title;

    
    const post_image = document.createElement("img");
    post_image.src = element.image;

    const post_content = document.createElement("p");
    post_content.classList.add("post_content");
    post_content.textContent = element.content;


    const comment_button = document.createElement("button");
    comment_button.classList.add("win-btn");
    comment_button.classList.add("comment-button");
    comment_button.textContent = "Comments"


  
    windowBody.appendChild(actionsContainer);
    windowBody.appendChild(post_header);
    windowBody.appendChild(post_image);
    windowBody.appendChild(post_content);
    windowBody.appendChild(comment_button);

  
    post.appendChild(titleBar);
    post.appendChild(windowBody);
    

    content_block.prepend(post);


    post_delete.addEventListener("click", () => {
        delete_post(element._id);
    });

    comment_button.addEventListener("click", () => {
    window.location.href = `comments.html?id=${element._id}`;
    });
}

function post_loader(){
    getcontent().then(posts => posts.forEach(element => {
        if(element.adder == loggeduser){
        post_maker(element);}
    }))
}

post_loader();


menu_button.addEventListener("click",() => {
    window.location.href = "mainpage.html"
})


