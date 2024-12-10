const itemsArray = localStorage.getItem("items")
  ? JSON.parse(localStorage.getItem("items"))
  : [];
 
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px'; // Hide sidebar
    } else {
        sidebar.style.left = '0px'; // Show sidebar
    }
}

// Event listener for "Enter" button
document.querySelector("#enter").addEventListener("click", () => {
  const item = document.querySelector("#item");
  const deadline = document.querySelector("#deadline");
  const description = document.querySelector(".description-input");
  createItem(item, deadline, description);
});

// Event listener for Enter keyboard press
document.querySelector("#item").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const item = document.querySelector("#item");
    const deadline = document.querySelector("#deadline");
    const description = document.querySelector(".description-input");
    createItem(item, deadline, description);
  }
});

function toggleAddTask() {
  const rightColumn = document.querySelector('.right-column'); // Select the right column
  
  if (rightColumn.style.display === "flex") {
    rightColumn.style.display = "none";
  } else {
    rightColumn.style.display = "flex";
  }
}


function displayItems() {
  const todoList = document.querySelector("#to-do-list");
  todoList.innerHTML = "";

  // Sort items by deadline (earliest to latest)
  itemsArray.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  // Group tasks by date
  const groupedTasks = itemsArray.reduce((groups, item) => {
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
    tasks.forEach((item, index) => {
      const p = document.createElement("div");
      p.className = "checkbox-list";
      p.style.margin = "-3px 0 -3px 0";
      p.innerHTML = `
        <label style="margin-left: 3.5px">${item.text}
          <input class="to-do-checkbox" type="checkbox" id="input-${index}" ${
        item.disabled ? "checked" : ""
      }>
          <p class="sub-box">${item.description}</p>
        </label>
      `;
      p.querySelector(".to-do-checkbox").addEventListener("change", () => {
        toggleTask(index);
      });
      todoList.appendChild(p);
    });
  }
}

function createItem(item, deadline, description) {
  if (
    item.value.trim() === "" ||
    deadline.value === "" ||
    description.value.trim() === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  itemsArray.push({
    text: item.value,
    disabled: false,
    deadline: deadline.value,
    description: description.value,
  });
  localStorage.setItem("items", JSON.stringify(itemsArray));
  location.reload();
}

function updateItem(text, deadline, i) {
  itemsArray[i] = { text, deadline, description };
  localStorage.setItem("items", JSON.stringify(itemsArray));
  location.reload();
}

window.onload = function () {
  displayItems();
};
