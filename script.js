// -commit "Глобальные переменные"
const myInput = document.querySelector(".todo-form input");
const myBtn = document.querySelector(".todo-form button");
const tasksContainer = document.querySelector("#tasksContainer");
let activeIndex = -1; 

// -commit "База данных"

const myDatabase = JSON.parse(localStorage.getItem("myTaskArray")) || [];

// -commit "Счётчик Задач"

let taskNumber = myDatabase.length;

// -commit "Главная функция ввода"
function main() {
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


    // -commit "Запись в базу данный и на диск"
    taskNumber++;
    myDatabase.push(taskObject);
    localStorage.setItem("myTaskArray", JSON.stringify(myDatabase));

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
        if (task.isDone === true) {
            checkbox.checked = true;
            span.style.textDecoration = "line-through";
        }
        checkbox.addEventListener("change", function () {
            task.isDone = checkbox.checked;
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