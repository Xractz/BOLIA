const Temp = require("../supports/temp")
const { sendMessageWTyping } = require("../supports/message");
const { readData, updateData } = require("../supports/database");

class TimeoutClient {
  async execute(sock) {
    const now = Math.floor(Date.now() / 1000);
    const data = await readData();
    data.forEach(async (item) => {
      if (now >= item.timer && item.status === "online")
      {
        await Temp.deleteData(item.phoneNumber);
        await updateData(item.phoneNumber, { status: "offline", history: "home", timer: 0, room: "", date: "", time: ""});
        await sendMessageWTyping(sock, `${item.phoneNumber}@s.whatsapp.net`, {
          text: "Yahh.. dah 5 menit loh km anggurin aku😓😓\n\nBOLIA akhiri sesi yaa..\nSilahkan chat apapun untuk memulai sesi baru🤗\n\n_Terimakasih sudah menggunakan *BOLIA* 😽_\n\nGoodbye... 👋"
        });
      }
    });
  }
}

module.exports = { TimeoutClient : new TimeoutClient()};