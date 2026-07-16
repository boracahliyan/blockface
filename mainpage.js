const loggeduser = sessionStorage.getItem("loggeduser");


document.querySelector("#welcomer").textContent = loggeduser;