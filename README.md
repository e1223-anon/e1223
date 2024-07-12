# Exercise 1223

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

### explicit types hack in tsconfig.json

I ran into an issue with jasmine type includes in the tests from the frontend, so I explicitly defined node and jest.

With a bit more work I think it could be fixed in a better way, the main drawback now is that the jest types are defined
even in non-test code.

### Shared

In the shared project there are a few zod schemas that are used in both projects.
I think `zod` is a great starting point for shared data because it's very terse and does not require any generators.
There are a few limitations with `zod` in terms of making sure APIs built on the schemas stay backwards compatible etc.
In larger projects I also find it useful to have a place for business logic that would otherwise be duplicated in the frontend(s) or backend(s) _(It might also make sense to split it up further into separate packages, e.g. `schema-mobile`, `schema-web`, `shared`/`common`)_
