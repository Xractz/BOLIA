const Fetch = require("./fetch");

class Data {
  async getRoom({ method, date }) {
    try {
      let data, result;
      if (!date) {
        data = await Fetch.get(`https://lib-uajy.vercel.app/${method}`);
      } else {
        data = await Fetch.get(`https://lib-uajy.vercel.app/${method}/${date}`);
      }

      if (method == "booked") {
        result = data.bookedRoom;
      } else {
        result = data.roomAvailable;
      }

      return result;
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  async bookRoom(data) {
    try {
      const response = await Fetch.post("https://lib-uajy.vercel.app/booking", data);
      return response;
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }
}

module.exports = new Data();