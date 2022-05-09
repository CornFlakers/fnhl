import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';

const ManageProfile = (userInfo) => {

    const [newName, setNewName] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const [id, setUserId] = useState({});

    useEffect( () => {
        if(loading){
            return;
            //figured this out,
            //this is how to wait for user, requires loading, useAuthState, from a separate library, see above.
            //https://blog.logrocket.com/user-authentication-firebase-react-apps/
            //jan 10 2022
        }
        else{
            //loading is not true, so we assume our page and its assets have loaded, or at least the user auth obj
            if(user){
                console.log(user);
            }
            let mounted = true;
            
            console.log("1 user.id",user.uid);
            setUserId(user.uid);
            
            return () => {
                mounted = false;
            }
        }    
    },[user, loading])

    useEffect( () => {
        if(loading){
          return;
        }
       
        console.log("id", id)
        
      }, [id, loading])

    const submitForm = (e) => {
        e.preventDefault();
        console.log("submit profile form");
        console.log("2 user.id",id);
        console.log("newName",newName);

        try{
            //call db to update user
            const userRef = doc(db, "users", user.uid)
            
            const updateUserDoc = updateDoc(userRef, {
                name: newName
            }).then((data) => {
                console.log("document added",data);
                window.location.reload(false)
            }).catch((e) => {
                console.error(e.message);
            })

        }catch(e){
            console.error("error",e.message);
        }

        

    }

    return (
    <div>
        <div className='text-center border-b-2 mt-2'>
            <h1 className='text-xl'><b>Profile</b></h1>
        </div>
        
        {userInfo &&
        <div className='w-64 m-auto mt-2'>
        <form className='shadow-md m-auto' onSubmit={submitForm}>
                <label className='h-8 w-64 p-2'>Name</label>
                <input onChange={(e) => setNewName(e.target.value)} className='h-8 w-64 p-2' placeholder={userInfo.userInfo['name'] ? userInfo.userInfo['name'] : "Name..." } type='text' id='name'></input>
                <input className='h-8 w-64 mt-2 bg-slate-800 text-white' type='submit' value="Update"></input>
        </form>
        </div>
        }
    </div>
)
}

export default ManageProfile