const fs = require("fs").promises;

class Database {
  constructor(filename) {
    this.filename = filename;
    (async () => {
      const fileExists = await fs
        .access(this.filename)
        .then(() => true)
        .catch(() => false);
      if (!fileExists) {
        await fs.writeFile(this.filename, "[]", "utf8");
      }
    })();
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
      let data = [];
      const existingData = await fs.readFile(this.filename, "utf8");
      data = JSON.parse(existingData);
      data.push(jsonData);
      await fs.writeFile(this.filename, JSON.stringify(data, null, 2), "utf8");
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateData(phoneNumber, { name, npm, history, status, timer, room, date, time}) {
    try {
      let jsonData = await this.readData();
      let modified = false;
      jsonData.forEach((entry) => {
        if (entry.phoneNumber === phoneNumber) {
          entry.name = name !== undefined ? name : entry.name;
          entry.npm = npm !== undefined ? npm : entry.npm;
          entry.history = history !== undefined ? history : entry.history;
          entry.status = status !== undefined ? status : entry.status;
          entry.timer = timer !== undefined ? timer : entry.timer;
          entry.room = room !== undefined ? room : entry.room;
          entry.date = date !== undefined ? date : entry.date;
          entry.time = time !== undefined ? time : entry.time;
          modified = true;
        }
      });

      if (modified) {
        await fs.writeFile(this.filename, JSON.stringify(jsonData, null, 2), "utf8");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async checkData(phoneNumber, key) {
    try {
      let jsonData = await this.readData();
      let data = "";
      jsonData.forEach((entry) => {
        if (entry.phoneNumber === phoneNumber) {
          data = entry[key];
        }
      });
      return data;
      } catch (error) {
      console.error(error);
      throw error;
    }
  }

}

module.exports = Database;