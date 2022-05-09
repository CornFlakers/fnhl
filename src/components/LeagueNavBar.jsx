import React from "react"
import IMAGES from '../images/index.js';
import { Navigate, useNavigate } from 'react-router-dom';

export const LeagueNavBar = () => {

    const navigate = useNavigate();

    const navClickHandler = (e) => {
        navigate(e)
    }

    return(
        <div className="LeagueNavBar hidden md:block shadow-md w-full top-2 left-0 h-[43px]">
            <ul className="flex justify-evenly">
                <li className="">
                    <button className="" title="Home" onClick={(e) => {navClickHandler("home")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoFNHL} alt=""  />
                    </button>
                </li>
                <li>
                    <button className="" title="Anaheim Ducks" onClick={(e) => {navClickHandler("team/ana")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoANA}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Arizona Coyotes" onClick={(e) => {navClickHandler("team/arz")}} >
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoPHX}  /> 
                    </button>
                </li>		
                <li>
                    <button className="" title="Boston Bruins" onClick={(e) => {navClickHandler("team/bos")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoBOS}  /> 
                    </button>
                </li>
                <li>
                    <button className="" title="Buffalo Sabers" onClick={(e) => {navClickHandler("team/buf")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoBUF}  /> 
                    </button>
                </li>
                <li>
                    <button className="" title="Carolina Hurricanes" onClick={(e) => {navClickHandler("team/car")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoCAR}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Calgary Flames" onClick={(e) => {navClickHandler("team/cgy")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoCGY}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Chicago Blackhawks" onClick={(e) => {navClickHandler("team/chi")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoCHI}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Colorado Avalanche" onClick={(e) => {navClickHandler("team/col")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoCOL}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Columbus Bluejackets" onClick={(e) => {navClickHandler("team/cbj")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoCBJ}  />
                    </button>	
                </li>
                <li>
                    <button className="" title="Dallas Stars" onClick={(e) => {navClickHandler("team/dal")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoDAL}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Detroit Red Wings" onClick={(e) => {navClickHandler("team/det")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoDET}  />
                    </button>	
                </li>
                <li>
                    <button className="" title="Edmonton Oilers" onClick={(e) => {navClickHandler("team/edm")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoEDM}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Florida Panthers" onClick={(e) => {navClickHandler("team/fla")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoFLA}  />
                    </button>
                </li>
                <li>
                    <button className="" title="New York Islanders" onClick={(e) => {navClickHandler("team/nyi")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoNYI}  />
                    </button>
                </li>
                <li>
                    <button className="" title="New York Rangers" onClick={(e) => {navClickHandler("team/nyr")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoNYR}  />
                    </button>		
                </li>
                <li>
                    <button className="" title="Los Angeles Kings" onClick={(e) => {navClickHandler("team/la")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoLA}  />
                    </button>	
                </li>
                <li>
                    <button className="" title="Minnesota Wild" onClick={(e) => {navClickHandler("team/min")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoMIN}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Montreal Canadiens" onClick={(e) => {navClickHandler("team/mtl")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoMON}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Nashville Predators" onClick={(e) => {navClickHandler("team/nsh")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoNAS}  />
                    </button>
                </li>
                <li>
                    <button className="" title="New Jersey Devils" onClick={(e) => {navClickHandler("team/njd")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoNJD}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Ottawa Senators" onClick={(e) => {navClickHandler("team/ott")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoOTT}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Philadelphia Flyers" onClick={(e) => {navClickHandler("team/phi")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoPHI}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Pittsburgh Penguins" onClick={(e) => {navClickHandler("team/pit")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoPIT}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Seattle Kraken" onClick={(e) => {navClickHandler("team/sea")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoSEA}  />
                    </button>
                </li>
                <li>
                    <button className="" title="San Jose Sharks" onClick={(e) => {navClickHandler("team/sjs")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoSJS}  />
                    </button>
                </li>
                <li>
                    <button className="" title="St. Louis Blues" onClick={(e) => {navClickHandler("team/stl")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoSTL}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Tampa Bay Lightning" onClick={(e) => {navClickHandler("team/tbl")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoTB}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Toronto Maple Leafs" onClick={(e) => {navClickHandler("team/tor")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoTOR}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Vancouver Canucks" onClick={(e) => {navClickHandler("team/van")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoVAN}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Las Vegas Golden Knights" onClick={(e) => {navClickHandler("team/vgk")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoVEG}  />
                    </button>	
                </li>
                <li>
                    <button className="" title="Washington Capitals" onClick={(e) => {navClickHandler("team/wsh")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoWSH}  />
                    </button>
                </li>
                <li>
                    <button className="" title="Winnipeg Jets" onClick={(e) => {navClickHandler("team/wpg")}}>
                        <img className="h-auto w-[35px] py-1" src={IMAGES.logoWPG}  />
                    </button>
                </li>
            </ul>
        </div>
    )
}