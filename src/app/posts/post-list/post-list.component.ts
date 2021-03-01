import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import {PageEvent} from '@angular/material';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading=false;
  totalPosts=10;
  postPerPage= 5;
  pageSizeOptions=[1,2,5,10];
  currentPage=1;
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading=true;
    this.postsService.getPosts(this.postPerPage,1);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading=false;
        this.posts = posts;
      });
  }
  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage= pageData.pageIndex+1;
    this.postPerPage=pageData.pageSize;
    this.postsService.getPosts(this.postPerPage,this.currentPage);
  }
}
