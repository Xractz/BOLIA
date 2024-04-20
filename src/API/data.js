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

  async turnitinStatus(data) {
    try {
      const response = await Fetch.post("https://lib-uajy.vercel.app/turnitin/status", data);
      return response;
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  }

  async uploadDocument(formData, maxRetries = 3, delayBetweenRetries = 1000) {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const uploadUrl = "https://lib-uajy.vercel.app/turnitin";

        const options = {
          method: "POST",
          body: formData,
        };

        const response = await fetch(uploadUrl, options);
        const responseData = await response.json();

        if ( responseData ) {
          return responseData;
        }
      } catch (error) {
        if (error.code === "ECONNREFUSED" || error.code === "ECONNRESET") {
          console.error(`Connection error: ${error.message}. Retrying...`);
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
        } else {
          throw error;
        }
      }
    }

    throw new Error(`Upload failed after ${maxRetries} attempts`);
  }
}

module.exports = new Data();