import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreService } from '../core.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private core: CoreService,
    private message: NzMessageService) {

      /* RESET NAVIGATION */
      this.core.login.emit(false)
      this.core.isLogin = false
      this.core.username = ''
    }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })

    this.core.page.emit(0)
  }

  submitForm() {
    if (this.validateForm.valid) {
      var username = this.validateForm.controls['username'].value
      var password = this.validateForm.controls['password'].value

      var formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)

      this.http.post(`${environment.baseURL}/api/doctor/login`, formData)
        .subscribe({
          next: res => {
            var data = res as any
            if (data.data.status) {
              this.message.create('success', 'Authentication success')

              this.core.login.emit(true)
              this.core.isLogin = true
              this.core.dentist = data.data.data

              this.router.navigate(['/appointment'])
            } 
            else {
              this.message.create('error', 'Authentication fail')

              this.validateForm.patchValue({
                username: '',
                password: ''
              })
            }
          },
          error: err => {
            var data = err.error as any
            this.message.create('error', data.message)

            this.validateForm.patchValue({
              username: '',
              password: ''
            })
          }
        })
    } 
    else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty({ onlySelf: true })
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
    }
  }

  goToRegister() {
    this.router.navigate(['/register'])
  }
}
