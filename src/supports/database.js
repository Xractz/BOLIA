const Database = require("../Database/Database");
const db = new Database("./src/Database/database.json");

const getRawData = (phoneNumber) => {
  return {
    phoneNumber: phoneNumber,
    name: "",
    npm: "",
    history: "home",
    status: "offline",
    timer: 0,
    room: "",
    date: "",
    time: "",
  };
};

const checkData = async (phoneNumber, key) => {
  return await db.checkData(phoneNumber, key);
};

const createData = async (rawData) => {
  return await db.createData(rawData);
};

const readData = async () => {
  return await db.readData();
};

const updateData = async (phoneNumber, data) => {
  return await db.updateData(phoneNumber, data);
};

const onDB = async (message) => {
  if (await checkData(message, "name") && checkData(message, "npm")){
    return true;
  }
  else {
    return false;
  }
};

let data = async (phoneNumber) => {
  return data = {
    npm: await checkData(phoneNumber, "npm"),
    room: await checkData(phoneNumber, "room"),
    date: await checkData(phoneNumber, "date"),
    time: "",
  };
}

module.exports ={
  onDB,
  data,
  checkData,
  getRawData,
  createData,
  readData,
  updateData
}