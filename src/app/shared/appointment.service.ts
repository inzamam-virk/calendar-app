import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments = new BehaviorSubject<Array<{ title: string, date: Date }>>([
    { title: 'Meeting', date: new Date() },
    { title: 'Doctor Appointment', date: new Date(new Date().setDate(new Date().getDate() + 1)) },
    { title: 'Conference', date: new Date(new Date().setDate(new Date().getDate() + 2)) }
  ]);
  appointments$ = this.appointments.asObservable();

  addAppointment(appointment: { title: string, date: Date }) {
    const currentAppointments = this.appointments.value;
    this.appointments.next([...currentAppointments, appointment]);
  }

  getAppointmentsForDate(date: Date) {
    return this.appointments.value.filter(app => app.date.toDateString() === date.toDateString());
  }

  deleteAppointment(appointment: { title: string, date: Date }) {
    const currentAppointments = this.appointments.value;
    this.appointments.next(currentAppointments.filter(app => app !== appointment));
  }

  updateAppointmentDate(appointment: { title: string, date: Date }, newDate: Date) {
    const currentAppointments = this.appointments.value.map(app =>
      app === appointment ? { ...app, date: newDate } : app
    );
    this.appointments.next(currentAppointments);
  }
}
