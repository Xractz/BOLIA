const { updateData, onDB, checkData } = require("../../supports/database");
const { 
  sendMessageWTyping, 
  getPhoneNumber, 
  getJid 
} = require("../../supports/message");
var name;
class Home {
  async execute(sock, message) {
    try {
      const status = await onDB(getPhoneNumber(message));

      if (status)
      {
        name = await checkData(getPhoneNumber(message), "name");
      }

      const text = status
        ? `Halo, ${name}\n\nSelamat datang kembali di *BOLIA*\nUnoffical BOT Library UAJY\n\nSilahkan memilih menu di bawah ini :\n\n\t\`1\` Ketersediaan ruang\n\t\`2\` Pesan ruang`
        : "Selamat datang di *BOLIA*\nnUnoffical BOT Library UAJY\n\nDisini kamu bisa melihat ruang yang tersedia dan memesannya 🤗\n\nSilahkan memilih menu di bawah ini :\n\n\t`1` Ketersediaan ruang\n\t`2` Pesan ruang";
      await sendMessageWTyping(sock, getJid(message), { text });
      await updateData(getPhoneNumber(message), { status: "online", history: "menu" });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Home();
