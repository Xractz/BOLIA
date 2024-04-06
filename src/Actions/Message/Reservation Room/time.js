const { updateData, data, checkData } = require("../../../supports/database");
const { isValidInput } = require("../../../supports/validate");
const Temp = require("../../../supports/temp");
const { booking } = require("../../../supports/fetch");
const { sendMessageWTyping, getMessageCaption, getPhoneNumber, getJid } = require("../../../supports/message");

class Time {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);
      const { listTime } = await Temp.readList(getPhoneNumber(message));

      if (isValidInput(msg, listTime)) {
        await updateData(getPhoneNumber(message), { history: "time", time: listTime[msg - 1] });
        const dataUser = await data(getPhoneNumber(message));
        const response = await booking(dataUser);
        const responseMsg = response.data.message;
        const sendRMsg = `
👤 Nama          : ${await checkData(getPhoneNumber(message), "name")}
🪪 NPM/NPP  : ${dataUser.npm}
🏠 Ruang         : ${dataUser.room}
📅 Tanggal      : ${dataUser.date}
🕒 Waktu         : ${dataUser.time}\n
> ${responseMsg}
`;
        if (responseMsg === "Booking Success, please check your email") {
          await sendMessageWTyping(sock, getJid(message), {
            text: `✅ *Pemesanan Berhasil*\n${sendRMsg}`,
          });
          await sendMessageWTyping(sock, getJid(message), {
            text: "Terimakasih telah menggunakan layanan kami 🥰",
          });
          await Temp.deleteData(getPhoneNumber(message));
          await updateData(getPhoneNumber(message), { history: "home", status: "offline", timer: 0, room: "", date: "", time: "" });
        } else if (responseMsg === "Waktu yang anda pilih sudah dibooking, silahkan memilih waktu yang kosong") {
          await sendMessageWTyping(sock, getJid(message), {
            text: `❌ *Pemesanan Gagal*\n${sendRMsg}`,
          });
        } else if (responseMsg === "Anda sudah booking di tanggal yang sama, silahkan memilih tanggal yang berbeda") {
          await sendMessageWTyping(sock, getJid(message), {
            text: `❌ *Pemesanan Gagal*\n${sendRMsg}`,
          });
        }
      } else {
        await sendMessageWTyping(sock, getJid(message), {
          text: `Maaf, waktu yang kamu pilih tidak sesuai\nSilahkan pilih waktu yang tersedia (1-${listTime.length})`,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Time();
