import { collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import Select from 'react-select';
import { auth, db } from '../firebase';

const ManageProfile = (userInfo) => {

    const [newName, setNewName] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const [id, setUserId] = useState({});
    const [leagueOptions, setLeagueOptions] = useState();//options to select a users default league
    const [new_default_league, setDefaultLeague] = useState();

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
            let mounted = true;
            setUserId(user.uid);

            //leagueSnapshot, query the db for a list of leagues
            try{
                const leagueQ = query(collection(db,"leagues"));
                const leagueSnapshot = getDocs(leagueQ).then((data) => {
        
                if(mounted){
                    let i = [];
            
                    data.forEach((doc) => {
                        i.push({
                            id: doc.id,
                            data: doc.data()
                        });
                    })
                    
                    setLeagueSelectOptions(i);
                }
                })
            }
            catch(e){
                console.error("leagueQ/leagueSnapshot error:",e);
            }

            function setLeagueSelectOptions(i){
                console.log("setLeagueSelectOptions i:",i);
            
                const options = [];
            
                for(const data of i){
                    options.push({
                        value:data.id,
                        label:data.data.name
                    })
                }
            
                console.log("output of options for leagues",options);
            
                setLeagueOptions(options);
            }
            
            return () => {
                mounted = false;
            }
        }    
    },[user, loading])

    const submitForm = (e) => {
        e.preventDefault();
    
        if(newName == ""){
            console.error("newName is empty");
        }
        else{
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

        if(new_default_league === "" || new_default_league === undefined) {
            console.error("default_league is empty");
        }
        else{
            console.log(new_default_league);
            try{
                //call db to update user default league
                const userRef = doc(db, "users", user.uid)
                
                const updateUserDoc = updateDoc(userRef, {
                    default_league: new_default_league
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
    }

    function handleDefaultLeagueChange(e){
        console.log(e);
        setDefaultLeague(e);
    }

    

    return (
    <div className='mt-2 w-full'>
        
        <div className='flex justify-center shadow-md bg-white mt-2 sm:max-w-lg max-w-xs m-auto flex-col sm:flex-row w-full'>
            <h1 className='text-center text-lg font-bold'>Profile</h1>
            <p className='p-2 text-left px-4 text-sm sm:text-base pb-2'>You can update your username and select your default league</p>

            {userInfo &&
                <form onSubmit={submitForm}>
                        <div className='p-2'>
                            <h1 className='h-10 p-2'>Name |</h1>
                            <input onChange={(e) => setNewName(e.target.value)} className='h-10 w-full p-2 text-center bg-slate-100' placeholder={userInfo.userInfo['name'] ? userInfo.userInfo['name'] : "Name..." } type='text' id='name'></input>
                        </div>

                    
                        <div className='p-2'>
                            <h1 className='h-10 p-2'>Default League |</h1>
                            <div className='w-full'>
                                <Select defaultValue={userInfo.userInfo['default_league']} options={leagueOptions} onChange={handleDefaultLeagueChange} />
                            </div>
                        </div>
                    

                        <div className='w-full pt-2'>
                            <input className='w-full h-10 hover:bg-zinc-600 hover:text-white' type='submit' value="Update"></input>
                        </div>
                </form>
                }
        </div>
    </div>
)
}

export default ManageProfile