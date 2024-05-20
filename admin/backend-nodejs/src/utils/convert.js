// const convertToCSV = (usersData) => {
//   const csvHeaders = ["index", ...Object.keys(usersData[0])];

const { REGEX } = require("../constants/regex");

//   const csvRows = usersData.map((user, index) => {
//     const userWithIndex = { index: index + 1, ...user };

//     return csvHeaders
//       .map((header) => {
//         console.log(header);
//         let value = userWithIndex[header];

//         if (typeof value !== "string") {
//           if (value instanceof Date) {
//             value = value.toISOString();
//           } else {
//             value = String(value);
//           }
//         }

//         if (value.includes(",")) {
//           value = `'${value}'`;
//         }

//         return value;
//       })
//       .join(",");
//   });

//   const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

//   return csvContent;
// };

class Convert {
  static convertToCSV = (usersData) => {
    const csvHeaders = ["Index", ...Object.keys(usersData[0])];

    // Function to convert snake_case to Title Case with spaces
    const snakeToTitleCase = (str) => {
      return str
        .replace(REGEX.UNDERSCORE_REGEX_GLOBAl, " ")
        .replace(REGEX.WORLD_START_CHARACTER_REGEX, (c) => c.toUpperCase());
    };

    // Convert headers to desired format
    const formattedHeaders = csvHeaders.map((header) =>
      header === "Index" ? header : snakeToTitleCase(header)
    );

    const csvRows = usersData.map((user, index) => {
      const userWithIndex = { Index: index + 1, ...user };

      return formattedHeaders
        .map((header) => {
          let value =
            userWithIndex[
              header.toLowerCase().replace(REGEX.WHITESPACE_REGEX_GLOBAL, "_")
            ];

          if (typeof value !== "string") {
            if (value instanceof Date) {
              value = value.toISOString();
            } else {
              value = String(value);
            }
          }

          if (value.includes(",")) {
            value = `'${value}'`;
          }

          return value;
        })
        .join(",");
    });

    const csvContent = [formattedHeaders.join(","), ...csvRows].join("\n");

    return csvContent;
  };
}

module.exports = Convert;
