"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./lib/db");
const dotenv_safe_1 = require("dotenv-safe");
const socket_1 = require("./lib/socket");
require("./app");
(0, dotenv_safe_1.config)();
const PORT = process.env.PORT;
socket_1.server.listen(PORT, () => {
    console.log(`Server is listen on PORT:${PORT}`);
    (0, db_1.connectDB)();
});
