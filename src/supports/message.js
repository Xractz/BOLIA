const { delay } = require("@whiskeysockets/baileys");

const getJid = (message) => {
  return message?.key.remoteJid;
};

const getPhoneNumber = (message) => {
  return getJid(message).split("@")[0];
};

const getMsgKey = (message) => {
  return message?.key;
};

const getTimeStamp = (message) => {
  return message?.messageTimestamp;
};

const setTimer = (message) => {
  return getTimeStamp(message) + 300;
};

const isFromMe = (message) => {
  return message?.key.fromMe;
};

const isOnGroup = (message) => {
  return getJid(message).includes("@g.us");
};

const getMessageCaption = (message) => {
  return (
    message?.conversation ||
    message?.message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.message?.extendedTextMessage?.text ||
    null
  );
};

const getDate = () => {
  let date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${date.getDate()}/${month}/${date.getFullYear()}`;
};

const isClient = (message) => {
  return !isFromMe(message) && !isOnGroup(message);
};

const sendMessageWTyping = async (sock, jid, msg) => {
  await sock.presenceSubscribe(jid);
  await delay(500);
  await sock.sendPresenceUpdate("composing", jid);
  await delay(2000);
  await sock.sendPresenceUpdate("paused", jid);
  await sock.sendMessage(jid, msg);
};

module.exports = {
  getJid,
  getPhoneNumber,
  getMsgKey,
  getTimeStamp,
  setTimer,
  isFromMe,
  isOnGroup,
  getMessageCaption,
  getDate,
  isClient,
  sendMessageWTyping,
};
