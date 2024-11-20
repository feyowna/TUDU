const itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

// event listener for "Enter" button
document.querySelector("#enter").addEventListener("click", () => {
  const item = document.querySelector("#item");
  const deadline = document.querySelector("#deadline");
  createItem(item, deadline)
})

//event listener for Enter keyboard press
document.querySelector("#item").addEventListener("keypress", (e) => {
  if(e.key === "Enter"){
    const item = document.querySelector("#item")
    const deadline = document.querySelector("#deadline");
    createItem(item, deadline);
  }
})

function displayDate(){
  let date = new Date()
  date = date.toString().split(" ")
  date = date[1] + " " + date[2] + " " + date[3] 
  document.querySelector("#date").innerHTML = date 
}

// Display to-do items
function displayItems(){
  let items = ""
  for(let i = 0; i < itemsArray.length; i++){
    items += `<div class="item">
                <div class="input-controller">
                  <textarea disabled>${itemsArray[i].text}</textarea>
                  <input type="datetime-local" disabled value="${itemsArray[i].deadline}" />
                  <div class="edit-controller">
                  <div class="edit-controller">
                    <i class="fa-solid fa-check deleteBtn"></i>
                    <i class="fa-solid fa-pen-to-square editBtn"></i>
                  </div>
                </div>
                <div class="update-controller">
                  <button class="saveBtn">Save</button>
                  <button class="cancelBtn">Cancel</button>
                </div>
              </div>`
  }
  document.querySelector(".to-do-list").innerHTML = items
  activateDeleteListeners()
  activateEditListeners()
  activateSaveListeners()
  activateCancelListeners()
}

function activateDeleteListeners(){
  let deleteBtn = document.querySelectorAll(".deleteBtn")
  deleteBtn.forEach((dB, i) => {
    dB.addEventListener("click", () => { deleteItem(i) })
  })
}

function activateEditListeners(){
  const editBtn = document.querySelectorAll(".editBtn")
  const updateController = document.querySelectorAll(".update-controller")
  const inputs = document.querySelectorAll(".input-controller textarea")
  const deadlineInputs = document.querySelectorAll(".input-controller input[type='datetime-local']");
  editBtn.forEach((eB, i) => {
    eB.addEventListener("click", () => { 
      updateController[i].style.display = "block"
      inputs[i].disabled = false;
      deadlineInputs[i].disabled = false; })
      
  })
}

function activateSaveListeners(){
  const saveBtn = document.querySelectorAll(".saveBtn")
  const taskInputs = document.querySelectorAll(".input-controller textarea")
  const deadlineInputs = document.querySelectorAll(".input-controller input[type='datetime-local']");

  saveBtn.forEach((sB, i) => {
    sB.addEventListener("click", () => {
      updateItem(taskInputs[i].value, deadlineInputs[i].value, i);
    })
  })
}

function activateCancelListeners(){
  const cancelBtn = document.querySelectorAll(".cancelBtn")
  const updateController = document.querySelectorAll(".update-controller")
  const inputs = document.querySelectorAll(".input-controller textarea")
  cancelBtn.forEach((cB, i) => {
    cB.addEventListener("click", () => {
      updateController[i].style.display = "none"
      inputs[i].disabled = true;
      deadlines[i].disabled = true;
      inputs[i].style.border = "none"
      deadlines[i].style.border = "none";
    })
  })
}

function createItem(item, deadline){
  if (item.value.trim() === "" || deadline.value === "") {
    alert("Both the task and deadline are required.");
    return;
  }

  itemsArray.push({ "text": item.value, "deadline": deadline.value });
  localStorage.setItem('items', JSON.stringify(itemsArray))
  location.reload()
}

function deleteItem(i){
  itemsArray.splice(i,1)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  location.reload()
}

function updateItem(text, deadline, i){
  itemsArray[i] = { "text": text, "deadline": deadline};
  localStorage.setItem('items', JSON.stringify(itemsArray))
  location.reload()
}

window.onload = function() {
  displayDate()
  displayItems()
};