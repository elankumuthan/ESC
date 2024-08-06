const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false, // Disable Chrome's web security
    experimentalOriginDependencies: true,
    experimentalMemoryManagement: true,
    experimentalWebKitSupport: true,
  },
  env: {
    editor: 'code', // Set Visual Studio Code as the default editor
  },
});
