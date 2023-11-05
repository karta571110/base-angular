import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved
// import { ControlDirective } from '@common/sdk/form';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlDirective } from '@common/sdk/form';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './shared/components/input/input.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ControlDirective,
    InputComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
