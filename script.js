/* Theme */
function toggleTheme(){
  let cur = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
}

/* Data */
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let budget = parseFloat(localStorage.getItem("budget")) || null;

/* On load */
window.onload = () => {
  const bInput = document.getElementById("budgetAmount");
  if(budget) bInput.value = budget;
  displayExpenses();
  displayTasks();
  updateProgress();
  updateExpenseSummary();
};

/* Save budget */
function saveBudget(){
  const v = parseFloat(document.getElementById("budgetAmount").value);
  if(isNaN(v) || v <= 0) { alert("Enter a valid budget"); return; }
  budget = v;
  localStorage.setItem("budget", budget);
  updateExpenseSummary();
  displayExpenses();
}

/* Add Expense */
function addExpense(){
  const name = document.getElementById("expenseName").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if(!name || isNaN(amount) || amount <= 0) return alert("Enter valid name & amount");
  expenses.push({name, amount});
  localStorage.setItem("expenses", JSON.stringify(expenses));
  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";
  displayExpenses();
  updateExpenseSummary();
}

/* Display Expenses (highlight large single expense) */
function displayExpenses(){
  const list = document.getElementById("expenseList");
  list.innerHTML = "";
  const thresholdFactor = 0.5; // single expense considered 'high' if > 50% of budget
  expenses.forEach((e, i) => {
    let amt = parseFloat(e.amount);
    let cls = "item-normal";
    if(budget && amt > budget * thresholdFactor) cls = "item-high";
    list.innerHTML += `<li class="${cls}">${e.name} - ₹${amt.toLocaleString()} 
      <span onclick="deleteExpense(${i})" style="cursor:pointer;color:#b71c1c;">✖</span></li>`;
  });
}

/* Delete Expense */
function deleteExpense(i){
  expenses.splice(i,1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  displayExpenses();
  updateExpenseSummary();
}

/* Update expense summary (total vs budget) */
function updateExpenseSummary(){
  const summary = document.getElementById("expenseSummary");
  const total = expenses.reduce((s,e)=> s + Number(e.amount), 0);
  if(!budget){
    summary.className = "summary";
    summary.innerText = `Total: ₹${total.toLocaleString()} (Set budget to enable alerts)`;
    return;
  }

  if(total > budget){
    summary.className = "summary red";
    summary.innerText = `Total: ₹${total.toLocaleString()} / ₹${budget.toLocaleString()} — Over budget`;
  } else {
    summary.className = "summary green";
    summary.innerText = `Total: ₹${total.toLocaleString()} / ₹${budget.toLocaleString()} — Very good`;
  }
}

/* Tasks (unchanged) */
function addTask(){
  let name = document.getElementById("taskName").value.trim();
  if(!name) return alert("Enter task");
  tasks.push({name, done:false});
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById("taskName").value = "";
  displayTasks();
  updateProgress();
}
function displayTasks(){
  let list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((t,i)=>{
    list.innerHTML += `<li>
      <span onclick="toggleTask(${i})" style="cursor:pointer;">${t.done ? "✔" : "⭕"} ${t.name}</span>
      <span onclick="deleteTask(${i})" style="cursor:pointer;color:#b71c1c;">✖</span>
    </li>`;
  });
}
function toggleTask(i){
  tasks[i].done = !tasks[i].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  updateProgress();
}
function deleteTask(i){
  tasks.splice(i,1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
  updateProgress();
}

/* Progress circle */
function updateProgress(){
  const pEl = document.getElementById("progress");
  const txt = document.getElementById("progressText");
  if(tasks.length === 0){
    pEl.style.setProperty("--p","0deg");
    txt.innerText = "0%";
    return;
  }
  const done = tasks.filter(t=>t.done).length;
  const percent = Math.round((done/tasks.length)*100);
  pEl.style.setProperty("--p", (percent*3.6) + "deg");
  txt.innerText = percent + "%";
}