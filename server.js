const express = require("express");
const app = express();

const {connectToMongoDB,addStudent,getStudents,getStudent,getStudentsByClass,counttotalStudents} = require("./db");

app.set("view engine", "ejs");
app.set("views", (__dirname, "templates"));
app.use(express.urlencoded());

app.get("/", async (req, res) => {
  const total = await counttotalStudents();
  res.render('index', { total: total });
});

app.get("/add-student", (req, res) => {
  res.render("add-student");
});

app.get("/view-all-students", async (req, res) => {
  const list = await getStudents();
  res.render("view-all-students", { students: list });
});

app.get('/profile', async (req, res) => {
  const id = req.query.id
  let student = null;

  if (id) {
    student = await getStudent(id);
  };

  res.render('student-profile', { student: student, id: id });
});

app.get('/class-students', async (req, res) => {
  const cls = req.query.class 
  let list = [];

  if (cls) {
    list = await getStudentsByClass(cls);
  }

  res.render('class-students', { students: list, selected: cls });
});


/////

app.post("/students", async (req, res) => {
  await addStudent(req.body.name, req.body.class, req.body.address , req.body.id);
  res.redirect("/add-student");
});

app.listen(3000, () => {
  console.log("App Started");
  console.log("Server running at http://localhost:3000/");
  connectToMongoDB();
});
