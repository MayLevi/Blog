import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material';
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import {AuthService} from '../../auth/auth.service';
import {UsersService} from '../../users/users.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  displayPosts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 15, 20];
  userIsAuthenticated=false;
  userId:string;
  private authStatusSub: Subscription;
  private postsSub: Subscription;
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedFilter ='postName';
  searchString: any;




  constructor(public postsService: PostsService, private authService: AuthService, private  userService:UsersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId=this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.posts.forEach(post => {
          this.userService.getUser(post.creator).subscribe(user => post.userName = user.email)
        })
        this.displayPosts = this.posts;
      });
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(
      isAuthenticated=>{
        this.userId=this.authService.getUserId();
        this.userIsAuthenticated=isAuthenticated;
      }
    );
  }



  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  search() {
    if(this.searchString){
      switch (this.selectedFilter)
      {
        case "postName":
          this.displayPosts = this.posts.filter(post =>  post.title.toLowerCase().indexOf(this.searchString.toLowerCase()) >= 0 );
          break;
        case "userName":
          this.displayPosts = this.posts.filter(post =>  post.userName.toLowerCase().indexOf(this.searchString.toLowerCase()) >= 0 );
          break;
        case "Year":
          this.displayPosts = this.posts.filter(post =>  new Date(post.createDate).getFullYear() == this.searchString );
          break;
      }
    }
    else{
      this.displayPosts = this.posts;
    }

  }
}
