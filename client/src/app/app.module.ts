import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@NgModule({
    declarations: [
    ],
  imports: [
    // other imports...
    HttpClientModule
  ],  providers: [],
  // bootstrap: [AppComponent] <-- remove this line
  // other metadata...
})
export class AppModule {
  ngDoBootstrap() {
    platformBrowserDynamic().bootstrapModule(AppComponent);
  }
}