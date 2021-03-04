import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient, private router: Router) {
  }
  getUser(id: string) {
    return this.http.get<User>('http://localhost:3000/api/user/' + id);
  }

  getAllUsers() {
    return this.http.get<User[]>('http://localhost:3000/api/user/');
  }

}
