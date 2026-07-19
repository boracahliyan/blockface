const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get('id');
const menu_button = document.querySelector(".menu_button");




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
    const post_header = document.createElement("input");
    const post_content = document.createElement("textarea");
    const post_writer = document.createElement("span");
    const save_button = document.createElement("button");


    post.classList.add("post_block");

    post_header.value = element.title;
    post_content.value = element.content;
    post_writer.textContent = element.adder;
    save_button.textContent = "Save Changes";

    save_button.addEventListener("click", () => {
        const updatedPost = {
            title: post_header.value,
            content: post_content.value
        };

        fetch(`http://localhost:3000/posts/${postId}`, {
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

    

    post.appendChild(post_writer);
    post.appendChild(post_header);
    post.appendChild(post_content);
    post.appendChild(save_button);
    

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