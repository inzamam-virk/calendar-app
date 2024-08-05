import { provideRouter, RouterModule, Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar/calendar-view/calendar-view.component';
import { AddAppointmentComponent } from './calendar/add-appointment/add-appointment.component';

export const routes:Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'calendar', component: CalendarViewComponent },
  { path: 'add-appointment', component: AddAppointmentComponent },
];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(routes);

