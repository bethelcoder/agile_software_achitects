const pr = document.getElementById("AP");
//const activeProjects=document.getElementById("activeP");
const projects = window.projectData;
const projectButtons = [];


projects.forEach((pj) => {
  const container = document.createElement("div");
  container.classList.add("project-container");
  const userId = document.body.dataset.userid;
  
 
  const title = document.createElement("button");
  title.textContent = pj.title;
  title.classList.add("project-title");

 
  const details = document.createElement("div");
  details.classList.add("project-details");
  details.innerHTML = `
    <p><strong>Description:</strong> ${pj.description}</p>
    <p><strong>Min Pay:</strong> R${pj.minPay}</p>
    <p><strong>Deadline:</strong> ${pj.deadline}</p>
    <p><strong>Skills:</strong> ${pj.skills}</p>
  `;
  details.style.display = "none"; 

  title.addEventListener("click", () => {
    details.style.display = details.style.display === "none" ? "block" : "none";
  });

  container.appendChild(title);
  container.appendChild(details);
  //pr.appendChild(container);

  if (pj.clientID.toString()==userId){
    const container1 = document.createElement("div");
    container1.classList.add("project-container");

    const title = document.createElement("button");
    title.textContent = pj.title;
    title.classList.add("project-title");
    
    const details = document.createElement("div");
    details.classList.add("project-details");
    details.innerHTML = `
        <p><strong>Description:</strong> ${pj.description}</p>
        <p><strong>Min Pay:</strong> R${pj.minPay}</p>
        <p><strong>Deadline:</strong> ${pj.deadline}</p>
        <p><strong>Skills:</strong> ${pj.applicableSkills}</p>
    `;
    details.style.display = "none"; 
    const deleteb= document.createElement("button");
    deleteb.style.color="red";
    deleteb.innerHTML="Delete";
    details.appendChild(deleteb);

    title.addEventListener("click", () => {
        details.style.display = details.style.display === "none" ? "block" : "none";
    });

    deleteb.addEventListener("click",()=>{
         window.location.href = `/delete-project?data=${pj}&userId=${userId}`
    });

   

    

   
  }
  
});












// const profile = document.querySelector('#profile').parentElement;


// profile.addEventListener('click',()=>{
//     const userId = document.body.dataset.userid;
//   window.location.href = `/submit-clientProfile?userID=${userId}`;

// })

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