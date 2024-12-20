const inputElement = document.getElementById('todo-input');
const todoListElement = document.getElementById('todo-list');
const errorMessage = document.querySelector('.error-message');
const todos = JSON.parse(localStorage.getItem('todos')) || [];

function addTodo() {

    const todoText = inputElement.value.trim();

    if (!todoText) {
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none';
      
    const li = document.createElement('li');

    li.innerHTML = `
        <span>${todoText}</span>
        <div class="todo-actions">
            <button class="complete" onclick="markComplete(this)">&#10004;</button>
            <button class="edit" onclick="editTodo(this)">&#9998;</button>
            <button class="delete" onclick="deleteTodo(this)">&#10006;</button>
        </div>
    `;
    todoListElement.append(li);
    inputElement.value = '';

    todos.push({ text: todoText, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteTodo(button) {

    const li = button.closest('li');
    todoListElement.remove(li);

    const todoIndex = Array.from(todoListElement.children).indexOf(li);
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function editTodo(button) {

    const li = button.closest('li');
    const textSpan = li.querySelector('span');
    const newValue = prompt('Edit your task:', textSpan.textContent);

    if (newValue) {
        textSpan.textContent = newValue;

        const todoIndex = Array.from(todoListElement.children).indexOf(li);
        todos[todoIndex].text = newValue;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function markComplete(button) {
    const li = button.closest('li');
    li.classList.toggle('completed');

    const todoIndex = Array.from(todoListElement.children).indexOf(li);
    todos[todoIndex].completed = li.classList.contains('completed');
    localStorage.setItem('todos', JSON.stringify(todos));
}

function clearTodos() {
    todoListElement.innerHTML = '';
    todos.length = 0; 
    localStorage.setItem('todos', JSON.stringify(todos));
}

document.addEventListener('DOMContentLoaded', function() {
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-actions">
                <button class="complete" onclick="markComplete(this)">&#10004;</button>
                <button class="edit" onclick="editTodo(this)">&#9998;</button>
                <button class="delete" onclick="deleteTodo(this)">&#10006;</button>
            </div>
        `;
        
        if (todo.completed) {
            li.classList.add('completed');
        }
        todoListElement.append(li);
    });
});