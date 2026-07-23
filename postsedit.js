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
    const post_header = document.createElement("h3");
    const post_content = document.createElement("p");
    const post_writer = document.createElement("span");
    const post_edit = document.createElement("a");
    const post_delete = document.createElement("button");


    post.classList.add("post_block");
    post_edit.classList.add("rewrite_link");
    post_delete.classList.add("delete_button");


    post_header.textContent = element.title;
    post_content.textContent = element.content;
    post_writer.textContent = element.adder;
    post_edit.href = `postrewrite.html?id=${element._id}`;
    post_edit.textContent = "rewrite the post";
    post_delete.textContent = "Delete post";

    post.appendChild(post_writer);
    post.appendChild(post_edit);
    post.appendChild(post_delete);
    post.appendChild(post_header);
    post.appendChild(post_content);
    

    content_block.prepend(post);


    post_delete.addEventListener("click",() => {
        delete_post(element._id);
    })

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


