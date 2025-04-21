const profile = document.querySelector('#profile').parentElement;
//const profile= document.getElementById("profile");

profile.addEventListener('click',()=>{
    const userId = document.body.dataset.userid;
  window.location.href = `/submit-clientProfile?userID=${userId}`;

})

document.getElementById("addProject").addEventListener("click", () => {
    document.getElementById("jobModal").style.display = "block";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("jobModal").style.display = "none";
  });

  window.onclick = function (event) {
    const modal = document.getElementById("jobModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };



  document.getElementById("sub").addEventListener("click", () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const minPay = document.getElementById("minPay").value;
    const deadline = document.getElementById("deadline").value;
    const skills = document.getElementById("skills").value;
    const userId = document.body.dataset.userid;
    window.location.href = `/post-project?userID=${userId}&title=${title}&description=${description}&minPay=${minPay}&deadline=${deadline}&skills=${skills}`
   
  });

/*const dashboard=document.getElementById("dash");


dashboard.addEventListener('click',()=>{
    window.location.href = `/clientDashboard`;
})
    */