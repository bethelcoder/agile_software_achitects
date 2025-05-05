function openModal(projectId) {
    document.getElementById('modal-' + projectId).style.display = 'block';
  }

  function closeModal(projectId) {
    document.getElementById('modal-' + projectId).style.display = 'none';
  }

  window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }