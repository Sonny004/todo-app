// -commit "Глобальные переменные"
const myInput = document.querySelector(".todo-form input");
const myBtn = document.querySelector(".todo-form button");
const tasksContainer = document.querySelector("#tasksContainer");
let activeIndex = -1;
const calendarGrid = document.querySelector("#calendarGrid");
const prevMonthBtn = document.querySelector("#prevMonthBtn");
const nextMonthBtn = document.querySelector("#nextMonthBtn");
const calendarTitle = document.querySelector("#calendarTitle");
const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
let currentYear = 2026;
let currentMonth = 10;
const liveClock = document.querySelector("#liveClock");
const liveDate = document.querySelector("#liveDate");
const goalTitleInput = document.querySelector("#goalTitleInput");
const goalDateInput = document.querySelector("#goalDateInput");
const goalDescInput = document.querySelector("#goalDescInput");
const addGoalBtn = document.querySelector("#addGoalBtn");
const goalsList = document.querySelector("#goalsList");
let goalsDatabase = [];
const discriptionWindow = document.querySelector("#discriptionWindow");
const dWBtnClose = document.querySelector("#dWBtnClose");
const dWText = document.querySelector("#dWText");
const pencilBtn = document.querySelector("#pencilBtn");
const goalsForm = document.querySelector("#goals-form");

// -commit "Зацеп кнопки бургер-меню"
const burgerBtn = document.querySelector(".menu-btn");
const sidebarMenu = document.querySelector(".sidebar-menu");

// -commit "Зацеп главного экрана задачника"
const mainScreen = document.querySelector("#screenMain");
const calendarScreen = document.querySelector("#screenCalendar");
const goalsScreen = document.querySelector("#screenGoals");
const weekPlanScreen = document.querySelector("#screenWeekPlan");
const timerScreen = document.querySelector("#screenTimer");
const habitsScreen = document.querySelector("#screenHabits");
const settingsScreen = document.querySelector("#screenSettings");


// -commit "Зацепы пунктов бокового меню"
const btnGoHome = document.querySelector("#goHomeBtn")
const btnCalendar = document.querySelector("#menuCalendar");
const btnGoals = document.querySelector("#menuGoals");
const btnWeekPlan = document.querySelector("#menuWeekPlan");
const btnTimer = document.querySelector("#menuTimer");
const btnHabits = document.querySelector("#menuHabits");
const btnSettings = document.querySelector("#menuSettings");

// -commit "Датчик открытия бургер-меню"
burgerBtn.addEventListener("click", function () {
    sidebarMenu.classList.toggle("open");
});

// -commit "База данных"

let myDatabase = [];

async function loadTasksFromServer() {
    const response = await fetch("http://localhost:3000/api/tasks", { cache: "no-store" });
    const data = await response.json();
    myDatabase = data;
    renderTasks();
}
loadTasksFromServer();

async function loadGoalsFromServer() {
    const responce = await fetch("http://localhost:3000/api/goals", { cache: "no-store"});
    const data = await responce.json();
    goalsDatabase = data;
    renderGoals();
}
loadGoalsFromServer();

// -commit "Счётчик Задач"

let taskNumber = myDatabase.length;

// -commit "Главная функция ввода"
async function main() {
    const userText = myInput.value.trim();
    if (userText === "") {
        userText.value = "";
        return;
    }



    // -commit "Создание объекта задачи"

    const taskObject = {
        text: userText,
        id: taskNumber + 1,
        isDone: false
    }

    await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskObject)

    });
    await loadTasksFromServer();


    // -commit "Запись в базу данный и на диск"
    taskNumber++;
    // myDatabase.push(taskObject);
    // localStorage.setItem("myTaskArray", JSON.stringify(myDatabase));

    // -commit "Очистка и фокус"
    myInput.value = "";
    myInput.focus();
    renderTasks();

}

// -commit "Функция отрисовки карточек на экране"
function renderTasks() {
    tasksContainer.innerHTML = "";
    myDatabase.forEach(function (task, index) {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = task.text;
        const numberSpan = document.createElement("span");
        numberSpan.classList.add("task-number");
        numberSpan.textContent = task.id;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.isDone;
        if (task.isDone) {
            checkbox.checked = true;
            span.style.textDecoration = "line-through";
        }
        checkbox.addEventListener("change", async function () {
            task.isDone = checkbox.checked;
            await fetch("http://localhost:3000/api/tasks/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: task.id, isDone: checkbox.checked })
            });
            localStorage.setItem("myTaskArray", JSON.stringify(myDatabase));
            renderTasks();
        });
        li.appendChild(numberSpan);
        li.appendChild(span);
        li.appendChild(checkbox);
        tasksContainer.appendChild(li);
        if (index === activeIndex) {
            li.classList.add("selected-task");
        }
    });
}

// -commit "Датчики событий"
myBtn.addEventListener("click", main);
window.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        main();
    }
    if (event.key === "ArrowDown") {
        if (event.shiftKey === true) {
            tasksContainer.scrollBy({ top: 40, behavior: "smooth" })
            return;
        }
        const currentCards = document.querySelectorAll(".tasks-list li");
        activeIndex = Array.from(currentCards).findIndex(card => card.classList.contains("selected-task"));
        console.log("Клик вниз! Глобальный индекс сейчас равен:", activeIndex);
        if (activeIndex === -1) {
            currentCards[0].classList.add("selected-task");
        } else {
            currentCards[activeIndex].classList.remove("selected-task");
            if (activeIndex === currentCards.length - 1) {
                currentCards[0].classList.add("selected-task");
            } else {
                currentCards[activeIndex + 1].classList.add("selected-task");
            }
        }
    }
    if (event.key === "ArrowUp") {
        if (event.shiftKey === true) {
            tasksContainer.scrollBy({ top: -40, behavior: "smooth" })
            return;
        }
        const currentCards = document.querySelectorAll(".tasks-list li");
        activeIndex = Array.from(currentCards).findIndex(card => card.classList.contains("selected-task"));
        if (activeIndex === -1) {
            currentCards[currentCards.length - 1].classList.add("selected-task");
        } else {
            currentCards[activeIndex].classList.remove("selected-task");
            if (activeIndex === 0) {
                currentCards[currentCards.length - 1].classList.add("selected-task");
            } else {
                currentCards[activeIndex - 1].classList.add("selected-task");
            }
        }
    }

    if (event.key === "Enter" && event.ctrlKey) {
        const currentCards = document.querySelectorAll(".tasks-list li");
        activeIndex = Array.from(currentCards).findIndex(card => card.classList.contains("selected-task"));
        console.log("Ctlr + Enter! Робот видит индекс:", activeIndex);
        if (activeIndex !== -1) {
            currentCards[activeIndex].querySelector("input").click();
        }

    }
    if (event.key === "/") {
        event.preventDefault();
        myInput.focus();
    }
});

// -commit "Автозапуск отрисовки при загрузке страницы"
renderTasks();


// -commit "SPA-коммутотор: переход на экран календаря"
btnCalendar.addEventListener("click", function () {
    sidebarMenu.classList.remove("open");
    [mainScreen, calendarScreen, goalsScreen, weekPlanScreen, timerScreen, habitsScreen, settingsScreen].forEach(screen => {
        screen.classList.add("hidden");
    });
    calendarScreen.classList.remove("hidden");
});

// -commit "SPA-коммутотор: переход на экран целей на период"
btnGoals.addEventListener("click", function () {
    sidebarMenu.classList.remove("open");
    [mainScreen, calendarScreen, goalsScreen, weekPlanScreen, timerScreen, habitsScreen, settingsScreen].forEach(screen => {
        screen.classList.add("hidden");
    });
    goalsScreen.classList.remove("hidden");
});

// -commit "SPA-коммутотор: переход на экран план на неделю"
btnWeekPlan.addEventListener("click", function () {
    sidebarMenu.classList.remove("open");
    [mainScreen, calendarScreen, goalsScreen, weekPlanScreen, timerScreen, habitsScreen, settingsScreen].forEach(screen => {
        screen.classList.add("hidden");
    });
    weekPlanScreen.classList.remove("hidden");
});

// -commit "SPA-коммутотор: переход на экран таймер"
btnTimer.addEventListener("click", function () {
    sidebarMenu.classList.remove("open");
    [mainScreen, calendarScreen, goalsScreen, weekPlanScreen, timerScreen, habitsScreen, settingsScreen].forEach(screen => {
        screen.classList.add("hidden");
    });
    timerScreen.classList.remove("hidden");
});

// -commit "SPA-коммутотор: переход на экран таймера привычек"
btnHabits.addEventListener("click", function () {
    sidebarMenu.classList.remove("open");
    [mainScreen, calendarScreen, goalsScreen, weekPlanScreen, timerScreen, habitsScreen, settingsScreen].forEach(screen => {
        screen.classList.add("hidden");
    });
    habitsScreen.classList.remove("hidden");
});

