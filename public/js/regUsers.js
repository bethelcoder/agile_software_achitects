document.querySelector('form').addEventListener('submit', function (e) {
const roleCheckboxes = document.querySelectorAll('input[name="roles"]');
const isChecked = Array.from(roleCheckboxes).some(cb => cb.checked);

if (!isChecked) {
    e.preventDefault();
    alert("Please select at least one role (Client or Freelancer).");
}
});

