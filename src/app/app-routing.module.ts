import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SystemRoles } from './models/user/system-roles';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { shouldBeLoggedIn: true } },
  { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
  { path: 'about-us', loadChildren: () => import('./components/about-us/about-us.module').then(m => m.AboutUsModule), canActivate: [AuthGuard] },
  { path: 'resources', loadChildren: () => import('./components/resources/resources.module').then(m => m.ResourcesModule), canActivate: [AuthGuard] },
  { path: 'forums', loadChildren: () => import('./components/forum/forum.module').then(m => m.ForumModule), canActivate: [AuthGuard] },
  { path: 'events', loadChildren: () => import('./components/events/events.module').then(m => m.EventsModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard], data: { allow: [SystemRoles.Admin] } },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
