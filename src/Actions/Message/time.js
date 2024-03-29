const { isDate, date } = require("../../supports/validate");
const { updateData, data } = require("../../supports/database");
const { booking } = require("../../supports/fetch");
const { sendMessageWTyping, getMessageCaption, getPhoneNumber, getJid } = require("../../supports/message");

class Time {
  async execute(sock, message) {
    try {
      const msg = getMessageCaption(message);

      const timeHandler = {
        1: "08.00 - 09.30 WIB",
        2: "09.30 - 11.00 WIB",
        3: "11.00 - 12.30 WIB",
        4: "12.30 - 14.00 WIB",
        5: "14.00 - 15.30 WIB",
        6: "15.30 - 17.00 WIB",
        7: "17.00 - 18.30 WIB",
      };

      if (msg in timeHandler) {
        const dataUser = await data(getPhoneNumber(message));
        dataUser.time = timeHandler[msg];
        const response = await booking(dataUser);
        const responseMsg = response.data.message;

        if (responseMsg === "Booking Success, please check your email")
        {
          await sendMessageWTyping(sock, getJid(message), {
            text: `✅ *Pemesanan Berhasil*\n\n🏠 Ruang  : ${dataUser.room}\n📅 Tanggal  : ${dataUser.date}\n🕒 Waktu  : ${dataUser.time}\n\n> ${responseMsg}`,
          });
          await sendMessageWTyping(sock, getJid(message), {
            text: "Terimakasih telah menggunakan layanan kami 🥰",
          });
          await updateData(getPhoneNumber(message), { history: "home", status: "offline", timer: 0, room: "", date: "", time: "" });
        }
        else if (responseMsg === "Waktu yang anda pilih sudah dibooking, silahkan memilih waktu yang kosong")
        {
          await sendMessageWTyping(sock, getJid(message), {
            text: `❌ *Pemesanan Gagal*\n\n🏠 Ruang\  : ${dataUser.room}\n📅 Tanggal  : ${dataUser.date}\n🕒 Waktu  : ${dataUser.time}\n\n> ${responseMsg}`,
          });
        }
        else if (responseMsg === "Anda sudah booking di tanggal yang sama, silahkan memilih tanggal yang berbeda")
        {
          await sendMessageWTyping(sock, getJid(message), {
            text: `❌ *Pemesanan Gagal*\n\n🏠 Ruang\  : ${dataUser.room}\n📅 Tanggal  : ${dataUser.date}\n🕒 Waktu  : ${dataUser.time}\n\n> ${responseMsg}`,
          });
        }
      }
      else if (msg != "1" || msg != "2" || msg != "3" || msg != "4" || msg != "5" || msg != "6" || msg != "7")
      {
        await sendMessageWTyping(sock, getJid(message), {
          text: "Maaf, waktu yang kamu pilih tidak sesuai\nSilahkan pilih waktu yang tersedia (1-7)",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Time();
