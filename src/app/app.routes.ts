import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar/calendar-view/calendar-view.component';
import { AddAppointmentComponent } from './calendar/add-appointment/add-appointment.component';

export const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'add-appointment', component: AddAppointmentComponent }
];

// export const routes: Routes = [
//   { path: '', redirectTo: 'calendar', pathMatch: 'full' },
//   {
//     path: 'calendar', 
//     loadChildren: () => CalendarViewComponent
//   },
//   { 
//     path: 'add-appointment',
//     loadChildren: () => AddAppointmentComponent
//   }
// ];
