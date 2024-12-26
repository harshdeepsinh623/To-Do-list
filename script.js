const todoList = document.getElementById("todo-list");
const todoDate = document.getElementById("todo-date");
const todoTime = document.getElementById("todo-time");
const filterDropdown = document.getElementById("filter-dropdown");
const sortButton = document.getElementById("sort-button");
const priorityButton = document.getElementById("priority-button");
const clearButton = document.querySelector(".clear-button");
const formInput = document.querySelector(".form-input");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function addTodo() {
    const todoInput = document.getElementById("todo-input");
    const text = todoInput.value.trim();

    if (!text) {
        showError("Please enter a valid value!");
        return;
    }

    const todo = {
        text,
        isBookmarked: false,
        completed: false,
        date: todoDate?.value || null,
        time: todoTime?.value || null,
    };

    todos.push(todo);
    saveTodos();
    todoInput.value = "";
    renderTodos(filterDropdown?.value || "all");
}

function showError(message) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

function renderTodos(filter) {
    todoList.innerHTML = "";

    todos
        .filter((todo) => {
            if (filter === "bookmark") return todo.isBookmarked;
            if (filter === "not-bookmark") return !todo.isBookmarked;
            return true;
        })
        .forEach((todo, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            ${
                todo.date
                    ? `<span class="todo-due-date">(Due: ${todo.date} ${todo.time || ""})</span>`
                    : ""
            }
            <div class="todo-actions">
                <button onclick="toggleBookmark(${index})" style="background-color: ${
                todo.isBookmarked ? "#ff9800" : "#ccc"
            }">${todo.isBookmarked ? "★" : "☆"}</button>
                <button onclick="editTodo(${index})">&#9998;</button>
                <button onclick="deleteTodo(${index})">&#10006;</button>
            </div>
        `;
        
            todoList.appendChild(listItem);
        });
    }

function toggleBookmark(index) {
    todos[index].isBookmarked = !todos[index].isBookmarked;
    saveTodos();
    renderTodos(filterDropdown?.value || "all");
}

function editTodo(index) {
    document.getElementById('newTaskName').value = todos[index].text;
    document.getElementById('newDueDate').value = todos[index].date;
    document.getElementById('newDueTime').value = todos[index].time;    

    if (newName && newName.trim()) {
        todos[index].text = newName.trim();
    }
    if (newDate && newDate.trim()) {
        todos[index].date = newDate.trim();
    }
    if (newTime && newTime.trim()) {
        todos[index].time = newTime.trim();
    }
    saveTodos();
    renderTodos(filterDropdown?.value || "all");
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos(filterDropdown?.value || "all");
}

function clearTodos() {
    if (confirm("Are you sure you want to clear all todos?")) {
        todos = [];
        saveTodos();
        renderTodos("all");
    }
}

function sortTodos() {
    todos.sort((a, b) => a.text.localeCompare(b.text));
    saveTodos();
    renderTodos(filterDropdown?.value || "all");
}

function priorityTodos() {
    const priorityTask = prompt("Enter the task to prioritize:");
    if (!priorityTask) return;

    const foundIndex = todos.findIndex((todo) => todo.text === priorityTask.trim());
    if (foundIndex > -1) {
        const [task] = todos.splice(foundIndex, 1);
        todos.unshift(task);
        saveTodos();
        renderTodos(filterDropdown?.value || "all");
    } else {
        alert("Task not found!");
    }
}

function filterTodos(filter) {
    renderTodos(filter);
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

let sortDirection = "asc";

function handleDropdownAction() {
    const action = document.getElementById("action-selector").value;

    if (action === "clear") {
        clearTodos();
    } 
    else if (action === "sort") {
        if (sortDirection === "asc") {
            todos.sort((a, b) => a.text.localeCompare(b.text)); 
            sortDirection = "desc"; 
        } 
        else {
            todos.reverse(); 
            sortDirection = "asc"; 
        }
        saveTodos();
        renderTodos("all");
    } 
    else if (action === "priority") {
        priorityTodos();
    }

    document.getElementById("action-selector").value = "";
}

document.addEventListener("DOMContentLoaded", () => {
    renderTodos("all");

    formInput.querySelector("button").addEventListener("click", addTodo);
    formInput.querySelector("input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTodo();
    });

    filterDropdown?.addEventListener("change", (e) => filterTodos(e.target.value));
    clearButton?.addEventListener("click", clearTodos);
    sortButton?.addEventListener("click", sortTodos);
    priorityButton?.addEventListener("click", priorityTodos);
});

