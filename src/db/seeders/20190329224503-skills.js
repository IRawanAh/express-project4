'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('skills', [
      { name: "HTML", created_at: new Date, updated_at: new Date }
      , { name: "CSS", created_at: new Date, updated_at: new Date }
      , { name: "Java", created_at: new Date, updated_at: new Date }
      , { name: "Angular", created_at: new Date, updated_at: new Date }
      , { name: "React", created_at: new Date, updated_at: new Date }
      , { name: "JavaScript", created_at: new Date, updated_at: new Date }
      , { name: "jQuery", created_at: new Date, updated_at: new Date }
      , { name: "Bootstrap", created_at: new Date, updated_at: new Date }
      , { name: "CoffeeScript", created_at: new Date, updated_at: new Date }
      , { name: "React native", created_at: new Date, updated_at: new Date }
      , { name: "Android studio", created_at: new Date, updated_at: new Date }
      , { name: "Xamrin", created_at: new Date, updated_at: new Date }
      , { name: "Unity", created_at: new Date, updated_at: new Date }
      , { name: "Ruby", created_at: new Date, updated_at: new Date }
      , { name: "Rails", created_at: new Date, updated_at: new Date }
      , { name: "Express", created_at: new Date, updated_at: new Date }
      , { name: "C#", created_at: new Date, updated_at: new Date }
      , { name: "C++", created_at: new Date, updated_at: new Date }
      , { name: "Ionic", created_at: new Date, updated_at: new Date }
      , { name: "Asp.net", created_at: new Date, updated_at: new Date }
      , { name: "PHP", created_at: new Date, updated_at: new Date }
      , { name: "Python", created_at: new Date, updated_at: new Date }



    ], {});

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('skills', null, {});

  }
};
