import { Component, OnInit } from '@angular/core';
import {UsersService} from '../users.service';
import {AuthService} from '../../auth/auth.service';
import {User} from '../user';
import {MatTableDataSource} from '@angular/material';





@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  currentUser : User;
  allUsers : User[];
  displayedColumns: string[] = ['userName','Action'];
  dataSource = new MatTableDataSource<User>();
  userEditMode: any[] = [];

  constructor(public usersService:UsersService,private authService:AuthService) {

  }

  ngOnInit() {
    this.usersService.getUser(this.authService.getUserId()).subscribe(user => this.currentUser = user);
    this.loadUsers();
  }

  loadUsers(){
    this.usersService.getAllUsers().subscribe(users => {
      this.dataSource.data  = users;
      this.allUsers = users;
      users.forEach(user => {
          this.userEditMode[user.email]= false;
        }
      )
    });
  }

  isEditMode(userEmail)
  {
    let result = false;
    if(this.userEditMode[userEmail] == true)
    {
      result = true;
    }
    return result;
  }

  saveUsername(newUsername: any, email: string) {
    this.userEditMode[email] = false;
    this.allUsers.forEach(user => {if(user.email == newUsername){ return }});
    let userToUpdate = this.allUsers.filter(user => user.email == email)[0];
    this.usersService.updateUser(userToUpdate,newUsername);
    this.allUsers.find(user => user._id == userToUpdate._id).email = newUsername;
  }

  deleteUser(user) {
    this.usersService.deleteUser(user._id).subscribe(() => {
      this.loadUsers();
    })
  }
}
