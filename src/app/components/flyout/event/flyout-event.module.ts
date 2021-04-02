import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FlyoutEventComponent } from './flyout-event.component';
import { EventsService } from 'src/app/services/events/events.service';
import { AddEventFlyoutComponent } from './add-event-flyout/add-event-flyout.component';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { EditEventFlyoutComponent } from './edit-event-flyout/edit-event-flyout.component';
import { VolunteerService } from 'src/app/services/events/volunteer.service';
import { AddVolunteerFlyoutComponent } from './add-volunteer-flyout/add-volunteer-flyout.component';
import { CancelVolunteerFlyoutComponent } from './cancel-volunteer-flyout/cancel-volunteer-flyout.component';

@NgModule({
  declarations: [
    FlyoutEventComponent,
    AddEventFlyoutComponent,
    EditEventFlyoutComponent,
    AddVolunteerFlyoutComponent,
    CancelVolunteerFlyoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    CalendarModule,
    EditorModule
  ],
  exports: [
    FlyoutEventComponent
  ],
  providers: [
    EventsService,
    VolunteerService
  ]
})
export class FlyoutEventModule { }
