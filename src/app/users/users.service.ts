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

  updateUser(user : User,newUsername : any) {
    let userData: any;
    userData = {
      id: user._id,
      email: newUsername,
      password: user.password,
      isAdmin: user.isAdmin,
    };
    this.http
      .put('http://localhost:3000/api/user/' + user._id, userData)
      .subscribe(response => {
      });
  }

  deleteUser(userId: string) {
    return this.http
      .delete('http://localhost:3000/api/user/' + userId);
  }

}
