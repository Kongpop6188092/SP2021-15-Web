import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  page = new EventEmitter()
  login = new EventEmitter()

  isLogin: boolean = false
  username: string = ''
  
  dentist: any

  constructor() { }
}
