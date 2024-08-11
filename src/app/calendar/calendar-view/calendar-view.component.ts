import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../shared/appointment.service';

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
  days: Array<{ date: Date, appointments: any[], id: string }> = [];
  connectedDropLists: string[] = [];

  dateForm: FormGroup;

  constructor(private appointmentService: AppointmentService, private fb: FormBuilder, private router: Router) {
    this.dateForm = this.fb.group({
      month: [this.selectedMonth],
      year: [this.selectedYear]
    });
  }

  ngOnInit() {
    this.appointmentService.appointments$.subscribe(() => {
      this.generateCalendar();
    });
  }

  openAddAppointment(date: Date) {
    this.router.navigate(['/add-appointment'], { queryParams: { date: date.toISOString() } });
  }

  generateCalendar() {
    const startDate = new Date(this.selectedYear, this.selectedMonth, 1);
    const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    this.days = Array.from({ length: endDate.getDate() }, (_, i) => {
      const date = new Date(this.selectedYear, this.selectedMonth, i + 1);
      return {
        date,
        appointments: this.appointmentService.getAppointmentsForDate(date),
        id: `drop-list-${i}` // Use array index (`i`) for unique ID
      };
    });
    this.connectedDropLists = this.days.map((_, index) => `drop-list-${index}`);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      const movedAppointment = event.container.data[event.currentIndex];
      const newDate = this.days[this.extractIndex(event.container.id)]?.date;

      if (newDate) {
        this.appointmentService.updateAppointment(movedAppointment, newDate);
      }
    }
  }

  extractIndex(str: string): number {
    const match = str.match(/drop-list-(\d+)$/);
    return match ? parseInt(match[1], 10) : -1;
  }

  deleteAppointment(appointment: { title: string, date: Date }, day: any) {
    this.appointmentService.deleteAppointment(appointment);
    day.appointments = this.appointmentService.getAppointmentsForDate(day.date);
  }
}
