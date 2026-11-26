const express = require("express");
const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync("database.db");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        isDone INTEGER DEFAULT 0
    )
`);

db.exec (`
    CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    deadline TEXT,
    description TEXT,
    isDone INTEGER DEFAULT 0
    )
`);



const PORT = 3000;

app.get("/", function(req, res){
    res.send("Привет, Сонни! Твой первый бэкенд-сервер официально работает!");
});

app.post("/api/tasks/toggle", function (req, res) {
    const taskId = Number(req.body.id);
    const isDoneValue = req.body.isDone ? 1 : 0;
    db.exec(`UPDATE tasks SET isDone = ${isDoneValue} WHERE id = ${taskId}`);
    res.json({ id: taskId, isDone: isDoneValue });
});

app.get("/api/tasks", function(req, res){
    const stmt = db.prepare("SELECT * FROM tasks");
    const tasksFromDb = stmt.all();
    res.json(tasksFromDb);
});

app.get("/api/goals", function(req, res){
    const stmt = db.prepare("SELECT * FROM goals");
    const goalsFromDb = stmt.all();
    res.json(goalsFromDb);
});

app.post("/api/tasks", function(req, res){
    const newTask = req.body;
    const stmt = db.prepare("INSERT INTO tasks (text, isDone) VALUES (?, ?)");
    const result = stmt.run(newTask.text, 0);
    res.json({
        id: Number(result.lastInsertRowid), 
        text: newTask.text,
        isDone: 0
    });
});
app.post("/api/goals", function(req, res){
    
});

app.listen(PORT, function(){
    console.log("Сервер запущен на http://localhost:" + PORT);
});