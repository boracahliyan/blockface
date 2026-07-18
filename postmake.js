const writer = sessionStorage.getItem("loggeduser");
const content = document.querySelector(".content");
const title = document.querySelector(".title");
const publish_button = document.querySelector(".Publish");


document.querySelector(".logged").textContent = writer;


function publish_post(post){
    fetch("http://localhost:3000/posts",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(post)

    })
}

function post_maker(){
    
    return{
        title: title.value,
        content: content.value,
        adder: writer
    }

}


publish_button.addEventListener("click",() => {

    const post = post_maker();

    publish_post(post)

    alert("Post is published");
    window.location.href = "mainpage.html";

})


