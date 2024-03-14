"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const login_1 = __importDefault(require("./routes/login"));
const twitt_1 = __importDefault(require("./routes/twitt"));
const like_1 = __importDefault(require("./routes/like"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.get("/", (req, res) => {
    res.render("home");
});
app.use("/twitt", twitt_1.default);
app.use("/user", users_1.default);
app.use("/login", login_1.default);
app.use("/likes", like_1.default);
app.listen(PORT, () => {
    console.log(`https://localhost:${PORT}`);
});
