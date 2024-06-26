const isDate = (date) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  if (date.length === 8 && !isNaN(date)) {
    const inputYear = parseInt(date.substring(4, 8));
    const inputMonth = parseInt(date.substring(2, 4));
    const inputDay = parseInt(date.substring(0, 2));

    if (inputMonth === 2 && inputDay > 28) {
      return "Wrong day!";
    }

    if (inputDay <= 31 && inputMonth <= 12 && inputYear >= year) {
      if (inputMonth === month && inputDay >= day) {
        return "Eligible";
      } 
      else if (inputYear >= year) {
        return "Eligible";
      }
      else {
        return "Wrong day!";
      }
    }
    return "Wrong date!";
  }
  return "Wrong format!";
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

const isValidInput = (input, data) => {
  return input >= 1 && input <= data.length
}

module.exports = { isDate, date, isID, isValidInput };
