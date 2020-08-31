import express from "express";
import multer from "multer";
import session from "express-session";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ dest: "upload/" });

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("upload"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "type what you want",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => res.render("home", { auth: req.session.auth }));
app.get("/list", (req, res) => {
  fs.readdir("upload", (_, files) => {
    res.render("list", { files, auth: req.session.auth });
  });
});

app.post("/login", (req, res) => {
  const { id, password } = req.body;
  if (id !== "type what you want" || password !== "type what you want") {
    return res.redirect("/");
  } // 📌 id와 password 둘 중 하나라도 일치하지 않으면 관리자 로그인을 진행하지 않습니다.
  req.session.auth = true;
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.auth = false;
  res.redirect("/");
});

app.post("/upload", upload.single("file"), (req, res) => {
  const { originalname, path } = req.file;
  fs.rename(path, `upload/${originalname}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.render("home", { auth: req.session.auth });
});

app.get("/delete/:name", (req, res) => {
  const { name } = req.params;
  fs.unlinkSync(`upload/${name}`);
  fs.readdir("upload", (_, files) =>
    res.render("list", { files, auth: req.session.auth })
  );
});

app.listen(4000, () => console.log("Good"));
