"use strict";
require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Walnut listening on port [${port}]`);
});
