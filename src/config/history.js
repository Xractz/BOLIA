const Home = require("../Actions/Message/home");
const Menu = require("../Actions/Message/menu");
const Book = require("../Actions/Message/book");
const Room = require("../Actions/Message/room");
const Time = require("../Actions/Message/time");

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
        await handler(sock, message);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = { historyHandler, Handlers: new Handlers() };
