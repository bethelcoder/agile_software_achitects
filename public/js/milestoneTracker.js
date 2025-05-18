document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector(".modal");
    const openBtns = document.querySelectorAll(".add-milestone-btn");
    const viewBtns = document.querySelectorAll(".view-milestone-btn");
    const closeBtn = document.querySelector(".modal .close");
    const openMilestoneDetails = document.querySelector(".open");
    //Milestone Tracker
    const newMilestone = document.querySelector(".new-milestone");
    const addMilestone = document.querySelector(".new-milestone-btn");
    const cancelMilestone = document.querySelector(".new-milestone .cancel-milestone");
    const endProject = document.querySelector(".end-project .project-completed");
    const submit = document.querySelector(".sub");
    //Milestone Details
    const MilestoneDetails = document.querySelector(".Milestone-details");
    const closeApproval = document.querySelector(".close-approval");
    const Reject = document.querySelector(".reject");
    const Approve = document.querySelector(".approve");

    openBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        const projectId = btn.getAttribute("data-project-id");
    
        try {
          const response = await fetch(`/projects/check-hired/${projectId}`);
          const data = await response.json();
    
          if (data.hired) {
            modal.classList.remove("hidden");
          } else {
            alert("No freelancer has been hired as of yet!");
          }
        } catch (error) {
          console.error("Error checking hired status:", error);
          alert("An error occurred while checking freelancer status.");
        }
      });
    });
    
      viewBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        const projectId = btn.getAttribute("data-project-id");
        
        try{
           window.location.href=`/projects/activeProjects/${projectId}`;
        } catch(err) {
          console.error(err);
        }
       
    });
  });

    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    addMilestone.addEventListener("click", () => {
      newMilestone.classList.remove("hidden");
      modal.classList.add("hidden");
    });

    cancelMilestone.addEventListener("click", () => {
      newMilestone.classList.add("hidden");
      modal.classList.remove("hidden");
    });
    endProject.addEventListener("click", () => {
      window.location.href = '/projects/reviewForm';
    });


    submit.addEventListener("click", () => {
      const milestoneName = document.getElementById("milestone").value;
      const description = document.getElementById("milestone-descript").value;
      const dueDate = document.getElementById("due-date").value;

      const tableBody = document.getElementById("table-body");

      // Create a new table row
      const newRow = document.createElement("tr");

      // Create table cells
      const nameCell = document.createElement("td");
      nameCell.textContent = milestoneName;

      const dateCell = document.createElement("td");
      dateCell.textContent = dueDate;

      const statusCell = document.createElement("td");
      statusCell.textContent = "Active"; // Default status

      newRow.addEventListener("click", () => {
        const milestoneTitle = MilestoneDetails.querySelector("h1");
        const milestoneDescription = MilestoneDetails.querySelector("#milestone");

        milestoneTitle.textContent = milestoneName;
        milestoneDescription.value = description;

        MilestoneDetails.classList.remove("hidden");

        const closeApproval = document.querySelector(".close-approval");
        closeApproval.addEventListener('click', () => {
          MilestoneDetails.classList.add("hidden");
          modal.classList.remove("hidden");
        }, { once: true }); // prevent multiple event listener stacking
      });


      // Append cells to row
      newRow.appendChild(nameCell);
      newRow.appendChild(dateCell);
      newRow.appendChild(statusCell);

      // Append row to table body
      tableBody.appendChild(newRow);

      document.getElementById("milestone").value = "";
      document.getElementById("milestone-descript").value = "";
      document.getElementById("due-date").value = "";

      newMilestone.classList.add("hidden");
      modal.classList.remove("hidden");
    });

    openMilestoneDetails.addEventListener('click', () => {
      MilestoneDetails.classList.remove("hidden");
      newMilestone.classList.add("hidden");
      modal.classList.add("hidden");
    });
    closeApproval.addEventListener('click', () => {
      MilestoneDetails.classList.add("hidden");
      modal.classList.remove("hidden");
    });
  });

//review form
const submitButton = document.getElementById("submit-review");

submitButton.addEventListener("click", (event) => {

  const selectedRating = document.querySelector('input[name="rating"]:checked');
  const ratingValue = selectedRating ? parseInt(selectedRating.value) : null;

  if (ratingValue !== null) {
    console.log("Rating submitted:", ratingValue);

  } else {
    alert("Please select a star rating before submitting.");
  }
});
