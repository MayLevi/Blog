import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import './StoryComponent.scss'
import axios from 'axios';

export interface IMyComponentProps {

}

export const GetStories: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {
 
  //html
  return (
    <div>
        <p>GetStories</p>
    </div>);
};
