import React, { useState, useEffect } from "react";
import "./App.css";

import AlbumList from "./AlbumList";
import UserList from "./UserList";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [userContent, setUserContent] = useState([]);

  
  useEffect(() =>{

    document.title = "Awesome Album App";
    return () => {
      document.title=""
    };
  }, []);


  useEffect(() =>{
    setUsers([]);
    const abortController = new AbortController();


    async function loadUsers(){
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users",
          {signal: abortController.signal}
        );
        const backFromAPI = await response.json();
        //console.log(backFromAPI)
        setUsers(backFromAPI);
      }catch (error){
        if(error.name==="AbortError"){
          console.log("Aborted");
        }else{
          throw error;
        }
      }
    }
    loadUsers();
    return () =>{
      abortController.abort();
    };
  }, [])

  useEffect(() =>{
    //setCurrentUser({});
    const abortController = new AbortController();
      async function loadUserContent(){
        try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/albums?userId=${currentUser.id}`,
          {signal: abortController.signal}
        );
        const userBackFromAPI = await response.json();
        console.log('USER CONTENT', userBackFromAPI);
        setUserContent(userBackFromAPI);
    }catch(error){
      if(error.name==="AbortError"){
        console.log("User Content Aborted")
      } else{
        throw error;
      }
    }
    }
    loadUserContent();
    return () =>{
      abortController.abort();
    }
  }, [currentUser])
    

  // Load data from https://jsonplaceholder.typicode.com/todos?userId=3


  return (
    <div className="App">
      <div className="left column">
        <UserList users={users} setCurrentUser={setCurrentUser} />
      </div>
      <div className="right column">
        <AlbumList user={currentUser} userContent={userContent}/>
      </div>
    </div>
  );
}

export default App;
