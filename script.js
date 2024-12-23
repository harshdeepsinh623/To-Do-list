const todoList = document.getElementById('todo-list');
let todos = JSON.parse(localStorage.getItem('todos')) || []; // Load from localStorage

function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const text = todoInput.value.trim();

    if (text === "") {
        showError("Please enter a valid value!");
        return;
    }

    const todo = { text, isBookmarked: false, completed: false };
    todos.push(todo);
    saveTodos();
    todoInput.value = '';
    renderTodos('all');
}

function showError(message) {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

function renderTodos(filter) {
    todoList.innerHTML = '';

    todos
        .filter(todo => {
            if (filter === 'bookmark') return todo.isBookmarked;
            if (filter === 'not-bookmark') return !todo.isBookmarked;
            return true; // 'all'
        })
        .forEach((todo, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${todo.text}</span>
                <div class="todo-actions">
                    <button onclick="toggleBookmark(${index})" style="background-color: ${
                        todo.isBookmarked ? '#ff9800' : '#ccc'
                    }">${todo.isBookmarked ? '★' : '☆'}</button>
                    <button onclick="editTodo(${index})">&#9998; Edit</button>
                    <button onclick="deleteTodo(${index})">&#10006; Delete</button>
                </div>
            `;
            todoList.appendChild(listItem);
        });
}

function toggleBookmark(index) {
    todos[index].isBookmarked = !todos[index].isBookmarked;
    saveTodos();
    renderTodos(document.getElementById('filter-dropdown').value);
}

function editTodo(index) {
    const newValue = prompt('Edit your task:', todos[index].text);

    if (newValue && newValue.trim()) {
        todos[index].text = newValue.trim();
        saveTodos();
        renderTodos(document.getElementById('filter-dropdown').value);
    }
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos('all');
}

function clearTodos() {
    todos = [];
    saveTodos();
    renderTodos('all');
}

function filterTodos(filter) {
    renderTodos(filter);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

document.addEventListener('DOMContentLoaded', () => renderTodos('all'));
