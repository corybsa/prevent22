import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsComponent } from './jobs/jobs.component';
import { ResourcesComponent } from './resources.component';

const routes: Routes = [
  { path: '', component: ResourcesComponent },
  { path: 'jobs', component: JobsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule { }
