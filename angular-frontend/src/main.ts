// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

// https://www.devbyseb.com/article/standalone-components-in-angular

import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";


(async() => {
  const app = await createApplication(appConfig);

  const appElement = createCustomElement(AppComponent, {
    injector: app.injector
  });

  customElements.define("fuqua-acronyms", appElement);
})();
