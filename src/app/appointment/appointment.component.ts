import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  dataFilter: any[] = []

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.core.page.emit(4)
    this.refreshData()
  }

  refreshData() {
    this.http.get(`${environment.baseURL}/api/doctor/appointment?user=${this.core.dentist.USERNAME}`)
    .subscribe({
      next: res => {
        var data = res as any
        this.dataFilter = data.data
        
      },
      error: err => {
        this.message.create('error', 'Unexpected error. Please contact developer.')
      }
    })
  }
}
