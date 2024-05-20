const { DATE } = require("../constants/date");

class Calculate {
  static calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    // Calculate age
    let age = DATE.TODAY.getFullYear() - birthDate.getFullYear();
    const monthDiff = DATE.TODAY.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && DATE.TODAY.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
}

module.exports = Calculate;
