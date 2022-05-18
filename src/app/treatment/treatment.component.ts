import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.css']
})
export class TreatmentComponent implements OnInit {
  patients: any[] = []
  patientsFilter: any[] = []
  isStart = false

  search: string = ''
  currentPatient: any = null
  treatmentData: any[] = []

  toothList: any[] = []
  toothNo: any = 0

  toothSideList: any[] = []
  toothSide: string = ''

  diagnosisList: any[] = []
  diagnosis: string = ''

  treatmentList: any[] = []
  treatment: string = ''

  constructor(
    private core: CoreService,
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    /* CHECK LOGIN */
    if (!this.core.isLogin) {
      this.message.create('error', 'Please login first')
      this.router.navigate(['/login'])
    }

    /* INITIALIZATION */
    this.initPatients()
    this.initToothNo()
    this.initToothSide()
    this.initDiagnosis()
    this.initTreatment()

    /* CHANGE SELECTED MENU */
    this.core.page.emit(2)
  }
  
  /* INITIALIZATION PART */
  initPatients() {
    this.http.get(`${environment.baseURL}/api/patient/all`)
      .subscribe({
        next: res => {
          var data = res as any
          this.patients = data.data
          this.patientsFilter = [...this.patients]
        },
        error: err => {
          this.message.create('error', 'Unexpected error. Please contact developer.')
        }
      })
  }

  initToothNo() {
    for (var i = 1; i <= 32; i++) {
      this.toothList.push(i)
    }

    /* DEFAULT */
    this.toothNo = 1
  }

  initToothSide() {
    this.http.get(`${environment.baseURL}/api/util/lookup?name=TOOTH_SIDE`)
      .subscribe({
        next: res => {
          var data = res as any
          this.toothSideList = data.data

          /* DEFAULT */
          this.toothSide = this.toothSideList[0].ID
        },
        error: err => {
          this.message.create('error', 'Unexpected error. Please contact developer.')
        }
      })
  }

  initDiagnosis() {
    this.http.get(`${environment.baseURL}/api/util/lookup?name=DIAGNOSIS`)
    .subscribe({
      next: res => {
        var data = res as any
        this.diagnosisList = data.data

        /* DEFAULT */
        this.diagnosis = this.diagnosisList[0].ID
      },
      error: err => {
        this.message.create('error', 'Unexpected error. Please contact developer.')
      }
    })
  }

  initTreatment() {
    this.http.get(`${environment.baseURL}/api/util/lookup?name=TREATMENT`)
    .subscribe({
      next: res => {
        var data = res as any
        this.treatmentList = data.data

        /* DEFAULT */
        this.treatment = this.treatmentList[0].ID
      },
      error: err => {
        this.message.create('error', 'Unexpected error. Please contact developer.')
      }
    })
  }

  /* LISTENER PART */
  onSearchChange(value: string) {
    this.patientsFilter = this.patients.filter(data => 
      data.name.toLowerCase().indexOf(value.toLowerCase()) != -1
    )
  }

  onSearch() {
    var patient = this.patients.find(data => data.name == this.search)
    this.isStart = true

    if (!patient) {
      this.currentPatient = null
      this.search = ''
      this.onSearchChange('')
      return
    }

    this.http.get(`${environment.baseURL}/api/patient/treatment?cid=${patient.cid}`)
      .subscribe({
        next: res => {
          var data = res as any
          this.treatmentData = data.data

          this.treatmentData.forEach(entry => {
            entry.toothSide = this.toothSideList.find(t => t.ID == entry.toothSide).DESC
            entry.diagnosis = this.diagnosisList.find(t => t.ID == entry.diagnosis).DESC
            entry.choice = this.treatmentList.find(t => t.ID == entry.choice).DESC
          });
          
          this.currentPatient = patient
          this.search = ''
          this.onSearchChange('')
        },
        error: err => {
          this.message.create('error', 'Unexpected error. Please contact developer.')
        }
      })
  }
  
  onSaveData() {
    var formData = new FormData()
    formData.append('dentist', this.core.dentist.USERNAME)
    formData.append('cid', this.currentPatient.cid)
    formData.append('toothNo', this.toothNo)
    formData.append('toothSide', this.toothSide)
    formData.append('diagnosis', this.diagnosis)
    formData.append('choice', this.treatment)

    this.http.post(`${environment.baseURL}/api/patient/treatment`, formData)
      .subscribe({
        next: res => {
          this.search = this.currentPatient.name
          this.onSearch()

          this.message.create('success', 'Save data successfully')

          /* DEFAULT */
          this.toothNo = 1
          this.toothSide = this.toothSideList[0].ID
          this.diagnosis = this.diagnosisList[0].ID
          this.treatment = this.treatmentList[0].ID
        },
        error: err => {
          this.message.create('error', 'Data save failure. Please contact developer')
        }
      })
  }
}
