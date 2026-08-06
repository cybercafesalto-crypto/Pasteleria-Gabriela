// Seleccionar elementos del DOM
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Variables para el filtro actual
let currentFilter = 'all';
let todos = [];

// Cargar pedidos del localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
});

// Agregar pedido al presionar Enter o click en el botón
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Event delegation para checkbox y botones de eliminación
todoList.addEventListener('change', (e) => {
    if (e.target.classList.contains('checkbox')) {
        const id = e.target.dataset.id;
        toggleTodo(id);
    }
});

todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const id = e.target.dataset.id;
        deleteTodo(id);
    }
    if (e.target.classList.contains('btn-edit')) {
        const id = e.target.dataset.id;
        editTodo(id);
    }
});

// Filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Limpiar pedidos completados/entregados
clearBtn.addEventListener('click', clearCompletedTodos);

// Función para agregar un nuevo pedido
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Por favor, escribe un pedido');
        return;
    }

    if (text.length > 150) {
        alert('El pedido es demasiado largo (máximo 150 caracteres)');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString('es-ES')
    };

    todos.push(newTodo);
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
    renderTodos();
}

// Función para marcar un pedido como listo
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id == id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

// Función para eliminar un pedido
function deleteTodo(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
        todos = todos.filter(todo => todo.id != id);
        saveTodos();
        renderTodos();
    }
}

// Función para editar un pedido
function editTodo(id) {
    const todo = todos.find(t => t.id == id);
    if (!todo) return;

    const newText = prompt('Editar pedido:', todo.text);
    
    if (newText !== null && newText.trim() !== '') {
        if (newText.length > 150) {
            alert('El pedido es demasiado largo (máximo 150 caracteres)');
            return;
        }
        todos = todos.map(t => 
            t.id == id ? { ...t, text: newText.trim() } : t
        );
        saveTodos();
        renderTodos();
    }
}

// Función para limpiar pedidos entregados
function clearCompletedTodos() {
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        alert('No hay pedidos listos para eliminar');
        return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar ${completedCount} pedido(s) listo(s)?`)) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
}

// Función para renderizar los pedidos
function renderTodos() {
    todoList.innerHTML = '';

    // Filtrar pedidos según el filtro actual
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // Si no hay pedidos
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>🍰 No hay pedidos por mostrar</p>
            </div>
        `;
        updateStats();
        return;
    }

    // Crear elementos para cada pedido
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                data-id="${todo.id}" 
                ${todo.completed ? 'checked' : ''}
            >
            <span class="todo-text" title="${todo.text}">
                ${escapeHtml(todo.text)}
            </span>
            <div class="todo-actions">
                <button class="btn-edit" data-id="${todo.id}">✏️ Editar</button>
                <button class="btn-delete" data-id="${todo.id}">🗑️ Eliminar</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });

    updateStats();
}

// Función para actualizar estadísticas
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('pendingCount').textContent = pending;

    // Desactivar botón de limpiar si no hay pedidos listos
    clearBtn.disabled = completed === 0;
}

// Función para guardar en localStorage
function saveTodos() {
    localStorage.setItem('pasteleriaGabriela_pedidos', JSON.stringify(todos));
}

// Función para cargar del localStorage
function loadTodos() {
    const saved = localStorage.getItem('pasteleriaGabriela_pedidos');
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch (e) {
            console.error('Error al cargar pedidos:', e);
            todos = [];
        }
    }
}

// Función para escapar caracteres HTML (seguridad)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
