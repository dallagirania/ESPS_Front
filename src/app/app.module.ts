import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  NbCardModule,
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbToastrModule,
  NbToastrService,
  NbWindowModule,
} from '@nebular/theme';
import { LoginModule } from './Authentification/Login.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LoginModule,
    BrowserAnimationsModule,
    NbSpinnerModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NbCardModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [NbToastrService],

})
export class AppModule {
}
