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

    const post_content = document.createElement("p");
    post_content.classList.add("post_content");
    post_content.textContent = element.content;

    windowBody.appendChild(post_header);
    windowBody.appendChild(post_content);

   
    post.appendChild(titleBar);
    post.appendChild(windowBody);

    content_block.prepend(post);

}

function post_loader(){
    getcontent().then(posts => posts.forEach(element => {
        post_maker(element);
    }))
}

post_loader();