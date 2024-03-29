const { updateData, onDB, checkData } = require("../../supports/database");
const { 
  sendMessageWTyping, 
  getPhoneNumber, 
  getJid
} = require("../../supports/message");

class Home {
  async execute(sock, message) {
    try {
      if (await onDB(getPhoneNumber(message))) {
        const name = await checkData(getPhoneNumber(message), "name");
        await sendMessageWTyping(sock, getJid(message), {
          text: `Halo, ${name}\n\nSelamat datang di *BOLIA*\nUnofficai BOT Library UAJY\n\nDisini kamu bisa melihat ruang yang tersedia dan memesannya 🤗\n\nSilahkan memilih menu di bawah ini :\n\n\t\`1\` Ketersediaan ruang\n\t\`2\` Pesan ruang`,
        });
      } else {
        await sendMessageWTyping(sock, getJid(message), {
          text: "Selamat datang di *BOLIA*\nUnofficai BOT Library UAJY\n\nDisini kamu bisa melihat ruang yang tersedia dan memesannya 🤗\n\nSilahkan memilih menu di bawah ini :\n\n\t`1` Ketersediaan ruang\n\t`2` Pesan ruang",
        });
      }
      
      await updateData(getPhoneNumber(message), { status: "online", history: 'menu' });
    } catch (error) {
      console.error(error);
    }
  }

}

module.exports = new Home();