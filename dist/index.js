"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.js
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
const axios_1 = __importDefault(require("axios"));
const https = require('https');
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const allowedParams = [
    "limit",
    "maxLength",
    "minLength",
    "tags",
    "author",
    "authorId"
];
app.use(express_1.default.json());
app.get("/search", (0, express_validator_1.query)("limit").optional().isInt(), 
// query("tags").custom( value => {
//     console.log("heee", value);
//     if(!Array.isArray(value) && typeof value !== 'string'){
//         console.log("error ?");
//         throw new Error('tag is not well formatted');
//     }
// }),
(0, express_validator_1.query)("maxLength").optional().isInt(), (0, express_validator_1.query)("minLength").optional().isInt(), (0, express_validator_1.query)("author").optional().isString(), (0, express_validator_1.query)("authorId").optional().isInt(), (req, res) => {
    // @ts-ignore
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        const data = (0, express_validator_1.matchedData)(req);
        let rawParams = Object.entries(req.query)
            .filter(([name, _], index) => allowedParams.includes(name))
            .map(([key, value]) => {
            if (Array.isArray(value)) {
                let rawValue = value.reduce(function (acc, value) {
                    return acc + "|" + value;
                });
                return key + "=" + rawValue;
            }
            console.log(key + "=" + value);
            return key + "=" + value;
        })
            .reduce((acc, value, index) => index == 1 ? "?" + acc + "&" + value : acc + "&" + value);
        const url = "https://api.quotable.io/quotes/random?" + rawParams;
        console.log("url", url);
        //http://localhost:3000/search?author=victor%20hugo&tags[]=Famous%20Quotes&tags[]=test&maxLength=10
        axios_1.default.get(url).then((result) => {
            res.send({ content: result.data });
        }).catch((exception) => {
            res.send({ content: exception });
        });
    }
    else {
        res.send({ errors: result.array() });
    }
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
