import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { StoryComponent } from 'src/react/StoryComponent';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import {AuthService} from '../app/auth/auth.service';

const containerElementName = 'storyComponentContainer';

@Component({
  selector: 'app-story-component',
  template: `<span #${containerElementName}></span>`,
  styleUrls: ['StoryComponent.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StoryWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;

  public logIn = false;

  constructor(public authService :AuthService) {
    this.logIn = this.authService.getIsAuth();
  }



  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }


  private render() {

    ReactDOM.render(<div>
      {this.logIn && <StoryComponent/>}
    </div>, this.containerRef.nativeElement);
  }
}
