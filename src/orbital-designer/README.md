# **OrbitalDesigner**

- This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.2.

## **Development server**

- Run `ng serve` or `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## **Code scaffolding**

- Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## **Build**

- Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## **Running unit tests**

- Run `npm run test` to execute the unit tests via [Jest](https://jestjs.io/docs/testing-frameworks).

- NOTE: If running into performance issues while executing tests (particularly if working within dev containers), execute `npm run test:watch` to run optimized tests

## **Further help**

- To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## **Updating Dependencies**

### **Checking dependencies due for upgrade/updates**

#### **Using npm**

#### **Using npm-check-updates aka ncu**

### **Angular**

- Angular can be updated using the Angular CLI. Note: The CLI can only update from one major version to the next. If the app is more than one version behind, it can be updated in multiple steps using the CLI.

- Update command:

```
npx @angular/cli@<VERSION> update @angular/core@<VERSION> @angular/cli@<VERSION>
```

- Example to update to Angular v15:

```
npx @angular/cli@15 update @angular/core@15 @angular/cli@15
```

- Angular Material can also be updated in a subsequent step:

```
npx @angular/cli@15 update @angular/material@15
```

- Note: Using `npx @angular/cli@<version> update` uses the ng cli version specified, but if the desired version is already installed, then `ng update` can simply be used, followed by the packages to be updated: i.e:

```
ng update @angular/cli @angular/core @angular/cdk @angular-eslint/schematics @angular/material
```

- Note: `ng update` alone will list the packages that have available updates and are supported by the `ng update` command

### **Current Dependencies constrained to specific versions**

- Angular Material has a direct peer dependency on a specific version of Angular CDK eg. from the `package-lock.json` readout:

```
"peerDependencies": {
        "@angular/animations": "^15.0.0 || ^16.0.0",
        "@angular/cdk": "15.2.1",
        "@angular/common": "^15.0.0 || ^16.0.0",
        "@angular/core": "^15.0.0 || ^16.0.0",
        "@angular/forms": "^15.0.0 || ^16.0.0",
        "@angular/platform-browser": "^15.0.0 || ^16.0.0",
        "rxjs": "^6.5.3 || ^7.4.0"
      }
```

therefore any future upgrades of Angular Material will need to also include Angular CDK to the same version number.

- Storybook Angular also includes a peer dependency on `zone.js` lower than `0.12.x`:

```
"peerDependencies": {
        "@angular-devkit/architect": ">=0.8.9",
        "@angular-devkit/build-angular": ">=0.8.9 || >= 12.0.0",
        "@angular-devkit/core": "^0.6.1 || >=7.0.0",
        "@angular/cli": ">=6.0.0",
        "@angular/common": ">=6.0.0",
        "@angular/compiler": ">=6.0.0",
        "@angular/compiler-cli": ">=6.0.0",
        "@angular/core": ">=6.0.0",
        "@angular/forms": ">=6.0.0",
        "@angular/platform-browser": ">=6.0.0",
        "@angular/platform-browser-dynamic": ">=6.0.0",
        "@babel/core": "*",
        "@nrwl/workspace": ">=11.1.0",
        "rxjs": "^6.0.0 || ^7.4.0",
        "typescript": "^3.4.0 || >=4.0.0",
        "zone.js": "^0.8.29 || ^0.9.0 || ^0.10.0 || ^0.11.0",
}
```
