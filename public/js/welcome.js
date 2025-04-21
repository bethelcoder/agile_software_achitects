const profile= document.getElementById("profile");

profile.addEventListener('click',()=>{
    const userId = document.body.dataset.userid;
  window.location.href = `/submit-clientProfile?userID=${userId}`;

})