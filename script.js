document.addEventListener('DOMContentLoaded', () => {
  // Get references to HTML elements
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const filterOptions = document.querySelectorAll('input[name="filter"]');
  const resetBtn = document.getElementById('resetBtn');

  // Add event listeners
  taskForm.addEventListener('submit', addTask);
  taskList.addEventListener('click', handleTaskClick);
  taskList.addEventListener('dblclick', handleTaskDoubleClick);
  filterOptions.forEach(option => {
    option.addEventListener('change', filterTasks);
  });
  resetBtn.addEventListener('click', resetTasks);

  // Load tasks from local storage when the page is loaded
  loadTasks();

  // Function to add a new task
  function addTask(event) {
    event.preventDefault();
    const taskContent = taskInput.value.trim();
    if (taskContent !== '') {
      const newTask = createTaskElement(taskContent);
      taskList.appendChild(newTask);
      saveTasks();
      taskInput.value = '';
    }
  }

  // Function to handle task click events (e.g., delete)
  function handleTaskClick(event) {
    if (event.target.tagName === 'BUTTON') {
      deleteTask(event.target.parentElement);
    }
  }

  // Function to handle task double-click events (e.g., edit)
  function handleTaskDoubleClick(event) {
    if (event.target.tagName === 'LI') {
      const task = event.target;
      const currentContent = task.textContent;
      const newContent = prompt('Edit task:', currentContent);
      if (newContent !== null && newContent.trim() !== '') {
        task.textContent = newContent.trim();
        saveTasks();
      }
    }
  }

  // Function to create a new task element
  function createTaskElement(taskContent, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskContent;
    if (completed) {
      li.classList.add('completed');
    }
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.classList.add('delete-btn');
    li.appendChild(deleteBtn);
    return li;
  }

  // Function to delete a task
  function deleteTask(taskElement) {
    taskElement.remove();
    saveTasks();
  }

  // Function to filter tasks based on completion status
function filterTasks() {
  const filterValue = document.querySelector('input[name="filter"]:checked').value;
  taskList.childNodes.forEach(task => {
    switch (filterValue) {
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'block' : 'none';
        break;
      case 'incomplete':
        task.style.display = task.classList.contains('completed') ? 'none' : 'block';
        break;
      default:
        task.style.display = 'block';
    }
  });
}




  // Function to save tasks to local storage
  function saveTasks() {
    const tasks = [];
    taskList.childNodes.forEach(task => {
      tasks.push({ content: task.textContent.trim(), completed: task.classList.contains('completed') });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Function to load tasks from local storage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
      const newTask = createTaskElement(task.content, task.completed);
      taskList.appendChild(newTask);
    });
  }

  // Function to reset all tasks
  function resetTasks() {
    taskList.innerHTML = ''; // Clear all tasks from the list
    saveTasks(); // Save the empty task list to local storage
  }
});
