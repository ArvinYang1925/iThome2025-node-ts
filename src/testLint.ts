import express from "express";

const app = express();

// 違反 1: sayHello 宣告但未使用
function sayHello(name: any) {
  // 違反 2: 用 any 型別（TypeScript 規則）
  var greeting = "Hello " + name; // 違反 3: 用 var 宣告

  let unusedVar = 42; // 違反 4: 未使用的變數
  console.log(greeting);
}

// 違反 5:請使用函式宣告式或箭頭函式，避免使用一般函式表達式
const a = function (name: string) {
  console.log(name);
};
a("Peter");

app.get("/test", (req, res) => {
  res.send("Test route");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
