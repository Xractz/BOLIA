const Data = require("../API/data");
var tempData = "", 
  temp, 
  tempTime;

const available = async (date) => {
  temp = { "availableRoom": "", "rooms": {} }
  try {
    let data;
    if (!date) {
      data = await Data.getRoom({ method: "available" });
      withoutDate(data);
    } else {
      data = await Data.getRoom({ method: "available", date });
      withDate(data);
    }
    temp["availableRoom"] = tempData;

    return temp;
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

const turnitinStatus = async (npm) => {
  try {
    const response = await Data.turnitinStatus({ npm: npm });
    const { data: { message } } = response;
    
    if (message === "Oooops..  NPM tidak terdaftar") {
      return false;
    }
    
    return turnitinStatusMessage(response);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

const turnitinUploadDocument = async (npm, title, media) => {
  try {
    let formData = new FormData();
    formData.append("npm", npm);
    formData.append("title", title);
    formData.append("file", media);
    
    const response = await Data.uploadDocument(formData);
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
    if (response.data === "NPM/NPP Not found") {
      return false;
    } 
    else {
      return { name: response.data.name, npm: response.data.npm };
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
};

const withDate = (data) => {
  tempData = "";
  for (const room in data) {
    tempTime = [];
    tempData += `🏠 ${room}\n`;
    const time = data[room];
    if (Array.isArray(time)){
      if (time.length === 0) {
        tempData = tempData.replace(`🏠 ${room}\n`, "");
      } else {
        time.forEach((time) => {
          tempData += `\t🕒 ${time}\n`;
          tempTime.push(time);
        });
        temp.rooms[room] = tempTime;
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

const turnitinStatusMessage = (response) => {
  let message = "";

  for (const row in response.data) {
    const { status, title } = response.data[row];
    message += `\n\n📚 Judul : *${title}*\n📝 Status : _${status}_`;
  }

  return message;
};

module.exports = { available, booked, booking, getNPM, turnitinStatus, turnitinUploadDocument };
