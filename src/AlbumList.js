import React from "react";

function AlbumList({ user, userContent }) {
  if(userContent.length===0){
    return <p>Please click on a user name to the left</p>;
  }
  console.log(userContent)
  return(
    <ol>
      {userContent.map((item) =>(
        <li>{item.title}</li>
      ))}
    </ol>
  )
}

export default AlbumList;
