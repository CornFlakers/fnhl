import React, {useState, useEffect, useContext} from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { UserAuth, UserContext } from '../context/AuthContext';
import { collection, addDoc, getDocs, getDoc, doc, query, where } from "firebase/firestore"; 
import { db, auth } from '../firebase';
import { isEmpty } from '@firebase/util';
import { useAuthState } from "react-firebase-hooks/auth";
import ManageLeague from './ManageLeague';
import ManageTeam from './ManageTeam';
import ManageProfile from './ManageProfile';

const Manage = () => {

  const [user, loading, error] = useAuthState(auth);
  const [isManageLeague, setIsManageLeague] = useState(false);
  const [isManageProfile, setIsManageProfile] = useState(false);
  const [isManageTeam, setIsManageTeam] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const { logout } = UserAuth();
  const navigate = useNavigate();

  //setIsManageLeague(false);
  //setIsManageTeam(false);

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
  
      // get logged in user info
      try{
        const usersDocRef = doc(db, 'users', user.uid)

        getDoc(usersDocRef)
        .then((data) => {
          if(mounted){
            //set info
            setUserInfo(data.data());
            console.log('user info',data.data());
          }
        });
      }catch(e){
        console.log("error with db query");
      }

      return () => {
        mounted = false;
      }
    }
    
  }, [user, loading])

  useEffect( () => {

    if(loading){
      return;
    }

    if(Object.keys(userInfo).length == 0){
      console.log("user info not defined yet");
    }
    if(Object.keys(userInfo).length > 0){
      //3
      console.log("user info updated");
      //4
      console.log(userInfo);
    }
    
  }, [userInfo, loading])
 
  //logout the user
  const handleLogout = async () => {

      try{
        await logout();
        navigate('/');
        console.log('You are logged out');
      }catch(e){
        console.log(e.message);
      }
  };

  //generic handle function
  const handleIt = (s) => {
    try{
      if(s == "ManageLeague"){
        console.log("manage league");
        setIsManageTeam(false);
        setIsManageLeague(true);
        setIsManageProfile(false);

        //style the Manage League button
        //document.getElementById("ManageTeam").classList.add("bg-red")
      }
      if(s == "ManageTeam"){
        console.log("manage team");
        setIsManageTeam(true);
        setIsManageLeague(false);
        setIsManageProfile(false);
      }
      if(s == "ManageProfile"){
        console.log("manage profile");
        setIsManageTeam(false);
        setIsManageLeague(false);
        setIsManageProfile(true);
      }
    }catch(e){
      console.log(e.message)
    }
  }    
  
  /*  this page is for the GMs or League officials to interact with the sim and their teams.
      we should check to see if the logged in user is a league official */
  return (
    <div>
      
      <div className="flex justify-center shadow-md bg-white mt-2 sm:max-w-lg max-w-xs m-auto">
        <h1 className="text-xl w-full items-center text-center font-bold">Manage</h1>
      </div>
        
      {/* card layout for the manage > tools 
      style conditionally: https://www.codegrepper.com/code-examples/javascript/how+to+add+conditional+classname+in+react
      disabling buttons based on properties: https://stackoverflow.com/questions/31163693/how-do-i-conditionally-add-attributes-to-react-components*/}
      <div className='flex justify-center shadow-md bg-white mt-2 w-full sm:max-w-lg max-w-xs m-auto'>
        <div className='w-full'>
          <h1 className='text-lg font-bold w-full text-center items-center justify-center'>Tools</h1>
          <div className='w-full inline-block rounded-md' role="group">
            <div className='w-full'>  
              <button 
                id="ManageProfile"
                className={
                  `
                    w-full h-10
                    ${isManageProfile? 
                      " bg-slate-500 text-white"
                      : "hover:bg-zinc-600 hover:text-white focus:bg-slate-500 focus:text-white"
                    }
                  `
                }
                onClick={() => handleIt("ManageProfile")}
                disabled={isManageProfile}> 
                <h1 className='text-base w-full'>Manage Profile</h1> 
              </button> 
            </div>
            {userInfo?.['isLeagueOfficial'] && 
              <div>
                <button 
                  id="ManageLeague"
                  className={
                    `
                      w-full h-10
                      ${isManageLeague? 
                        " bg-slate-500 text-white"
                        : "hover:bg-zinc-600 hover:text-white focus:bg-slate-500 focus:text-white"
                      }
                    `
                  }
                  onClick={() => handleIt("ManageLeague")}
                  disabled={isManageLeague}> 
                  <h1 className='text-base'>Manage League</h1> 
                </button> 
              </div>
            }
            <div>
              {userInfo?.['isGM'] && 
                <button 
                  id="ManageTeam"
                  className={
                    `
                      w-full h-10
                      ${isManageTeam? 
                        "bg-slate-500 text-white":
                        "hover:bg-zinc-600 hover:text-white focus:bg-slate-500 focus:text-white"}`}
                  onClick={() => handleIt("ManageTeam")}
                  disabled={isManageTeam}> 
                  <h1 className='text-base w-full'>Manage Team</h1> 
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      {isManageProfile &&
      <div>
        <ManageProfile userInfo={userInfo} />
      </div>
      }

      {isManageLeague && 
      <div>
        <ManageLeague userInfo={userInfo} />
      </div>
      }
      
      {isManageTeam && 
      <div>
        <ManageTeam userInfo={userInfo} />
      </div>
      }

      {/* <div className='mt-2'>
        <button 
          onClick={(handleLogout)} 
          className='block bg-[#616161] text-white hover:bg-slate-50 hover:text-slate-900 px-6 py-2'>
          Logout
        </button>  
      </div> */}
    </div>
  )
}

export default Manage