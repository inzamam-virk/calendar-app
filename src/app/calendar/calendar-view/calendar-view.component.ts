import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../shared/appointment.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class CalendarViewComponent implements OnInit {
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  days: Array<{ date: Date, appointments: any[] }> = [];
  connectedDropLists: string[] = [];
  
  dateForm: FormGroup;

  constructor(private appointmentService: AppointmentService, private fb: FormBuilder, private router: Router) {
    this.dateForm = this.fb.group({
      month: [this.selectedMonth],
      year: [this.selectedYear]
    });
  }

  ngOnInit() {
    this.appointmentService.appointments$.pipe(
      map(() => {
        this.generateCalendar();
      })
    ).subscribe();
  }

  openAddAppointment(date: Date) {
    this.router.navigate(['/add-appointment'], { queryParams: { date: date.toISOString() } });
  }

  generateCalendar() {
    const startDate = new Date(this.selectedYear, this.selectedMonth, 1);
    const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    this.days = Array.from({ length: endDate.getDate() }, (_, i) => {
      const date = new Date(this.selectedYear, this.selectedMonth, i + 1);
      return { date, appointments: this.appointmentService.getAppointmentsForDate(date) };
    });
    this.connectedDropLists = this.days.map(day => day.date.toISOString());
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log("Inside drop fun", event.container," , ", event.previousContainer," , ", event.currentIndex, " , ", event.previousIndex)
    if (event.previousContainer !== event.container) {
      console.log("Inside if check")
      const draggedAppointment = event.previousContainer.data[event.previousIndex];
      const newDate = this.days.find(day => day.appointments === event.container.data)?.date;

      if (newDate) {
        this.appointmentService.deleteAppointment(draggedAppointment);
        this.appointmentService.addAppointment({
          ...draggedAppointment,
          date: newDate
        });

        this.generateCalendar();
      }
    } else {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  deleteAppointment(appointment: { title: string, date: Date }, day: any) {
    this.appointmentService.deleteAppointment(appointment);
    day.appointments = this.appointmentService.getAppointmentsForDate(day.date);
  }
}
