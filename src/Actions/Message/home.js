const { updateData, onDB, checkData } = require("../../supports/database");
const { sendMessageWTyping, getPhoneNumber, getJid } = require("../../supports/message");

class Home {
  async execute(sock, message) {
    try {
      const status = await onDB(getPhoneNumber(message));
      const name = status ? await checkData(getPhoneNumber(message), "name") : "";

      const text = status
        ? `Halo, ${name}\n\nSelamat datang kembali di *BOLIA*\nUnoffical BOT Library UAJY\n\nSilahkan memilih menu di bawah ini :\n\n\t\`1\` Pesan ruang\n\t\`2\` Turnitin\n\n> Untuk keluar dari menu, ketik *0* atau *exit*`
        : "Selamat datang di *BOLIA*\nUnoffical BOT Library UAJY\n\nDisini kamu bisa melihat ruang yang tersedia dan memesannya 🤗\n\nSilahkan memilih menu di bawah ini :\n\n\t`1` Pesan ruang\n\t`2` Turnitin\n\n> Untuk keluar dari menu, ketik *0* atau *exit*";
      await sendMessageWTyping(sock, getJid(message), { text });
      await updateData(getPhoneNumber(message), { status: "online", history: "menu" });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new Home();
