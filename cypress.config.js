const { defineConfig } = require("cypress");
// import jetpack from "fs-jetpack";
const jetpack = require("fs-jetpack");


module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        writeDataToFile({data, filename}){
            const jetpack = require('fs-jetpack');
            const path = `./cypress/downloads/${filename}`;
            jetpack.write(path, data);
            return null;
        }
      })
    },
  },
});
