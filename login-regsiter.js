const button = document.querySelector("#summit_button");
const username = document.querySelector("#username");
const password = document.querySelector("#password");


const button_R = document.querySelector("#summit_button1");
const username_R = document.querySelector("#username1");
const password_R = document.querySelector("#password1");




function getusers(){
    return fetch("http://localhost:3000/users")
    .then(raw_data => {
        if(!raw_data.ok)
            throw new Error("Can not accest the network")
        return raw_data.json();
    });
}


function usernamechecker(Name){

   return getusers().then(users => {
        return users.some(user => user.name == Name);
    })


}

function userchecker(element){

     getusers().then(users => {


       const matchedUser = users.find(user => 
            username.value === user.name && password.value == user.password);
            document.querySelector("#info_sec").innerHTML = "";
            if(matchedUser){
                
                sessionStorage.setItem("loggeduser",matchedUser.name);
                  window.location.href = "mainpage.html";


            }else{
                
                let info = document.createElement("p");
                info.textContent = "Username or password is incorrect"
                document.querySelector("#info_sec").appendChild(info);
            
            }
            

       

    });
     
}



button.addEventListener("click",()=> userchecker())


//register part





button_R.addEventListener("click",() => {

    document.querySelector("#info_sec1").innerHTML = "";

    const new_user = new_user_writer(username_R.value,password_R.value);



    usernamechecker(new_user.name).then(answer => {
        if(!answer){
             upload_user(new_user);
             document.querySelector("#info_sec1").textContent = "Account is added please enter with login";
        }else{
             document.querySelector("#info_sec1").textContent = "Username is taken please choose a another username";
        }
    })


})



function new_user_writer(user_placeholder,pass_placeholder){
   return {
    name: user_placeholder,
    password: pass_placeholder
    };
}




function upload_user(new_user){

    fetch("http://localhost:3000/users",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(new_user)  
    })

}

