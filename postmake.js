const API_BASE_URL = "https://blockface.onrender.com";
const writer = sessionStorage.getItem("loggeduser");
const content = document.querySelector(".content");
const title = document.querySelector(".title");
const publish_button = document.querySelector(".Publish");
const menu_button = document.querySelector(".menu_button");


document.querySelector(".logged").textContent = "Writer: "+ writer;


function publish_post(post){
    return fetch(`${API_BASE_URL}/posts`, {
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
        .then(() => {
            alert("Post is published");
            window.location.href = "postsedit.html";
        })

})

menu_button.addEventListener("click",() => {
    window.location.href = "postsedit.html"
})


