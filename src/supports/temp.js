const fs = require("fs").promises;

class Temp {
  constructor() {
    this.filename = "./src/Temp/temp.json";
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filename, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createData(jsonData) {
    try {

      const fileExists = await fs
        .access(this.filename)
        .then(() => true)
        .catch(() => false);
      if (!fileExists) {
        await fs.writeFile(this.filename, "[]", "utf8");
      }

      let data = [];
      const existingData = await fs.readFile(this.filename, "utf8");
      data = JSON.parse(existingData);

      let modified = false;
      data.forEach((entry) => {
        if (entry.phoneNumber === jsonData.phoneNumber) {
          entry.rooms = jsonData.rooms !== undefined ? jsonData.rooms : entry.rooms;
          entry.listRoom = jsonData.listRoom !== undefined ? jsonData.listRoom : entry.listRoom;
          entry.listTime = jsonData.listTime !== undefined ? jsonData.listTime : entry.listTime;
          modified = true;
        }
      });

      if(modified) {
        return await fs.writeFile(this.filename, JSON.stringify(data, null, 2), "utf8");
      } else {
        jsonData.listRoom = jsonData.listRoom !== undefined ? jsonData.listRoom : "";
        jsonData.listTime = jsonData.listTime !== undefined ? jsonData.listTime : "";
        data.push(jsonData);
        return await fs.writeFile(this.filename, JSON.stringify(data, null, 2), "utf8");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async readList(phoneNumber) {
    try {
      const jsonData = await this.readData();
      const data = jsonData.filter((entry) => entry.phoneNumber === phoneNumber);
      return data[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateData(phoneNumber, { rooms, listRoom, listTime }) {
    try {
      let jsonData = await this.readData();
      let modified = false;
      jsonData.forEach((entry) => {
        if (entry.phoneNumber === phoneNumber) {
          entry.rooms = rooms !== undefined ? rooms : entry.rooms;
          entry.listRoom = listRoom !== undefined ? listRoom : entry.listRoom;
          entry.listTime = listTime !== undefined ? listTime : entry.listTime;
          modified = true;
        }
      });

      if (modified) {
        await fs.writeFile(this.filename, JSON.stringify(jsonData, null, 2), "utf8");
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteData(phoneNumber) {
    try {
      let jsonData = await this.readData();
      const filteredData = jsonData.filter((entry) => entry.phoneNumber !== phoneNumber);
      await fs.writeFile(this.filename, JSON.stringify(filteredData, null, 4), "utf8");
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = new Temp();
