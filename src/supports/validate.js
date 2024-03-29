// const { checkData, updateData } = require('./database');
// const { getRawData } = require('./message');

// const validate = async ( phoneNumber ) => {
//   const data = await checkData(phoneNumber, "phoneNumber");
//   if (data) {
//     return true;
//   }
//   else {
//     await updateData(phoneNumber, getRawData(phoneNumber));
//   }
// };

const isDate = (date) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  if (date.length === 8 && !isNaN(date)) {
    if (date.substring(0, 2) <= 31 && date.substring(2, 4) <= 12 && date.substring(4, 8) >= year && date.substring(2, 4) >= month) {
      return true;
    }
  } else {
    return false;
  }
};

const date = (date, status) => {
  var days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const cvDate = `${date.substring(0, 2)}/${date.substring(2, 4)}/${date.substring(4, 8)}`;
  var day = new Date(date.substring(4, 8), date.substring(2, 4) - 1, date.substring(0, 2)).getUTCDay();
  day = days[day];
  if (status) {
    return `${day}, ${cvDate}`;
  }
  return cvDate;
};

const isID = (id) => {
  var regex = /^[0-9]{9,}$|^(\d+\.)+\d+$/;
  return regex.test(id);
};

module.exports = { isDate, date, isID };
