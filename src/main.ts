// import { enableProdMode } from '@angular/core';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { environment } from './environments/environment';

// if (environment.production) {
//   enableProdMode();
// }
// enableProdMode();
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
// import { JwtInterceptor } from './app/core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './app/core/helpers/error.interceptor';
import { AuthGuard } from './app/core/guards/auth.guard';

// Enable production mode if in production environment
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard,
    ...appConfig.providers
  ]
})
.catch((err) => console.error('Error during bootstrapping the application:', err));





