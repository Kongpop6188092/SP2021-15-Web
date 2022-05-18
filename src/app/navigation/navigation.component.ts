import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  loginPage = false
  registerPage = false
  treatmentPage = true
  medicinePage = false
  appointmentPage = false
  dentistName = ''

  constructor(
    private core: CoreService,
    private router: Router
  ) {
    this.dentistName = this.core.dentist.FIRSTNAME + ' ' + this.core.dentist.LASTNAME
  }

  ngOnInit(): void {
    this.core.page.subscribe(data => {
      this.clearPage()
      if (data == 0) this.loginPage = true
      if (data == 1) this.registerPage = true
      if (data == 2) this.treatmentPage = true
      if (data == 3) this.medicinePage = true
      if (data == 4) this.appointmentPage = true
    })
  }

  clearPage() {
    this.loginPage = false
    this.registerPage = false
    this.treatmentPage = false
    this.medicinePage = false
    this.appointmentPage = false
  }

  logout() {
    this.core.login.emit(false)
    this.core.isLogin = false
    this.core.dentist = null

    this.router.navigate(['login'])
  }
}
