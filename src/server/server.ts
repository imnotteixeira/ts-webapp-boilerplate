import express from 'express';
import path from 'path';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom/server';
import { containerId } from '../shared/constants';

import ssrEntryPoint, { appProps } from './ssr';
import apiRoutes from "./api"


console.log('Server booting...');
const isProd = process.env.NODE_ENV === 'production';
console.log('Production optimization enabled? ', isProd);
const suffix = isProd ? '.production.min.js' : '.development.js';

const PORT = process.env.PORT || 4001;
const ASSETS_PORT = process.env.ASSETS_PORT || 4000;

const app = express()

app.use("/assets", express.static("assets"))

import webpack from "webpack";
const assetsWebpackConfig = require("../../assets.webpack.config.js");

import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

// Enable Webpack Dev Server in Dev Mode only
if(!isProd) {

    const compiler = webpack({
        ...assetsWebpackConfig,
        mode: "development"
    })

    app.use(webpackDevMiddleware(compiler, {
        publicPath: assetsWebpackConfig.output.publicPath,
        serverSideRender: true,
    }))
    
    app.use(webpackHotMiddleware(compiler))
}

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, './views'))
app.get("/", (req, res) => {
    res.render("index", {
        reactVersion,
        reactDomVersion,
        suffix,
        containerId,
        assetsPath: `http://localhost:${ASSETS_PORT}`,
        body: ssrEntryPoint,
        context: JSON.stringify({
            initialState: appProps
        })
    })
});

// API endpoints
app.use("/api", apiRoutes())

app.listen(PORT, () => { console.log(`Server started! Listening on ${PORT}`) })