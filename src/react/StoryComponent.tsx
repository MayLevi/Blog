import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import './StoryComponent.scss'
import * as StoryWrapper from './StoryComponentWrapper';
import axios from 'axios';

export interface IMyComponentProps {


  
}


export const StoryComponent: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {
 
  const [Storystate , onChangeStoryState] = useState({
    selectedFile: null
  });

  const onStoryChange = (event) => 
  {
    onChangeStoryState({selectedFile:event.target.files[0]});
  
  }

  const onStoryClicked = (event) => {
    const fd = new FormData();
    fd.append('image' , Storystate.selectedFile, Storystate.selectedFile.name);
    const token= localStorage.getItem("token");
    const expirationDate=localStorage.getItem("expiration");
    const userId=localStorage.getItem("userId");
    
     axios.post('http://localhost:3000/api/stories/' , fd, {
      headers:{ 
        Authorization:  "Bearer " + token,
        expirationDate: expirationDate,
        userId: userId
      }
     }).then( res => {console.log(res)}).catch(error => {console.log(error)})
    
  }
  //html
  return (
    <div className="div">  
      <input type="file" accept='image/png, image/jpeg' onChange= {onStoryChange}/>
      <button className="button" onClick={onStoryClicked}>Upload</button>
    </div>);
};
