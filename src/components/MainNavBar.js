import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import IMAGES from '../images';

const toggleMenu = () => {
    const toggleButton = document.getElementById("toggle-button")[0]
    const navBarLinks = document.getElementById('MainNavBar-NavBarLinks')

    console.log("navBarLinks",navBarLinks);
    console.log("navBarLinks.classList",navBarLinks.classList);

    navBarLinks.classList.toggle('hidden');

    // toggleButton.addEventListener('click', () => {

    // })
}

export const MainNavBar = () => {

    const [user, loading, auth_error] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();
    const { logout } = UserAuth();

    const loginHandler = () => {
        navigate('/signin')
        //TODO: do auth, on auth user, hide 'login' and replace with 'manage'. GMs manage their team, commissioner can manage their team + league.

    }
    
    const navClickHandler = (e) => {
        //alert(e);
        const navBarLinks = document.getElementById('MainNavBar-NavBarLinks')
        if(!navBarLinks.classList.contains('hidden')){
            navBarLinks.classList.toggle('hidden');    
        }
        navigate(e)
    }

     //logout the user
    const handleLogout = async () => {
        try{
            await logout();
            navigate('/');
        }catch(e){
            console.error("error with logout",e,e.message);
        }
    };

    useEffect( () => {
        if(loading){
          return;
        }
        else{
            let mounted = true;
      
            // get logged in user info
            const usersDocRef = doc(db, 'users', user.uid)
    
            getDoc(usersDocRef)
                .then((data) => {
                    if(mounted){
                        setUserInfo(data.data());
                    }
                })
                .catch((e) => {console.error("error with db query",e);})

            return () => {
                mounted = false;
            }
        }
    },[user, loading])

    return(
        <div id="MainNavBar-Container"> 

            <div id="MainNavBar-Navbar" 
                className="w-full z-50 sm:flex sm:flex-row flex-col h-[59px] shadow-md justify-between sm:items-center items-start bg-[#616161] text-white text-lg">
                
                <div id="MainNavBar-BrandTitle" className="md:hidden flex p-0">
                    <button className='bg-white h-[59px] px-2 py-1 w-[56px]' title="Home" onClick={(e) => {navClickHandler("home")}}>
                        <img className="min-w-min h-[40px] w-[40px]" src={IMAGES.logoFNHL} alt=""  />
                    </button>
                </div>

                <a href='#' 
                    id="toggle-button"
                    className="absolute top-[18px] right-4 flex flex-col justify-between w-8 h-5
                    sm:hidden" 
                    // w3-bar-item w3-button w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-dark-grey
                    onClick={toggleMenu} 
                    title="Toggle Navigation Menu">

                    <span id="bar" className='h-1 w-full bg-white rounded' />
                    <span id="bar" className='h-1 w-full bg-white rounded' />
                    <span id="bar" className='h-1 w-full bg-white rounded' />
                </a>
                
                <div id="MainNavBar-NavBarLinks" className='sm:flex sm:flex-row flex-col justify-between w-full hidden active:flex sm:h-[59px]' >
                    <ul className='m-0 p-0, flex sm:flex-row flex-col justify-evenly w-full'>
                    
                        <button 
                        onClick={(e) => {navClickHandler("/scores")}}
                        className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]">
                            Scores
                        </button>
                    
                        <button 
                        onClick={(e) => {navClickHandler("/news")}}
                        className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]">
                            News
                        </button>
                    
                        <button 
                        onClick={(e) => {navClickHandler("/standings")}}
                        className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]">
                            Standings
                        </button>
                    
                        <button 
                        onClick={(e) => {navClickHandler("/stats")}}
                        // href="stats.asp" 
                        className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]" >
                            Stats
                        </button>
                    
                        <button 
                        onClick={(e) => {navClickHandler("/schedule")}}
                        // href="schedule.asp" 
                        className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]">
                            Schedule
                        </button>
                    
                        {/* <a href="playoffs.asp" className="w3-bar-item w3-button w3-hide-small w3-padding-16 w3-hover-white" style="width:11.1%">Playoffs</a> */}
                        
                        <button 
                        onClick={(e) => {navClickHandler("/players")}}
                        // href="players.asp" 
                        className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]">
                            Players
                        </button>
                    
                        <button 
                        onClick={(e) => {navClickHandler("/teams")}}
                        // href="teams.asp" 
                        className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]">
                            Teams
                        </button>
                    
                        <button 
                        onClick={(e) => {navClickHandler("/history")}}
                        // href="history.asp" 
                        className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]">
                            History
                        </button>
                    
                        {/**if the user is logged in, show Manage, if they are not logged in, show Login */}
                    
                        {user
                        ?
                            <button 
                                // href="#" 
                                className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]"
                                onClick={(e) => {navClickHandler("/manage")}}>
                        
                                Manage
                            </button>    
                        :
                            <button 
                                // href="#" 
                                className="hover:bg-slate-50 hover:text-slate-900 justify-evenly block w-full text-center bg-[#616161] z-50 h-[59px]"
                                onClick={(e) => {navClickHandler("/signin")}}>
                            
                                Login
                            </button>
                        }
                    </ul>
                </div>
            </div>
            
            {user &&
            <div className='p-2 mr-2 bg-slate-200 m-2 shadow-md text-xs sm:text-base flex float-right'>
                <h1>You're logged in as <Link className='underline italic' to="/manage">{userInfo.name? userInfo.name : userInfo.email}</Link> | </h1>
                <a href="#" onClick={handleLogout} className='pl-2 underline'>Logout</a>
            </div>
            }

        </div>
    )
}