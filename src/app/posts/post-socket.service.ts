import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

import { Post } from './post.model';

@Injectable()
export class PostSocketService {
  constructor(
    private socket: Socket) {
  }

  emitCreatePostSocket(post: any) {
    this.socket.emit('createPost', post);
  }

  receiveCreatePostSocket() {
    return Observable.create((observer: any) => {
      this.socket.on('createPost', (post: any) => {
        observer.next(post);
      });
    });
  }

  emitUpdatePostSocket(post: any) {
    this.socket.emit('updatePost', post);
  }

  receiveUpdatePostSocket() {
    return Observable.create((observer: any) => {
      this.socket.on('updatePost', (post: any) => {
        observer.next(post);
      });
    });
  }

  emitDeletePostSocket(post: any) {
    this.socket.emit('deletePost', post);
  }

  receiveDeletePostSocket() {
    return Observable.create((observer: any) => {
      this.socket.on('deletePost', (post: any) => {
        observer.next(post);
      });
    });
  }
}
