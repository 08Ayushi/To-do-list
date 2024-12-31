document.addEventListener('DOMContentLoaded', loadTasks);

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const errorMessage = document.getElementById('errorMessage');
const filterSelect = document.getElementById('filterSelect');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const totalTasksElem = document.getElementById('totalTasks');
const tasksCompletedElem = document.getElementById('tasksCompleted');

document.getElementById('addTaskButton').addEventListener('click', addTask);
filterSelect.addEventListener('change', filterTasks);
deleteAllBtn.addEventListener('click', deleteAllTasks);

function updateSummary() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter(task => task.completed).length;
    totalTasksElem.textContent = totalTasks;
    tasksCompletedElem.textContent = tasksCompleted;
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        errorMessage.textContent = 'Please enter a task.';
        errorMessage.style.display = 'block';
        return;
    }
    errorMessage.style.display = 'none';

    const task = {
        text: taskText,
        completed: false
    };
    saveTask(task);
    createTaskElement(task);
    taskInput.value = '';
    updateSummary();
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span style="text-decoration: ${task.completed ? 'line-through' : 'none'};">${task.text}</span>
        <div>
            ${task.completed 
                ? '<span class="undoText" style="cursor: pointer; color: blue; margin-left: 5px;">Undo</span>' 
                : '<i class="fas fa-check completeBtn" style="cursor: pointer; color: green;"></i>'}
            <i class="fas fa-trash deleteBtn" style="cursor: pointer; color: red; margin-left: 10px;"></i>
        </div>
    `;
    taskList.appendChild(li);

    if (task.completed) {
        li.querySelector('.undoText').addEventListener('click', () => toggleComplete(task, li));
    } else {
        li.querySelector('.completeBtn').addEventListener('click', () => toggleComplete(task, li));
    }
    li.querySelector('.deleteBtn').addEventListener('click', () => deleteTask(task, li));
}



function toggleComplete(task, li) {
    task.completed = !task.completed;

    const taskText = li.querySelector('span');
    const div = li.querySelector('div');
    taskText.style.textDecoration = task.completed ? 'line-through' : 'none';

    div.innerHTML = `
        ${task.completed 
            ? '<span class="undoText" style="cursor: pointer; color: blue; margin-left: 5px;">Undo</span>' 
            : '<i class="fas fa-check completeBtn" style="cursor: pointer; color: green;"></i>'}
        <i class="fas fa-trash deleteBtn" style="cursor: pointer; color: red; margin-left: 10px;"></i>
    `;

    if (task.completed) {
        div.querySelector('.undoText').addEventListener('click', () => toggleComplete(task, li));
    } else {
        div.querySelector('.completeBtn').addEventListener('click', () => toggleComplete(task, li));
    }
    div.querySelector('.deleteBtn').addEventListener('click', () => deleteTask(task, li));

    updateTaskInLocalStorage(task);
    updateSummary();
}

function deleteTask(task, li) {
    li.remove();
    deleteTaskFromLocalStorage(task);
    updateSummary();
}

function filterTasks() {
    const filter = filterSelect.value;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = '';
    tasks
        .filter(task => {
            if (filter === 'complete') return task.completed;
            if (filter === 'incomplete') return !task.completed;
            return true;
        })
        .forEach(createTaskElement);
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(updatedTask) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.text === updatedTask.text);
    if (taskIndex !== -1) tasks[taskIndex] = updatedTask;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.text !== task.text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteAllTasks() {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
    updateSummary();
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(createTaskElement);
    updateSummary();
}