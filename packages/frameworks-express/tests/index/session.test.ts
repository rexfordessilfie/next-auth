import { Response } from 'node-fetch';

const sessionJson = {
    user: {
        name: "John Doe",
        email: "test@example.com",
        image: "",
        id: "1234",
    },
    expires: "",
}

const sessionString = JSON.stringify(sessionJson);

jest.unstable_mockModule('@auth/core', () => ({
    Auth: jest.fn(
        (request, config) => {
            return new Response(
                sessionString,
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
        }
    )
}));

// dynamic import to avoid loading Auth before hoisting
const { getSession } = await import('../../src/index.js');
import { jest } from '@jest/globals';

import supertest from 'supertest';
import express from 'express';

if (!globalThis.fetch) {
    console.log("polyfill fetch");

    import('node-fetch').then(module => {
        // @ts-expect-error
        globalThis.fetch = module.default;
        // @ts-expect-error
        globalThis.Request = module.Request;
        // @ts-expect-error
        globalThis.Response = module.Response;
        // @ts-expect-error
        globalThis.Headers = module.Headers;
    });
}

// import cryptoLib from 'crypto';
// if (!globalThis.crypto) {
//     console.log("polyfill crypto");
//     // @ts-expect-error
//     globalThis.crypto = cryptoLib.webcrypto;
// }

describe("getSession return correct data", () => {

    let app: express.Express
    let client: supertest.SuperTest<supertest.Test>

    beforeEach(() => {
        app = express()
        client = supertest(app)
    })

    it("Should return the session if one is found", async () => {

        let expectations: Function = () => { }

        app.use(express.json())

        app.post("/", async (req, res) => {
            const session = await getSession(req, {
                providers: [],
                secret: "secret",
            })

            expectations = async () => {
                expect(session).toEqual(sessionJson);
            }

            res.send("OK")
        });

        await client
            .post("/")
            .set("X-Test-Header", "foo")
            .set("Accept", "application/json")

        await expectations()

    })

})