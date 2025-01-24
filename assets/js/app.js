import "./clock.js";
class ToDoItem {
  constructor(id, title, isDone = false) {
    this.id = id; // Unikal ID
    this.title = title; // Başlıq
    this.isDone = isDone; // Tamamlanma vəziyyəti
    this.createdAt = new Date(); // Yaradılma tarixi
  }

  toggleDone() {
    this.isDone = !this.isDone; // Tamamlanma vəziyyətini dəyişir
  }

  updateTitle(newTitle) {
    this.title = newTitle; // Başlığı yeniləyir
  }
}

class ToDoRenderer {
  // Yeni ToDoItem üçün DOM elementi yaradır
  static createToDoElement(todo, callbacks) {
    const item = document.createElement("li");
    item.setAttribute("data-id", todo.id);

    const titleSpan = document.createElement("span");
    titleSpan.textContent = todo.title;
    if (todo.isDone) titleSpan.classList.add("completed");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("list-btn");

    const checkBtn = document.createElement("button");
    checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    checkBtn.classList.add("check-btn");
    checkBtn.addEventListener("click", () => {
      callbacks.onToggleDone(todo);
      titleSpan.classList.toggle("completed");
    });

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-edit"></i>';
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => callbacks.onEdit(todo));

    const trashBtn = document.createElement("button");
    trashBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashBtn.classList.add("trash-btn");
    trashBtn.addEventListener("click", () => {
      callbacks.onDelete(todo);
      item.remove();
    });

    buttonContainer.appendChild(checkBtn);
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(trashBtn);
    item.appendChild(titleSpan);
    item.appendChild(buttonContainer);

    return item;
  }
}

class ToDoList {
  constructor(todoListElement, pendingCountElement) {
    this.todos = []; // ToDo massivini saxlayır
    this.todoListElement = todoListElement; // HTML-də əsas siyahı elementi
    this.pendingCountElement = pendingCountElement; // Pending Count spani
    this.updatePendingCount(); // İlk olaraq pending count-u yenilə
  }

  addToDo(title) {
    const newToDo = new ToDoItem(this.todos.length + 1, title);
    this.todos.push(newToDo);

    const todoElement = ToDoRenderer.createToDoElement(newToDo, {
      onToggleDone: (todo) => this.toggleDone(todo.id),
      onEdit: (todo) => this.showEditModal(todo),
      onDelete: (todo) => this.deleteToDo(todo.id),
    });

    this.todoListElement.appendChild(todoElement);
    this.updatePendingCount(); // Pending count-u yenilə
  }

  deleteToDo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id); // Siyahıdan silir
    this.updatePendingCount(); // Pending count-u yenilə
  }

  toggleDone(id) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.toggleDone(); // Tamamlanma vəziyyətini dəyişir
      this.updatePendingCount(); // Pending count-u yenilə
    }
  }

  updatePendingCount() {
    const pendingCount = this.todos.filter((todo) => !todo.isDone).length;
    this.pendingCountElement.textContent = pendingCount; // Spanı yeniləyir
  }

  showEditModal(todo) {
    const modal = document.getElementById("editModal");
    const editInput = document.getElementById("editInput");
    const saveEditBtn = document.getElementById("saveEditBtn");

    editInput.value = todo.title; // Mövcud başlığı göstərir
    modal.style.display = "block";

    saveEditBtn.onclick = () => {
      const newTitle = editInput.value.trim();
      if (newTitle) {
        todo.updateTitle(newTitle); // Başlığı yeniləyir
        const todoElement = this.todoListElement.querySelector(
          `[data-id="${todo.id}"] span`
        );
        todoElement.textContent = newTitle; // DOM-dakı başlığı yeniləyir
      }
      modal.style.display = "none";
    };
  }

  clearAllTodos() {
    this.todos = [];
    this.todoListElement.innerHTML = ""; // Bütün DOM elementlərini silir
    this.updatePendingCount(); // Pending count-u yenilə
  }
}

// To-Do List-in işə salınması
const todoListElement = document.querySelector(".list");
const pendingCountElement = document.querySelector(".pending_count"); // Pending Count span
const addBtn = document.querySelector(".add-btn");
const input = document.querySelector(".input");
const clearAll = document.querySelector(".clear_button");
const clearModal = document.querySelector(".clear-modal");
const clearConfirmBtn = document.querySelector(".clear-confirm-btn");
const clearCancelBtn = document.querySelector(".clear-cancel-btn");

const myToDoList = new ToDoList(todoListElement, pendingCountElement);

// Yeni to-do əlavə edir
addBtn.addEventListener("click", () => {
  const inputValue = input.value.trim();
  if (inputValue) {
    myToDoList.addToDo(inputValue);
    input.value = "";
  } else {
    alert("Zəhmət olmasa, bir mətn daxil edin!");
  }
});

// "Clear All" modalını göstərir
clearAll.addEventListener("click", () => {
  clearModal.classList.add("show");
});

// "Bəli" düyməsini basanda bütün to-doları silir
clearConfirmBtn.addEventListener("click", () => {
  myToDoList.clearAllTodos();
  clearModal.classList.remove("show");
});

// "Xeyr" düyməsini basanda modalı bağlayır
clearCancelBtn.addEventListener("click", () => {
  clearModal.classList.remove("show");
});

// Modalın bağlanması
const closeModal = document.querySelector(".close");
closeModal.onclick = () => {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
};

// Modalın xaricinə klik edildikdə bağlanır
window.onclick = (event) => {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