// -commit "SPA-коммутотор: переход на экран настроек"
btnSettings.addEventListener("click", function () {
    sidebarMenu.classList.remove("open");
    [mainScreen, calendarScreen, goalsScreen, weekPlanScreen, timerScreen, habitsScreen, settingsScreen].forEach(screen => {
        screen.classList.add("hidden");
    });
    settingsScreen.classList.remove("hidden");
});

// -commit "SPA-коммутотор: переход на главный экран"
btnGoHome.addEventListener("click", function () {
    sidebarMenu.classList.remove("open");
    [mainScreen, calendarScreen, goalsScreen, weekPlanScreen, timerScreen, habitsScreen, settingsScreen].forEach(screen => {
        screen.classList.add("hidden");
    });
    mainScreen.classList.remove("hidden");
});




function renderCalendar() {
    calendarGrid.innerHTML = "";
    calendarTitle.textContent = monthNames[currentMonth] + " " + currentYear;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let emptyCells;
    if (firstDay === 0) {
        emptyCells = 6;
    } else {
        emptyCells = firstDay - 1;
    }
    for (let j = 0; j < emptyCells; j++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("calendar-empty");
        calendarGrid.appendChild(emptyDiv);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.textContent = i;
        dayDiv.classList.add("calendar-day");
        calendarGrid.appendChild(dayDiv);
        dayDiv.addEventListener("click", function () {
            if (dayDiv.classList.contains("day-green")) {
                dayDiv.classList.remove("day-green");
                dayDiv.classList.add("day-red");
            } else if (dayDiv.classList.contains("day-red")) {
                dayDiv.classList.remove("day-red");
                dayDiv.classList.add("day-yellow");
            } else {
                dayDiv.classList.remove("day-yellow");
                dayDiv.classList.add("day-green");
            }
        });
    }
}
renderCalendar();


nextMonthBtn.addEventListener("click", function () {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

prevMonthBtn.addEventListener("click", function () {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});


function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    liveClock.textContent = hours + ":" + minutes + ":" + seconds;
    liveDate.textContent = now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
updateClock();
setInterval(updateClock, 1000);

pencilBtn.addEventListener("click", function () {
    goalsForm.classList.toggle("hidden");
});

addGoalBtn.addEventListener("click", function () {
    if (goalTitleInput.value.trim() === "")
        return;
    const newGoal = {
        id: Date.now(),
        title: goalTitleInput.value.trim(),
        deadline: goalDateInput.value,
        description: goalDescInput.value.trim(),
        isDone: false
    }
    goalsDatabase.push(newGoal);
    goalsForm.classList.add("hidden");
    goalTitleInput.value = "";
    goalDateInput.value = "";
    goalDescInput.value = "";
    renderGoals();
});

function renderGoals() {
    goalsList.innerHTML = "";
    goalsDatabase.forEach(function (goal, index) {
        const li = document.createElement("li");
        li.classList.add("goal-card");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = goal.isDone;
        checkbox.classList.add("goal-checkbox");
        checkbox.addEventListener("change", function () {
            goal.isDone = checkbox.checked;
            renderGoals();
        });
        const delBtn = document.createElement("button");
        delBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
        delBtn.classList.add("delete-goal-btn");
        delBtn.addEventListener("click", function () {
            goalsDatabase.splice(index, 1);
            renderGoals();
        });
        const span = document.createElement("span");
        span.classList.add("goal-number");
        span.textContent = (index + 1) + ".";
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("goal-content");
        const titleDiv = document.createElement("div");
        titleDiv.classList.add("goal-title");
        titleDiv.textContent = goal.title;
        const deadlineDiv = document.createElement("div");
        deadlineDiv.classList.add("goal-deadline");
        deadlineDiv.textContent = goal.deadline ? "Срок: " + goal.deadline : "Без срока";
        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(deadlineDiv);
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("goal-actions");
        actionsDiv.appendChild(checkbox);
        actionsDiv.appendChild(delBtn);
        li.appendChild(span);
        li.appendChild(contentDiv);
        li.appendChild(actionsDiv);
        goalsList.appendChild(li);
        titleDiv.addEventListener("click", function () {
            discriptionWindow.classList.remove("hidden");
            dWText.textContent = goal.description;
        });
    });

}

dWBtnClose.addEventListener("click", function () {
    discriptionWindow.classList.add("hidden");
});