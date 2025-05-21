document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  const roleCheckboxes = document.querySelectorAll('input[name="roles"]');


  roleCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        roleCheckboxes.forEach(otherCb => {
          if (otherCb !== cb) {
            otherCb.checked = false;
          }
        });
      }
    });
  });


  if (form) {
    form.addEventListener('submit', function (e) {
      const hasSelectedRole = Array.from(roleCheckboxes).some(cb => cb.checked);

      if (!hasSelectedRole) {
        e.preventDefault();
        alert("Please select at least one role (Client or Freelancer).");
      }
    });
  } else {
    console.warn('Form not found.');
  }
});