const loggeduser = sessionStorage.getItem("loggeduser");
const content_block = document.querySelector("#content_block");


document.querySelector("#welcomer").textContent = loggeduser;


function getcontent(){
    return fetch("http://localhost:3000/posts")
    .then(raw_data => {
        if(!raw_data.ok)
            throw new Error("Can not accest the network")
        return raw_data.json();
    });
}


function post_maker(element){

    const post = document.createElement("div");
    const post_header = document.createElement("h3");
    const post_content = document.createElement("p");
    const post_writer = document.createElement("span");


    post.classList.add("post_block");

    post_header.textContent = element.title;
    post_content.textContent = element.content;
    post_writer.textContent = element.adder;

    post.appendChild(post_writer);
    post.appendChild(post_header);
    post.appendChild(post_content);

    content_block.prepend(post);

}

function post_loader(){
    getcontent().then(posts => posts.forEach(element => {
        post_maker(element);
    }))
}

post_loader();