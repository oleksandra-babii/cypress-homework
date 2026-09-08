const { defineConfig } = require("cypress");
const baseConfig = require("./cypress.config");

module.exports = defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: "https://qauto.forstudy.space",
    env: {
      userEmail: "qauto.cypress.1785501177@example.com",
      userPassword: "Password1",
    },
  },
});
