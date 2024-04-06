const Home = require("../Actions/Message/home");
const Menu = require("../Actions/Message/menu");
const Book = require("../Actions/Message/book");
const Room = require("../Actions/Message/room");
const Time = require("../Actions/Message/time");
const Temp = require("../supports/temp")
const { updateData } = require("../supports/database");
const { getMessageCaption, getPhoneNumber, getMsgKey, randDelay } = require("../supports/message");

const historyHandler = {
  home: Home.execute,
  menu: Menu.execute,
  book: Book.execute,
  room: Room.execute,
  time: Time.execute,
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
          await updateData(getPhoneNumber(message), { history: "home", room: "", date: "", time: ""});
          return await Home.execute(sock, message);
        } else {
        await handler(sock, message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { historyHandler, Handlers: new Handlers() };
