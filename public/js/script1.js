const button = document.getElementById("sub");

button.addEventListener('click',()=>{
    const name= document.getElementById("name").value.trim();
    const lname= document.getElementById("lname").value.trim();
    const rolesSelect = document.getElementById('roles');

    const selectedRole = rolesSelect.value;
    if (!name || !lname || !selectedRole){
        const p=document.getElementById('tt1');
        p.innerHTML="**Some fields missing";
        p.style.color = "red"

        setTimeout(() => {
            p.innerHTML = ""; // Clear after 3 seconds
        }, 2000);
    }
    else{
        const queryString = `?name=${encodeURIComponent(name)}&lname=${encodeURIComponent(lname)}&role=${encodeURIComponent(selectedRole)}`;
        window.location.href = `/profile1${queryString}`;
    }

    

//    alert("button clicked");
})