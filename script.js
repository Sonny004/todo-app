// -commit "Глобальные переменные"
const myInput = document.querySelector(".todo-form input");
const myBtn = document.querySelector(".todo-form button");
const tasksContainer = document.querySelector("#tasksContainer");

// -commit "База данных"

const myDatabase = JSON.parse(localStorage.getItem("myTaskArray")) || [];

// -commit "Счётчик Задач"

let taskNumber = myDatabase.length;

// -commit "Главная функция ввода"
function main() {
    const userText = myInput.value.trim();
    if (userText === "") {
        alert("Не ленись уёбище, введи задачу!");
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
    myDatabase.forEach(function (task) {
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
        tasksContainer.appendChild(li)
    });
}

// -commit "Датчики событий"
myBtn.addEventListener("click", main);
window.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        main();
    }
});

// -commit "Автозапуск отричовки при загрузке страницы"
renderTasks();