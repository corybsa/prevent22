import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
  { path: 'about-us', loadChildren: () => import('./components/about-us/about-us.module').then(m => m.AboutUsModule), canActivate: [AuthGuard] },
  { path: 'resources', loadChildren: () => import('./components/resources/resources.module').then(m => m.ResourcesModule), canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
