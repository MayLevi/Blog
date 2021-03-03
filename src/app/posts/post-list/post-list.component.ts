import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material';
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated=false;
  userId:string;
  private authStatusSub: Subscription;
  private postsSub: Subscription;
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(public postsService: PostsService, private authService: AuthService) {}

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
}
