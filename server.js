const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", function(req, res){
    res.send("Привет, Сонни! Твой первый бэкенд-сервер официально работает!");
});

app.listen(PORT, function(){
    console.log("Сервер запущен на http://localhost:" + PORT);
});

app.get("/api/test", function(req, res){
    res.json({status: "ok", user: "Sonny", taskCount: 5 });
});