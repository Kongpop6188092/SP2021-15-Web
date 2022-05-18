import { Component } from '@angular/core';
import { CoreService } from './core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogin: boolean = false
  content: number = 24

  constructor(
    private core: CoreService
  ) { 
    core.login.subscribe(data => {
      this.isLogin = data
      if (data) this.content = 20
      else this.content = 24
    })
  }
  ngOninit() {
  }
}
