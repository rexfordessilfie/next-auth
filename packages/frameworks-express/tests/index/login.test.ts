import supertest from 'supertest';
import express from 'express';
const { ExpressAuth, getSession } = await import('../../src/index.js');

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

import cryptoLib from 'crypto';
if (!globalThis.crypto) {
    console.log("polyfill crypto");
    // @ts-expect-error
    globalThis.crypto = cryptoLib.webcrypto;
}

import CredentialsProvider from "@auth/core/providers/credentials";
export const authConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "jsmith",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const name = (credentials.username as string) || "John Smith";
                const user = {
                    id: "1",
                    name,
                    email: name.replace(" ", "") + "@example.com",
                };

                return user;
            },
        }),
    ],
};

const extractCookieValue = (headerArray, name) => {
    const cookieStringFull = headerArray.find(header => header.includes(name));
    return name + cookieStringFull.split(name)[1].split(";")[0];
};

describe("Integration test with login and get Session", () => {

    let app: express.Express
    let client: supertest.SuperTest<supertest.Test>

    beforeEach(() => {
        app = express()
        client = supertest(app)
    })

    it("Should return the session after loggin in", async () => {

        let expectations: Function = () => { }

        app.use(express.json())
        app.use(express.urlencoded({ extended: true }));

        app.use("/api/auth/*", ExpressAuth(authConfig));

        app.post("/test", async (req, res) => {
            const session = await getSession(req, authConfig)

            expectations = async () => {
                expect(session?.user?.name).toEqual('johnsmith');
            }

            res.send("OK")
        });

        // Get signin page
        const response = await client
            .get("/api/auth/signin")
            .set("X-Test-Header", "foo")
            .set("Accept", "application/json");


        // Parse cookies for csrf token and callback url
        const csrfTokenCookie = extractCookieValue(response.headers["set-cookie"], "next-auth.csrf-token");
        const callbackCookie = extractCookieValue(response.headers["set-cookie"], "next-auth.callback-url");
        const csrfTokenValue = csrfTokenCookie.split("%")[0].split("=")[1];

        // Sign in
        const responseCredentials = await client
            .post("/api/auth/callback/credentials")
            .set("Cookie", [`${csrfTokenCookie}; ${callbackCookie}`]) // Send the cookie with the request
            .send({
                csrfToken: csrfTokenValue,
                username: "johnsmith",
                password: "ABC123"
            });
        
        // Parse cookie for session token
        const sessionTokenCookie = extractCookieValue(responseCredentials.headers["set-cookie"], "next-auth.session-token");

        // Call test route
        await client
            .post("/test")
            .set("X-Test-Header", "foo")
            .set("Accept", "application/json")
            .set("Cookie", [`${csrfTokenCookie}; ${callbackCookie}; ${sessionTokenCookie}`]) // Send the cookie with the request

        await expectations()

    })

})