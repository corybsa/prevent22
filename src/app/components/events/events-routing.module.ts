import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { EventsComponent } from './events.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      { path: '', component: CalendarComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
