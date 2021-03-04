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
  displayedColumns: string[] = ['userName'];
  dataSource = new MatTableDataSource<User>();

  constructor(public usersService:UsersService,private authService:AuthService) {

  }

  ngOnInit() {
    this.usersService.getUser(this.authService.getUserId()).subscribe(user => this.currentUser = user);
    this.usersService.getAllUsers().subscribe(users => {
      this.dataSource.data  = users;
      this.allUsers = users;
    });

  }

}
