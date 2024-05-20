"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          name: "MMA",
          is_show: true,
          image_url:
            "https://res.cloudinary.com/dezcltf7s/image/upload/v1712218111/categories/Group_1835_xtrbdb.png",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "HIIT",
          is_show: true,
          image_url:
            "https://res.cloudinary.com/dezcltf7s/image/upload/v1712218124/categories/Group_1837_rhdlvs.png",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Just Move",
          is_show: true,
          image_url:
            "https://res.cloudinary.com/dezcltf7s/image/upload/v1712218126/categories/Group_1708_s9nfx7.png",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Strength",
          is_show: true,
          image_url:
            "https://res.cloudinary.com/dezcltf7s/image/upload/v1712218128/categories/Group_1839_boze7v.png",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Yoga",
          is_show: true,
          image_url:
            "https://res.cloudinary.com/dezcltf7s/image/upload/v1712218130/categories/Group_1716_uktfap.png",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Low Impact",
          is_show: true,
          image_url:
            "https://res.cloudinary.com/dezcltf7s/image/upload/v1712218108/categories/Group_1721_dbwn8z.png",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
