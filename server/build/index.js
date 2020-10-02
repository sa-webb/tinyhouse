"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const one = 1;
const two = 2;
// const three: boolean = false;
// const three: string = "one";
// const three: null = null;
// const three: undefined = undefined;
// const three: any = {};
app.get("/", (_req, res) => res.send(`1 + 2 = ${one + two}`));
console.log("server started");
