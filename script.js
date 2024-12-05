const itemsArray = localStorage.getItem("items")
  ? JSON.parse(localStorage.getItem("items"))
  : [];

// event listener for "Enter" button
document.querySelector("#enter").addEventListener("click", () => {
  const item = document.querySelector("#item");
  const deadline = document.querySelector("#deadline");
  const description = document.querySelector(".description-input");
  createItem(item, deadline, description);
});

//event listener for Enter keyboard press
document.querySelector("#item").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const item = document.querySelector("#item");
    const deadline = document.querySelector("#deadline");
    const description = document.querySelector(".description-input");
    createItem(item, deadline, description);
  }
});

// Display to-do items
function displayItems() {
  const todoList = document.querySelector("#to-do-list");
  todoList.innerHTML = "";
  itemsArray.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerHTML = `<div class="checkbox-list">
                    <label style="margin-left: 3.5px" class="to-do-checkbox-${
                      item.disabled ? "disabled" : ""
                    }">${item.text}
                      <input class="to-do-checkbox" type="checkbox"
                      id="input-${index}" ${item.disabled ? "checked" : ""}>
                      <p class="sub-box" id="to-do-${index}" onclick="editTask(${index})">${
      item.description
    }
                      </p>
                    </label>
                  </div>`;
    p.querySelector(".to-do-checkbox").addEventListener("change", () => {
      toggleTask(index);
    });
    todoList.appendChild(p);
  });
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
