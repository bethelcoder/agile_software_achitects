document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("application-modal");
    //const aiModal = document.getElementById("aiHire-modal");
    const closeBtn = document.querySelector(".close-btn");
  
    const modalUsername = document.getElementById("modal-username");
    const modalSkills = document.getElementById("modal-skills");
    const modalLinks = document.getElementById("modal-links");
    const modalMessage = document.getElementById("modal-message");
  
    const viewButtons = document.querySelectorAll(".view-details-btn");
    const aiButton = document.querySelectorAll(".ai-details-btn");
    const ClientName = document.getElementById("clientName").value;
    const freelancerName = viewButtons[0].getAttribute("data-username");
    const projectId = document.getElementById("projectId").value;
    const budget = viewButtons[0].getAttribute("data-budget");
    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const username = btn.getAttribute("data-username");
        const skills = btn.getAttribute("data-skills");
        const links = btn.getAttribute("data-links");
        const message = btn.getAttribute("data-message");
        
        
        
        modalUsername.textContent = username;
        modalSkills.textContent = skills;
        modalLinks.textContent = links;
        modalMessage.textContent = message;
  
        modal.classList.remove("hidden");
      });
    });
  
    // aiButton.forEach((btn) => {
    //   btn.addEventListener("click", () => {
    //     const username = btn.getAttribute("data-username");
    //     const skills = btn.getAttribute("data-skills");
    //     const links = btn.getAttribute("data-links");
    //     const message = btn.getAttribute("data-message");

        
        
    //     modalUsername.textContent = username;
    //     modalSkills.textContent = skills;
    //     modalLinks.textContent = links;
    //     modalMessage.textContent = message;
  
    //     modal.classList.remove("hidden");
    //   });
    // });
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  
    document.querySelector(".hire-btn")?.addEventListener("click", () => {
      //window.location.href = `projects/${projectId}/accept?clientName=${ClientName}&freelancerName=${freelancerName}`;
      
      fetch(`/projects/${projectId}/accept?clientName=${ClientName}&freelancerName=${freelancerName}`, {
        method: "PATCH"
      })
      .then(res => res.json())
      .then(data => {
        alert(`Freelancer Hired! Budget is ${budget}`);
        modal.classList.add("hidden");
        window.location.href = data.redirectTo;
      })
      .catch(err => {
        console.error(err);
        alert("Failed to hire freelancer.");
      });

      modal.classList.add("hidden");
    });
  });
  