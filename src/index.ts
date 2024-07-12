// src/index.js
import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import {matchedData, query, validationResult} from 'express-validator';
import axios from "axios";
const https = require('https');


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const allowedParams = [
    "limit",
    "maxLength",
    "minLength",
    "tags",
    "author",
    "authorId"
];

app.use(express.json());
app.get("/search",
    query("limit").optional().isInt(),
    // query("tags").custom( value => {
    //     console.log("heee", value);
    //     if(!Array.isArray(value) && typeof value !== 'string'){
    //         console.log("error ?");
    //         throw new Error('tag is not well formatted');
    //     }
    // }),
    query("maxLength").optional().isInt(),
    query("minLength").optional().isInt(),
    query("author").optional().isString(),
    query("authorId").optional().isInt(),
    (req: Request, res: Response) => {
  // @ts-ignore

    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        let rawParams = Object.entries(req.query)
            .filter(([name, _], index) => allowedParams.includes(name))
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    let rawValue =  value.reduce(function (acc, value) {
                        return  acc + "|" + value;
                    });
                    return key+"="+rawValue
                }
                console.log(key + "=" + value);
                return key + "=" + value;
            })
            .reduce((acc, value, index) => index == 1 ? "?" + acc + "&" +value : acc + "&" + value);

        const url: string = "https://api.quotable.io/quotes/random?"+rawParams;

        console.log("url", url);


        //http://localhost:3000/search?author=victor%20hugo&tags[]=Famous%20Quotes&tags[]=test&maxLength=10
        axios.get(url).then((result) => {
            res.send({content: result.data});

        }).catch((exception) => {
            res.send({content: exception});

        });

    }else{
        res.send({ errors: result.array() });
    }

});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
