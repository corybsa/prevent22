import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { CalendarComponent } from './calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { EventsService } from 'src/app/services/events/events.service';

FullCalendarModule.registerPlugins([
  bootstrapPlugin,
  dayGridPlugin,
  listPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    EventsComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FullCalendarModule
  ],
  providers: [
    EventsService
  ]
})
export class EventsModule { }
