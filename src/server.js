import { config } from "dotenv";
config({ path: ["const.env"] });
import express from "express";
import { engine } from "express-handlebars";
import { list, calc,IsEq,BiggerThan,LessThan,Inc,Json } from "./services/helpers/help.js";
import { appRoutes } from "./services/main.js";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cookieParser from 'cookie-parser';
import session from "express-session";
import passport from "passport";
import compression from "compression";
import cors from "cors";
const app = express();
app.use(cors({ origin: true }));
// const server = require('http').createServer(app);
// import { Server } from "socket.io";
let PORT = process.env.PORT || 3000;
// let SOCKET_PORT = process.env.SOCKET_PORT || 3001;
//only development mode
if (process.env.NODE_ENV === "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(process.cwd());
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  console.log("port--->", PORT, process.cwd());
  app.use(connectLiveReload());
}else{
  app.use(compression());
}
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: "views/layouts",
    partialsDir: ["views/partials"],
    helpers: { calc, list, IsEq,BiggerThan,LessThan,Inc,Json },
  })
);
app.set("view engine", ".hbs");
app.set("views", `${process.cwd()}/views`);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: '100mb',extended: true }));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.text({ limit: '100mb' }))
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
appRoutes(app);
app.all("**", (req, res) => {
  res.render("pages/404.hbs",{
    title:'Kontrol Panel',
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

