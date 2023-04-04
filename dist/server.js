"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// connection to mongodb
const uri = process.env.MONGODB_URI || "mongodb://localhost/todo_express";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose_1.default.connect(uri, options).then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));
// middlewares
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.set("view engine", "ejs");
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
// routes
const todo_1 = __importDefault(require("./routes/todo"));
app.use(todo_1.default);
// server configurations
const port = parseInt(process.env.PORT || "3100");
app.listen(port, () => console.log(`Server started listening on port: ${port}`));
