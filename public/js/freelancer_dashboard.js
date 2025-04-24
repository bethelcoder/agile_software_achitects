  document.addEventListener("DOMContentLoaded", () => {
    const flashMessages = document.querySelectorAll('.flash-message');

    flashMessages.forEach(msg => {
      setTimeout(() => {
        msg.classList.add('fade-out');
        setTimeout(() => msg.remove(), 800); // Remove from DOM after fade
      }, 3000); // Auto-dismiss after 3s
    });
  });

  

