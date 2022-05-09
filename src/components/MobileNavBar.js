import IMAGES from '../images/index.js'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export const MobileNavBar = () => {

    const navigate = useNavigate();

    const loginHandler = () =>{
        navigate("/signin")
    }

    const toggleMenu = () => {
        // alert("toggle menu");
        if(document.getElementById("navSmallMenu").classList.contains("")){
            document.getElementById("navSmallMenu").classList.remove("");
        }
        else{
            document.getElementById("navSmallMenu").classList.add("");
        }
    }
    
    const home = () => {
        if(document.getElementById("navSmallMenu").classList.contains("")){
            document.getElementById("navSmallMenu").classList.remove("");
        }
    }

    return(
        <div className="">
            <div className="">
                <button 
                    className="" 
                    onClick={toggleMenu}
                    title="Toggle Navigation Menu">
                        <FontAwesomeIcon icon={faBars} />
                </button>
                <button 
                    onClick={home}
                    className="">
                        <img src={IMAGES.logoFNHL} className=""/>
                </button>
            </div>
  
            <div id="navSmallMenu" className="">
                <button 
                    className="">
                        Scores
                </button> 
                <button 
                    className="">
                        News
                </button> 
                <button 
                    className="">
                        Standings
                </button>
                <button 
                    className="">
                        Stats
                </button>
                <button 
                    className="">
                        Schedule
                </button>
                {/* <a href="playoffs.asp" className="w3-bar-item w3-button w3-padding-large">Playoffs</a> */}
                <button 
                    className="">
                        Players
                </button>
                <button 
                    // href="teams.asp" 
                    className="">
                        Teams
                </button>	
                <button 
                    // href="history.asp" 
                    className="">
                        History
                </button>
        
                <button 
                    // href="#" 
                    className="" 
                    onClick={loginHandler}>
                        Login
                </button>
            </div>
        </div>
    )
}