"use strict";

const ApiGateway = require("moleculer-web");
const includeAll = require('include-all');
const _ = require('lodash');
const {MoleculerError} = require("moleculer").Errors;
const jwt = require("jsonwebtoken");
const config = require("../config/config");


let routeInfo = includeAll({
	dirname: require('path').resolve(__dirname, '..//routes'),
	filter: /(.+)\.route.js$/,
	excludeDirs: /^\.(git|svn)$/
}) || {};
const routes = _.concat([], _.values(routeInfo));

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 * @typedef {import('moleculer-web').ApiSettingsSchema} ApiSettingsSchema API Setting Schema
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "api",

	/**
	 * Mixins. More info: https://moleculer.services/docs/0.15/services.html#Mixins
	 */
	mixins: [
		ApiGateway,
	],

	/** @type {ApiSettingsSchema} More info: https://moleculer.services/docs/0.15/moleculer-web.html */
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.15/moleculer-web.html#Middlewares
		use: [],

		routes: routes,
		cors: {
			origin: "*",
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			exposedHeaders: [
				"Content-Disposition"
			]
		},

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.15/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
		}

		/** @type {import('moleculer-io').IOSetting} */
		// io: {},
	},

	/**
	 * Methods. More info: https://moleculer.services/docs/0.15/services.html#Methods
	 */
	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			let auth = req.headers["authorization"];

			const auths = auth.split(" ");
			if(auths.length >= 2){
				if(auths[0] !== "Bearer"){
					throw new MoleculerError("Invalid token", 401, "UNAUTHORIZED");
				}
				auth = auths[1];
			}
			if(auth){
				try{
					const object = jwt.verify(auth, config.secretPassword);
					return {};
				}catch(err){
					console.log(err);
					throw new MoleculerError("Invalid token", 401, "UNAUTHORIZED");
				}
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			// Get the authenticated user.
			const user = ctx.meta.user;

			// It check the `auth` property in action schema.
			if (req.$action.auth == "required" && !user) {
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
			}
		}
	}
};
