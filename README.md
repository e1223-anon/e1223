# Exercise 1223

> [!NOTE]
> There are no pull requests because I had been using my other account's email in my commits which I don't want to do. Of course, modifying the commit changes the SHA, so the PRs got all messed up. Sorry...

Demo running at [https://frontend-3gybwadubq-uc.a.run.app/](https://frontend-3gybwadubq-uc.a.run.app/)

I spent quite a bit of time trying to set up a minimal repository and trying out new tools.

Some things I'm happy with, others not so much.

The main new things for me have been NestJS, SocketIO and GCP.

The clock is just a placeholder, ran out of time.

The grid/code algorithm is located in `packages/backend/src/generator/algorithm.ts`, there are a few
unit tests too.

## Repository set up

This is a monorepo using `yarn` workspaces.

It uses Node.JS version 22 (specifically 22.4.1)

> [!TIP]
> The project has support for `nvm`, which is useful to manage node versions on a single system.
> See [nvm installing & updating](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

## Starting the project

Run `yarn` to install dependencies

> [!TIP]
> See [yarn installation](https://yarnpkg.com/getting-started/install) for instructions on how to install `yarn`.

### Bonus 1: Real-Time Data Synchronization

I implemented this before the payments list because it seemed more interesting, and they had the same number!

I decided to use Socket.IO because it seems really handy and I'm very happy with the tiny wrapper for Socket.IO on the client. I like the way it multiplexes connections to various namespaces, removing the need to have a global "events" service that the various consumers/producers interact with.

Authentication not implemented yet.

### Bonus 2: Ops

I wanted to try deploying to Google Cloud Run (I've mostly used AWS).

It's using the `cloudbuild.yml` and `Dockerfile` to build 2 images (backend/frontend) and deploys them to artifact registry.
There's a hook in github to trigger the build and re-deploy the services.

It's not close to ready for production use, but at least the frontend/backend are running.

I've not looked into caching or anything else yet.

I assumed there would be a service similar to AWS CloudFront that would aggregate them on the same domain for me, but if there is, I couldn't find it.

As a temporary solution I hardcoded the URLs in the frontend/backend.

## Tech Stack

### TypeScript

All packages in the project use TypeScript 5.5.
My favorite feature is `Inferred Type Predicates`, although it's not used _(I don't think!)_ in this project, it's something that comes up now and then and I always feel like TypeScript should infer the type, and now it does!

> [!TIP]
> Here is the (release announcement for version 5.5)[https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/]

### Frontend

The frontend is using Angular 18.1.0, just [released this week!](https://blog.angular.dev/introducing-let-in-angular-686f9f383f0f).
It introduces a new `@let` declaration for templates.

#### Zoneless Angular frontend

Although it's still experimental the frontend does not rely on zone.js for change detection.
It seems to me that this is the direction Angular is headed in and for new projects I don't think it makes sense to rely on ZoneJS.
I'm excited about it because I think it will make Angular apps faster, easier to debug and less reliant on wrapper projects for using other libraries.

> [!TIP]
> For more information see [Angular without ZoneJS](https://angular.dev/guide/experimental/zoneless) and/or this [youtube video](https://www.youtube.com/watch?v=MZ6s5EL7hKk) that shows some of the differences and what to do (and what not to do)

> [!NOTE]
> I got an error when removing it from the tests and didn't spend more time on trying to figure out if it can be removed.

#### State management

The project does not use a state management library because I think using Signals/Observables works well for simple projects such as this, if more state and/or functionality has to be managed in the frontend something like [Elf](https://github.com/ngneat/elf) might be worthwhile.

#### Tailwind CSS

In a larger project it's useful to have some sort of component library but for something this small I think just using tailwindcss is a good start.

### Backend

I started out using "vanilla" ExpressJS, but switched to NestJS because of the missing type safety.

Using another framework makes the project quite a lot more complex but NestJS is modelled to be similar to Angular.

I'm aware the requests are not being validated...

### explicit types hack in tsconfig.json

I ran into an issue with jasmine type includes in the tests from the frontend, so I explicitly defined node and jest.

With a bit more work I think it could be fixed in a better way, the main drawback now is that the jest types are defined
even in non-test code.

### Shared

In the shared project there are a few zod schemas that are used in both projects.
I think `zod` is a great starting point for shared data because it's very terse and does not require any generators.
There are a few limitations with `zod` in terms of making sure APIs built on the schemas stay backwards compatible etc.
In larger projects I also find it useful to have a place for business logic that would otherwise be duplicated in the frontend(s) or backend(s) _(It might also make sense to split it up further into separate packages, e.g. `schema-mobile`, `schema-web`, `shared`/`common`)_
