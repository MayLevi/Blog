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
  import { GetStories } from "src/react/Components/GetStories";
  import * as React from 'react';
  
  import * as ReactDOM from 'react-dom';
  
  const containerElementName = 'storiesComponentContainer';
  
  @Component({
    selector: 'app-GetStories-component',
    template: `<span #${containerElementName}></span>`,
    styleUrls: ['GetStories.scss'],
    encapsulation: ViewEncapsulation.None,
  })
  export class StoriesWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild(containerElementName, {static: false}) containerRef: ElementRef;
  
  
  
    constructor() {
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
        <GetStories/>
      </div>, this.containerRef.nativeElement);
    }
  }
  