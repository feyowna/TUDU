const todo = localStorage.getItem("items")
          ? JSON.parse(localStorage.getItem("items"))
          : [];

// Event listener for "Enter" button
document.querySelector("#enter").addEventListener("click", () => {
  const item = document.querySelector("#item");
  const deadline = document.querySelector("#deadline");
  const category = document.querySelector(".select-category");
  const description = document.querySelector(".description-input");
  createItem(item, deadline, category, description);
});

// Event listener for Enter keyboard press
document.querySelector("#item").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const item = document.querySelector("#item");
    const deadline = document.querySelector("#deadline");
    const category = document.querySelector(".select-category");
    const description = document.querySelector(".description-input");
    createItem(item, deadline, category, description);
  }
});

document.querySelector("#menu-btn").addEventListener("click", () => {
  const sideBar = document.querySelector(".side-bar");
  sideBar.classList.toggle('active');
});

function openAddTask() {
  const rightColumn = document.querySelector('.right-column');
  rightColumn.style.display = "flex";
}

document.querySelectorAll('.to-do-checkbox').forEach((checkbox, index) => {
  const customCheckbox = checkbox.nextElementSibling; // Get the associated custom checkbox span
  
  // When the custom checkbox is clicked, toggle the hidden checkbox
  customCheckbox.addEventListener('click', () => {
    checkbox.checked = !checkbox.checked; // Toggle the checkbox state
    checkbox.dispatchEvent(new Event('change')); // Trigger the change event to reflect state change
  });
  
  // Listen for changes to the checkbox state and update the custom checkbox visual
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      customCheckbox.classList.add('checked'); // Visual update when checked
    } else {
      customCheckbox.classList.remove('checked'); // Visual update when unchecked
    }
  });
  
  // Initialize the checkbox state on page load
  if (checkbox.checked) {
    customCheckbox.classList.add('checked'); // Make sure the custom checkbox reflects the initial state
  }
});

function displayItems() {
  const todoList = document.querySelector("#to-do-list");
  const todoCount = document.querySelector("#todoCount");

  todoList.innerHTML = "";

  // Sort items by deadline (earliest to latest)
  todo.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // Group tasks by date
  const groupedTasks = todo.reduce((groups, item) => {
    const date = new Date(item.deadline).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Render grouped tasks
  for (const [date, tasks] of Object.entries(groupedTasks)) {
    // Add date heading
    const dateHeading = document.createElement("h3");
    dateHeading.style.margin = "20px 0 0 0";
    dateHeading.textContent = date;
    todoList.appendChild(dateHeading);

    // Add tasks for this date
    tasks.forEach((item) => {
      const p = document.createElement("div");
      p.className = "checkbox-list";
      p.style.margin = "-3px 0 -3px 0";
      p.innerHTML = `
      <span class="custom-checkbox"></span>
      <input class="to-do-checkbox" type="checkbox" id="input-${todo.indexOf(item)}" ${item.disabled ? "checked" : ""}>
      <p style="margin-left: 70px" id="todo-${todo.indexOf(item)}" class="${item.disabled ? "disabled" : ""}" onclick="editTask(${todo.indexOf(item)})">
      ${item.text}</p>
      <p class="sub-box">${item.category}</p>
      `;
      p.querySelector(".to-do-checkbox").addEventListener("change", () => {
        toggleTask(todo.indexOf(item));
      });
      todoList.appendChild(p);
    });
  }
  const disabledCount = todo.filter(item => !item.disabled).length;
  todoCount.textContent = disabledCount;
}

function createItem(item, deadline, category, description) {
  if (
    item.value.trim() === "" ||
    deadline.value === "" ||
    category.value === "Category" ||
    description.value.trim() === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }
  
  todo.push({
    text: item.value,
    disabled: false,
    deadline: deadline.value,
    category: category.value,
    description: description.value,
  });
  localStorage.setItem("items", JSON.stringify(todo));
  clearInput();
  location.reload();
}

function updateItem(text, deadline, i) {
  todo[i] = { text, deadline, description };
  localStorage.setItem("items", JSON.stringify(todo));
  location.reload();
}

function toggleAddTask() {
  const rightColumn = document.querySelector('.right-column');
  
  if (rightColumn.style.display === "flex") {
    rightColumn.style.display = "none";
  } else {
    rightColumn.style.display = "flex";
  }
  clearInput();
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayItems();
}

function deleteTask(index) {
  todo.splice(index, 1);
  saveToLocalStorage();
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");
  inputElement.classList.add("edit-task");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();
  
  inputElement.addEventListener("blur", () => {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
      displayItems();
    }
  });
  
  inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const updatedText = inputElement.value.trim();
      if (updatedText) {
        todo[index].text = updatedText;
        saveToLocalStorage();
        displayItems();
      }
    }
  });
}

function clearInput() {
  const item = document.querySelector("#item");
  const deadline = document.querySelector("#deadline");
  const category = document.querySelector(".select-category");
  const description = document.querySelector(".description-input");
  
  item.value = "";
  deadline.value = "";
  category.value = "Category";
  description.value = "";
}

// Show the modal when the delete button is clicked
document.getElementById('delete').addEventListener('click', function() {
  document.getElementById('modal').style.display = 'block';
});

// Hide the modal when the cancel button is clicked
document.getElementById('cancel').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Handle the discard action
document.getElementById('discard').addEventListener('click', () => {
  // Remove the entire edit button container
  const container = document.getElementById('edit-button-container');
  if (container) {
    container.remove();
  }
  
  // Close the right column container
  toggleAddTask();
  
  // Hide the modal
  document.getElementById('modal').style.display = 'none';
});

function saveToLocalStorage() {
  localStorage.setItem("items", JSON.stringify(todo));
}

window.onload = function () {
  displayItems();
};