const { defineConfig } = require("cypress");
const baseConfig = require("./cypress.config");

module.exports = defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: "https://qauto2.forstudy.space",
    env: {
      userEmail: "qauto2.cypress.1785501184@example.com",
      userPassword: "Password1",
    },
  },
});
