// ==========================================================================
// 1. State Management & Local Storage
// ==========================================================================
// Check if tasks exist in localStorage; if not, default to an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filtersContainer = document.getElementById('filters');

// ==========================================================================
// 2. Core CRUD Operations
// ==========================================================================

// CREATE: Add a new task
function addTask(e) {
    e.preventDefault(); // Prevent page reload
    
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        id: Date.now(), // Unique ID based on timestamp
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = ''; // Clear input
    
    updateState();
}

// UPDATE: Toggle completion status
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    updateState();
}

// DELETE: Remove a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateState();
}

// ==========================================================================
// 3. Dynamic DOM Rendering & Filtering
// ==========================================================================

// READ: Render the DOM elements based on state and current filter
function renderTasks() {
    // Clear the current list
    taskList.innerHTML = '';

    // Apply filters
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Generate dynamic DOM elements
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <label style="display: flex; gap: 0.5rem; align-items: center; cursor: pointer;">
                <input type="checkbox" class="toggle-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
            </label>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}

// Helper: Save to local storage and re-render
function updateState() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// ==========================================================================
// 4. Event Delegation & Listeners
// ==========================================================================

// Form Submit Listener
taskForm.addEventListener('submit', addTask);

// DELEGATED EVENT LISTENER: Attach to parent <ul> instead of individual buttons
taskList.addEventListener('click', (e) => {
    // Check if the clicked element is a delete button
    if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.getAttribute('data-id'));
        deleteTask(id);
    }
});

// DELEGATED EVENT LISTENER: Checkbox toggles
taskList.addEventListener('change', (e) => {
    if (e.target.classList.contains('toggle-checkbox')) {
        const id = Number(e.target.getAttribute('data-id'));
        toggleTask(id);
    }
});

// Filter Listeners
filtersContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        // Update active button styling
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Set state and render
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    }
});

// Initial render when the page loads
renderTasks();