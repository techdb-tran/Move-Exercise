const { envConfig } = require("../constants/config");
const axios = require("axios");

class Convert {
  static getCountryNameByCode = async (countryCode) => {
    try {
      const response = await axios.get(
        `${envConfig.countryStateCityApiUrl}/countries/${countryCode}`,
        {
          headers: {
            "X-CSCAPI-KEY": envConfig.yourApiKey,
          },
        }
      );

      const countryName = response.data.name;

      return countryName;
    } catch (error) {
      console.error("Error fetching country name:", error.message);
      return null;
    }
  };

  static getStateNameByCode = async (countryCode, stateCode) => {
    try {
      const response = await axios.get(
        `${envConfig.countryStateCityApiUrl}/countries/${countryCode}/states/${stateCode}`,
        {
          headers: {
            "X-CSCAPI-KEY": envConfig.yourApiKey,
          },
        }
      );

      const stateName = response.data.name;

      return stateName;
    } catch (error) {
      console.error("Error fetching state name:", error.message);
      return null;
    }
  };
}

module.exports = Convert;
