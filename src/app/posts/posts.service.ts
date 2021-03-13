import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
import {AuthService} from '../auth/auth.service';
import {PostSocketService} from './post-socket.service';


@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private postUrl = 'http://localhost:3000/api/posts/';

  constructor(private http: HttpClient, private router: Router,private postSocketService: PostSocketService,
              private authService: AuthService) {
    this.observePostSocket();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        this.postUrl + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                createDate: post.createDate
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
      createDate: Date;
    }>(this.postUrl +'post/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        this.postUrl,
        postData
      )
      .subscribe(responseData => {
        this.postSocketService.emitCreatePostSocket(postData);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
        userName: null,
        createDate: null,
      };
    }
    this.http
      .put(this.postUrl +'post/' + id, postData)
      .subscribe(response => {
        this.postSocketService.emitUpdatePostSocket(postData);
        this.router.navigate(['/']);
      });
  }

  groupByUsers(){
     return this.http.get<any[]>(this.postUrl +'gbu' );
  }



  deletePost(postId: string) {
    return this.http
      .delete(this.postUrl +'post/' + postId);
  }

  private observePostSocket() {
    this.postSocketService.receiveCreatePostSocket()
      .subscribe((post: any) => {
        console.log(`Create ${post.id} Post socket received`);
        this.refreshPosts(post);
      });

    this.postSocketService.receiveUpdatePostSocket()
      .subscribe((post: any) => {
        console.log(`Update ${post.id} Post socket received`);
        this.refreshPosts(post);
      });

    this.postSocketService.receiveDeletePostSocket()
      .subscribe((post: any) => {
        console.log(`Delete ${post.id} Post socket received`);
        this.refreshPosts(post);
      });
  }

  private refreshPosts(post: any) {
    if (post.creator != this.authService.getUserId()) {
      this.getPosts(2,1);
    }
  }


}
