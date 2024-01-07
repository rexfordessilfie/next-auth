> The example repository is maintained from a [monorepo](https://github.com/nextauthjs/next-auth/tree/main/apps/examples/express). Pull Requests should be opened against [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth).

<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank">
   <img height="64" src="https://authjs.dev/img/logo/logo-sm.png" />
   </a>
   <a href="https://kit.svelte.dev" target="_blank">
   <img height="64" src="https://i.cloudup.com/zfY6lL7eFa-3000x3000.png" />
   </a>
   <h3 align="center"><b>Express Auth</b> - Example App</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <a href="https://npm.im/@auth/express">
        <img alt="npm" src="https://img.shields.io/npm/v/@auth/express?color=green&label=@auth/express&style=flat-square">
      </a>
      <a href="https://bundlephobia.com/result?p=@auth/express">
        <img src="https://img.shields.io/bundlephobia/minzip/@auth/express?label=size&style=flat-square" alt="Bundle Size"/>
      </a>
      <a href="https://www.npmtrends.com/@auth/express">
        <img src="https://img.shields.io/npm/dm/@auth/express?label=downloads&style=flat-square" alt="Downloads" />
      </a>
      <a href="https://npm.im/@auth/express">
        <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
      </a>
   </p>
</p>

## Overview

This is the official Express Auth example for [Auth.js](https://express.authjs.dev).

## Getting started

You can easily deploy this example to [Render.com](https://render.com/) by creating a new Web Service on Render, granting access to your repository, and applying the following settings:

#### Build

```sh
pnpm install; pnpm build
```

#### Start

```sh
pnpm start
```

## Environment Variables

Once deployed, kindly ensure you set all [required environment variables](https://authjs.dev/getting-started/deployment#environment-variables) in the `Environment` section of your Render service.