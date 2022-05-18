import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent implements OnInit {
  patients: any[] = []
  patientsFilter: any[] = []
  medicines: any[] = []
  isStart = false

  search: string = ''
  currentPatient: any = null

  drugAllergy: string = ''
  medicineData: any[] = []
  medicineList: any[] = []

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    /* CHECK LOGIN */
    if (!this.core.isLogin) {
      this.message.create('error', 'Please login first')
      this.router.navigate(['/login'])
    }

    this.initPatients()
    this.initMedicine()
    this.resetMedicineList()

    this.core.page.emit(3)
  }

  /* INITIALIZATION PART */
  initPatients(aSaveAllergy: boolean = false) {
    this.http.get(`${environment.baseURL}/api/patient/all`)
      .subscribe({
        next: res => {
          var data = res as any
          this.patients = data.data
          this.patientsFilter = [...this.patients]

          if (aSaveAllergy) {
            this.currentPatient = this.patients.find(data => data.name == this.currentPatient.name)
            this.drugAllergy = this.currentPatient.drugAllergy
          }
        },
        error: err => {
          this.message.create('error', 'Unexpected error. Please contact developer.')
        }
      })
  }

  initMedicine() {
    this.http.get(`${environment.baseURL}/api/util/lookup?name=MEDICINE`)
      .subscribe({
        next: res => {
          var data = res as any
          this.medicines = data.data
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

    this.http.get(`${environment.baseURL}/api/patient/medicine?cid=${patient.cid}`)
      .subscribe({
        next: res => {
          var data = res as any
          this.medicineData = data.data
          this.medicineData.forEach(d => {
            d['medicineName'] = this.medicines.find(f => f.ID == d.medicine).NAME
            console.log(typeof(d['createdDate']));
            
          })

          this.currentPatient = patient
          this.drugAllergy = this.currentPatient.drugAllergy
          this.search = ''
          this.onSearchChange('')
        },
        error: err => {
          this.message.create('error', 'Unexpected error. Please contact developer.')
        }
      })
  }

  onSelectMed(data: any, value: any) {
    data.detail = this.medicines.find(d => d.ID == value).DETAIL
  }

  onSaveData() {
    /* SAVE DRUG ALLERGY */
    var formData = new FormData()
    formData.append('cid', this.currentPatient.cid)
    formData.append('allergy', this.drugAllergy)

    this.http.post(`${environment.baseURL}/api/patient/drug-allergy`, formData)
      .subscribe({
        next: async(res) => {
          await this.initPatients(true)

          /* SAVE MEDICINE */
          this.medicineList.forEach(entry => {
            entry['doctor'] = this.core.dentist.USERNAME,
            entry['cid'] = this.currentPatient.cid
          })
      
          this.http.post(`${environment.baseURL}/api/patient/medicine`, this.medicineList)
            .subscribe({
              next: res => {
                this.resetMedicineList()
                this.search = this.currentPatient.name
                this.onSearch()
      
                this.message.create('success', 'Save data successfully')
              },
              error: err => {
                this.message.create('error', 'Unexpected error. Please contact developer.')
              }
            })
        },
        error: err => {
          this.message.create('error', 'Unexpected error. Please contact developer.')
        }
      })
  }

  /* RESET PART */
  resetMedicineList() {
    this.medicineList = [
      {
        medicine: '',
        amount: 0,
        detail: ''
      },
      {
        medicine: '',
        amount: 0,
        detail: ''
      },
      {
        medicine: '',
        amount: 0,
        detail: ''
      },
    ]
  }

  formatInteger(num: string) {
    for (var i = num.length; i < 3; i++) {
      num = '0' + num;
    }
    return num;
  }
}
