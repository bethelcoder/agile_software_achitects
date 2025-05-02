// Toggle the visibility of the milestones section
function toggle() {
    const section = document.getElementById('milestones');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
  }
  
  // Mark milestone as done or undone
  function toggleMilestoneDone(id) {
    const article = document.getElementById(id);
    article.classList.toggle('done');
    const milestoneText = article.querySelector('p');
    milestoneText.textContent = article.classList.contains('done') ? 'Milestone completed' : `Milestone ${id.slice(1)}: ${milestoneText.textContent.split(': ')[1]}`;
  }
  
  // Toggle task input and list visibility
  function toggleTaskInput(milestoneId) {
    const taskList = document.getElementById(`task-list-${milestoneId}`);
    const input = document.getElementById(`task-input-${milestoneId}`);
    const button = document.querySelector(`#${milestoneId} button[onclick="addTask('${milestoneId}')"]`);
  
    const isCurrentlyVisible = taskList.style.display === 'block';
    taskList.style.display = isCurrentlyVisible ? 'none' : 'block';
    input.style.display = isCurrentlyVisible ? 'none' : 'block';
    button.style.display = isCurrentlyVisible ? 'none' : 'block';
  }
  
  // Add a task to a milestone
  function addTask(milestoneId) {
    const input = document.getElementById(`task-input-${milestoneId}`);
    const taskList = document.getElementById(`task-list-${milestoneId}`);
    const taskText = input.value.trim();
    if (taskText === '') return;
  
    const li = document.createElement('li');
    li.innerHTML = `
      ${taskText} <button onclick="markTaskDone(this)">Mark as done</button>
    `;
    taskList.appendChild(li);
    input.value = '';
  }
  
  // Mark a task as done or undone
  function markTaskDone(button) {
    const li = button.parentElement;
    li.classList.toggle('task-done');
    button.textContent = li.classList.contains('task-done') ? 'Undo' : 'Mark as done';
  }
  