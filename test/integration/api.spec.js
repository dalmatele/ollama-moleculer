"use strict";

process.env.PORT = 0; // Use random ports during tests

const HTTPrequest = require("supertest");

const { ServiceBroker } = require("moleculer");
// Load service schemas
const APISchema = require("../../services/api.service");
const GreeterSchema = require("../../services/greeter.service");

describe("Test HTTP API gateway", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.sendToChannel = jest.fn();

	let greeterService = broker.createService(GreeterSchema);
	let apiService = broker.createService(APISchema);

	beforeAll(async () => {
		await broker.start();

		// Add small delay for API service to register product's custom endpoints
		await broker.Promise.delay(500);
	});
	afterAll(() => broker.stop());

	let PHONE_ID;

	describe('Test "greeter" endpoints', () => {
		it("test '/api/greeter/hello'", () => {
			return HTTPrequest(apiService.server)
				.get("/api/greeter/hello")
				.then(res => {
					expect(res.body).toEqual("Hello Moleculer");
				});
		});

		it("test '/api/unknown-route'", () => {
			return HTTPrequest(apiService.server)
				.get("/api/unknown-route")
				.then(res => {
					expect(res.statusCode).toBe(404);
				});
		});
	});

});


