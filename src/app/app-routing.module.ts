import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule) },
  { path: 'about-us', loadChildren: () => import('./components/about-us/about-us.module').then(m => m.AboutUsModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'resources', loadChildren: () => import('./components/resources/resources.module').then(m => m.ResourcesModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
