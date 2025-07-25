import * as io from "socket.io-client";
$(async function () {
  const socket = io();
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });
  console.log("socket");
});
