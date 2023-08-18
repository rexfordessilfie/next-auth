jest.mock("@auth/core");

import { Request as ExpressRequest } from 'express';
import { getSession } from '../../src/index.js';
import * as authcore from '@auth/core';


describe("getSession return correct data", () => {
    afterEach(() => {
        jest.restoreAllMocks()
    })

    it("Should return the session if one is found", async () => {
        const mockRequest = {} as ExpressRequest;

        const sessionString = JSON.stringify({
            user: {
                name: "John Doe",
                email: "test@example.com",
                image: "",
                id: "1234",
            },
            expires: "",
        })

        const res = new Response(
            sessionString,
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const spy = jest.spyOn(authcore, "Auth")
        spy.mockResolvedValue(res)

        const session = await getSession(mockRequest, {
            providers: [],
            secret: "secret",
        })

        expect(session).toEqual(sessionString)
    })

})