# OrbitalDesigner

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Updating Angular

Angular can be updated using the angular CLI. Note: The CLI can only update from one major version to the next. If the app is more than one version behind, it can be updated in multiple steps using the CLI.

Update command: `npx @angular/cli@<version> update @angular/core@<version> @angular/cli@<version>`

Example to update to Angular 13: `npx @angular/cli@13 update @angular/core@13 @angular/cli@13`

Angular Material can also be updated in a subsequent step: `npx @angular/cli@13 update @angular/material@13`

Note: Using `npx @angular/cli@<version> update` uses the ng cli version specified, but if the desired version is already installed, then `ng update` can simply be used, followed by the packages to be updated: i.e. `ng update @angular/cli @angular/core @angular/cdk @angular-eslint/schematics @angular/material`

Note: `ng update` alone will list the packages that have available updates and are supported by the `ng update` command
