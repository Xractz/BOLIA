const { execute: home } = require("../Actions/Message/home");
const { execute: menu } = require("../Actions/Message/menu");
const { execute: book } = require("../Actions/Message/Reservation Room/book");
const { execute: room } = require("../Actions/Message/Reservation Room/room");
const { execute: time } = require("../Actions/Message/Reservation Room/time");
const { execute: Thome } = require("../Actions/Message/Turnitin/home");

const Temp = require("../supports/temp");
const { updateData } = require("../supports/database");
const { getMessageCaption, getPhoneNumber, getMsgKey, randDelay } = require("../supports/message");

const historyHandler = {
  home,
  menu,
  book,
  room,
  time,
  Thome,
};

class Handlers {
  async execute(sock, message, history) {
    try {
      const handler = historyHandler[history];
      if (handler) {
        await randDelay();
        sock.readMessages([getMsgKey(message)]);
        const msg = getMessageCaption(message);
        if (msg === "0" || msg === "exit") {
          if (history === "menu") {
            return await handler(sock, message);
          }
          await Temp.deleteData(getPhoneNumber(message));
          await updateData(getPhoneNumber(message), { history: "home", room: "", date: "", time: "" });
          return await home(sock, message);
        }
        await handler(sock, message);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { historyHandler, Handlers: new Handlers() };
