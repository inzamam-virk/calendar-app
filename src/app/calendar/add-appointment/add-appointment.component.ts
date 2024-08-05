import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../shared/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AddAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  router: Router = new Router;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private route: ActivatedRoute) {}
  ngOnInit() {
    const date = this.route.snapshot.queryParamMap.get('date');
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      date: [date ? new Date(date) : '', Validators.required]
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.appointmentService.addAppointment(this.appointmentForm.value);
      this.appointmentForm.reset();
      this.router.navigate(['/calendar']); // Navigate back to the calendar page
    }
  }
}
