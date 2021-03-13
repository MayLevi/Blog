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

  const [Storiesstate , onChangeStoriesState] = useState({
    stories: null
  });

  const [StoriesArraystate , onChangeStoriesArrState] = useState({
    storiesArr: null
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

  const getAllStories = () => {
    const token= localStorage.getItem("token");
    const expirationDate=localStorage.getItem("expiration");
    const userId=localStorage.getItem("userId");

    axios.get("http://localhost:3000/api/stories/", 
    {
      headers: { 
        Authorization:  "Bearer " + token,
        expirationDate: expirationDate,
        userId: userId
      }})
      .then(res => {
        var stories = res.data.story.filter(s => s.imagePath.startsWith("http://localhost:3000/stories"));
        var picsArr = stories.map(s => (
          <div key={s._id}>
          <img className="circular--square" src={s.imagePath}/>
          <button  onClick={(event) => {
            onDeleteStory(event, s._id);
          }}>Delete Story</button>
          </div>
        ));
        onChangeStoriesArrState({storiesArr: picsArr})
      })
      .catch(err => {console.log(err)});
  }

  const onDeleteStory = (event , id) => {
    const token= localStorage.getItem("token");
    const expirationDate=localStorage.getItem("expiration");
    const userId=localStorage.getItem("userId");

    axios.delete("http://localhost:3000/api/stories/" + id , {
      headers:{ 
        Authorization:  "Bearer " + token,
        expirationDate: expirationDate,
        userId: userId
      }
     }
    ).then(res => {console.log(res)
      getAllStories();
    }).catch(err => console.log(err));
    console.log("http://localhost:3000/api/stories/:"+ id)
  }


  //html
  return (
    <div>
      <div className="div">  
        <input type="file" accept='image/png, image/jpeg' onChange= {onStoryChange}/>
        <button className="button" onClick={onStoryClicked}>Upload</button>
      </div>
      <div className="div">  
        <button className="button" onClick={getAllStories}>Get All Stories</button>
      </div>
      <div className="div2">
          {StoriesArraystate.storiesArr? <div>{StoriesArraystate.storiesArr}</div> : null}
      </div> 
      </div>);
};
