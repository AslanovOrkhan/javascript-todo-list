import "./clock.js";
const addBtn = document.querySelector(".add-btn");
const input = document.querySelector(".input");
const todoList = document.querySelector(".list");
const modal = document.getElementById("editModal");
const closeModal = document.querySelector(".close");
const saveEditBtn = document.getElementById("saveEditBtn");
const editInput = document.getElementById("editInput");

class ToDoItem {
  constructor(id, title, isDone = false) {
    this.id = id;
    this.title = title;
    this.isDone = isDone;
    this.createdAt = new Date();
  }

  toggleDone() {
    this.isDone = !this.isDone;
  }

  updateTitle(newTitle) {
    this.title = newTitle;
  }
}

class ToDoList {
  constructor() {
    this.todos = [];
  }

  addToDo(title) {
    const newToDo = new ToDoItem(this.todos.length + 1, title);
    const item = document.createElement("li");
    item.setAttribute("data-id", newToDo.id); // Hər bir itemə id əlavə edirik
    item.innerHTML = `
      <span>${title}</span>
      <div class="list-btn">
        <button class="check-btn"><i class="fa-solid fa-check"></i></button>
        <button class="trash-btn"><i class="fa-solid fa-trash"></i></button>
        <button class="edit-btn"><i class="fa-solid fa-edit"></i></button>
      </div>
    `;

    // `trash-btn`-a event listener əlavə edirik
    const trashBtn = item.querySelector(".trash-btn");
    trashBtn.addEventListener("click", () => {
      this.deleteToDo(newToDo.id);
      item.remove(); // DOM-dan silirik
    });

    // `edit-btn`-a event listener əlavə edirik
    const editBtn = item.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      this.editToDo(newToDo.id, item);
    });

    // `check-btn`-a event listener əlavə edirik
    const checkBtn = item.querySelector(".check-btn");
    checkBtn.addEventListener("click", () => {
      const span = item.querySelector("span");
      span.classList.toggle("completed"); // Span-ın üzərindən xətt çəkirik
      newToDo.toggleDone(); // ToDo itemini 'done' halına gətiririk
    });

    todoList.appendChild(item);
    this.todos.push(newToDo);
  }

  deleteToDo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  editToDo(id, item) {
    // Modalı açırıq
    const todo = this.todos.find((todo) => todo.id === id);
    editInput.value = todo.title; // Mövcud başlıqla inputu doldururuq
    modal.style.display = "block"; // Modalı göstəririk

    // Yadda saxla düyməsi
    saveEditBtn.onclick = () => {
      const newTitle = editInput.value.trim();
      if (newTitle !== "") {
        todo.updateTitle(newTitle); // ToDo başlığını yeniləyirik
        item.querySelector("span").textContent = newTitle; // DOM-dakı span'ı da yeniləyirik
      }
      modal.style.display = "none"; // Modalı bağlayırıq
    };
  }
}

const myToDoList = new ToDoList();

addBtn.addEventListener("click", () => {
  const inputValue = input.value.trim();

  if (inputValue) {
    myToDoList.addToDo(inputValue);
    input.value = "";
  } else {
    alert("Zəhmət olmasa, bir mətn daxil edin!");
  }
});

// Modalın bağlanması
closeModal.onclick = () => {
  modal.style.display = "none";
};

// Modalın xaricinə klik edildikdə də bağlanma
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Clear All Button Logic
const clearAll = document.querySelector(".clear_button");
const clearModal = document.querySelector(".clear-modal"); // Modal Selector
const clearConfirmBtn = document.querySelector(".clear-confirm-btn"); // Bəli Button
const clearCancelBtn = document.querySelector(".clear-cancel-btn"); // Xeyr Button

// Show modal on Clear Button click
clearAll.addEventListener("click", () => {
  clearModal.classList.add("show"); // Show the modal
});

// Clear all todos if confirmed
clearConfirmBtn.addEventListener("click", () => {
  myToDoList.todos = []; // Clear all todos from the array
  todoList.innerHTML = ""; // Clear all items from the DOM
  clearModal.classList.remove("show"); // Close the modal
});

// Close modal if canceled
clearCancelBtn.addEventListener("click", () => {
  clearModal.classList.remove("show"); // Close the modal
});
