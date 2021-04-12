import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NavComponent } from './components/nav/nav.component';
import { AuthService } from './services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './services/auth/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { PasswordValidatorDirective } from './directives/password-validator.directive';
import { FlyoutModule } from './components/flyout/flyout.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PipesModule } from './pipes/pipes.module';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TabViewModule } from 'primeng/tabview';
import { UsersService } from './services/users/users.service';
import { EventsService } from './services/events/events.service';
import { WarningsService } from './services/warnings/warnings.service';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    PasswordValidatorDirective,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FlyoutModule,
    ToastModule,
    PipesModule,
    TabViewModule,
    TableModule,
    InputMaskModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    MessageService,
    UsersService,
    EventsService,
    WarningsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
