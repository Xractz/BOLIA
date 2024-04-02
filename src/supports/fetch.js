const Data = require("../API/data");
var tempData = "";

const available = async (date) => {
  try {
    let data;
    if (!date) {
      data = await Data.getRoom({ method: "available" });
      withoutDate(data);
    } else {
      data = await Data.getRoom({ method: "available", date });
      withDate(data);
    }

    return tempData;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

const booked = async (date) => {
  try {
    let data;
    if (!date) {
      data = await Data.getRoom({ method: "booked" });
      withoutDate(data);
    } else {
      data = await Data.getRoom({ method: "booked", date });
      withDate(data);
    }

    return tempData;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

const booking = async (data) => {
  try {
    const response = await Data.bookRoom(data);
    return response;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

const getNPM = async (npm) => {
  try {
    data = {
      npm,
      room: "",
      date: "",
      time: "",
    };

    const response = await booking(data);
    return { name: response.data.name, npm: response.data.npm };
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

const withDate = (data) => {
  tempData = "";
  for (const room in data) {
    tempData += `🏠 ${room}\n`;
    const time = data[room];
    if (Array.isArray(time)){
      if (time.length === 0) {
        tempData = tempData.replace(`🏠 ${room}\n`, "");
      } else {
      time.forEach((time) => {
        tempData += `\t🕒 ${time}\n`;
      });
      }
    }
    else {
      tempData = "";
    }
  }
};

const withoutDate = (data) => {
  tempData = "";
  for (const date in data) {
    tempData += `📅 ${date}\n`;
    for (const room in data[date]) {
      tempData += `\t🏠 ${room}\n`;
      const time = data[date][room];
      time.forEach((time) => {
        tempData += `\t\t🕒 ${time}\n`;
      });
    }
    tempData += "\n";
  }
};

module.exports = { available, booked, booking, getNPM };
