---
title: index
---

:::warning
`@auth/express` is currently experimental. The API _will_ change in the future.
:::

Express Auth is the official Express integration for Auth.js.
It provides a simple way to add authentication to your SvelteKit app in a few lines of code.

## Installation

```bash npm2yarn2pnpm
npm install @auth/core @auth/express
```

## Usage

```ts title="src/routes/auth.route.ts"
import { ExpressAuth } from "@auth/express"
import GitHub from "@auth/core/providers/github"
import express from "express"

const app = express()

// Make sure to use these body parsers so Auth.js can receive data from the client
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  "/api/auth",
  ExpressAuth({
    providers: [
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
  })
)
```

Don't forget to set the `AUTH_SECRET` environment variable. This should be a minimum of 32 characters, random string. On UNIX systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.

You will also need to load the environment variables into the Node.js environment. You can do this using a package like [`dotenv`](https://www.npmjs.com/package/dotenv).

### Provider Configuration

The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you mount the `ExpressAuth` handler on a different path:

```
[origin]/api/auth/callback/[provider]
```

## Signing in and signing out

Once your application is mounted you can sign in or out by making requests to the following [REST API endpoints](https://next-auth.js.org/getting-started/rest-api) from your client-side code.
NB: Make sure to include the `csrfToken` in the request body for all sign-in and sign-out requests.

## Managing the session

If you are using Express with a template engine (e.g EJS, Pug), you can make the session data available to all routes via middleware as follows

```ts title="app.ts"
import { getSession } from "@auth/express"

export function authSession(req: Request, res: Response, next: NextFunction) {
  res.locals.session = await getSession(req)
  next()
}

app.use(authSession)

// Now in your route
app.get("/", (req, res) => {
  const { session } = res.locals
  res.render("index", { user: session?.user })
})
```

## Authorization

You can protect routes by checking for the presence of a session and then redirect to a login page if the session is not present.
This can either be done per route, or for a group of routes using a middleware such as the following:

```ts
export function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = res.locals.session ?? (await getSession(req, authConfig))
  if (!session?.user) {
    res.redirect("/login")
  } else {
    next()
  }
}
```

### Per Route

To protect a single route, simply add the middleware to the route as follows:

```ts title="app.ts"
// ...

// This route is protected
app.get("/profile", authenticatedUser, (req, res) => {
  const { session } = res.locals
  res.render("profile", { user: session?.user })
})

// This route is not protected
app.get("/", (req, res) => {
  res.render("index")
})

app.use("/", root)
```

### Per Group of Routes

To protect a group of routes, define a router and add the middleware to the router as follows:

```ts title="routes/protected.route.ts"
import { Router } from "express"

const router = Router()
router.use(authenticatedUser) // All routes defined after this will be protected

router.get("/", (req, res) => {
  res.render("protected")
})

export default router
```

Then we mount the router as follows:

```ts title="app.ts"
import protected from "./routes/protected.route"
app.use("/protected", protected)
```

## Notes

:::info
PRs to improve this documentation are welcome! See [this file](https://github.com/nextauthjs/next-auth/blob/main/packages/frameworks-express/src/lib/index.ts).
:::
