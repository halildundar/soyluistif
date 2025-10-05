import { config } from "dotenv";
config({ path: ["const.env"] });
import express from "express";
import { engine } from "express-handlebars";
import {
  list,
  calc,
  IsEq,
  BiggerThan,
  LessThan,
  Inc,
  Json,
  DigitFract,
  jsonld,
} from "./services/helpers/help.js";
import { appRoutes } from "./services/main.js";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import compression from "compression";
import cors from "cors";
import { SeoApp } from "./services/seo/mainApp.js";
export let HOST_NAME = ""
const app = express();
app.use(cors({ origin: true }));
let PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === "development") {
  HOST_NAME = "http://localhost:3000";
} else {
  // HOST_NAME = "https://crazy-noyce.89-250-72-218.plesk.page";
  HOST_NAME = "https://soyluistif.com.tr";
}
app.use(compression());
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 86400000 1 day
    },
  })
);
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: "views/layouts",
    partialsDir: ["views/partials"],
    helpers: { calc, list, IsEq, BiggerThan, LessThan, Inc, Json, DigitFract,jsonld },
  })
);
app.set("view engine", ".hbs");
app.set("views", `${process.cwd()}/views`);

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.text({ limit: "100mb" }));
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());

SeoApp(app);
appRoutes(app);

app.all("**", (req, res) => {
  res.render("pages/404.hbs", {
    title: "Kontrol Panel",
    scriptname: `main`,
  });
});

//****************************************/
// const io = new Server(server);
// io.on("connection", (socket) => {
//   console.log(socket.id); // x8WIv7-mJelg7on_ALbx
// });
// io.listen(SOCKET_PORT);
app.listen(PORT, () => {
  console.log(`Server is starting at ${PORT}`);
});
