
import { reauthenticateWithCredential } from 'firebase/auth'
import {collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Popup from './Popup'

const ManageContracts = (props) => {

 
    // const team_id = props.team.id;
    // const team_name = props.team.data.name;
    // const team_code = props.team.data.code;
    // const gm_id = props.team.data.gm.value;
    // const league_id = props.league;

    //console.log("in league:"+league_id+"a team:"+team_id,"-",team_name,":",team_code,"...",gm_id);

    //const path = "/leagues/"+league_id+"/teams/"+team_id+"/contracts"

    //console.log("path:",path)

    const [contracts, setContracts] = useState([]);
    //const [selectedContracts, setSelectedContracts] = useState([]);
    const [team_id, setTeamId] = useState();
    const [team_name, setTeamName] = useState();
    const [team_code, setTeamCode] = useState();
    const [gm_id, setGMId] = useState();
    const [league_id, setLeagueId] = useState();
    const [path, setPath] = useState();
    const [selectedGameRosterPlayers, setSelectedGameRosterPlayers] = useState([]);
    const [gameRosterPlayers, setGameRosterPlayers] = useState([]);
    const [selectedFarmRosterPlayers, setSelectedFarmRosterPlayers] = useState([]);
    const [farmRosterPlayers, setFarmRosterPlayers] = useState([]);
    const [selectedScratchedPlayers, setSelectedScratchedPlayers] = useState([]);
    const [scratchedRosterPlayers, setScratchedRosterPlayers] = useState([]);
    
    //call the db
    const dbCall = () => {
        console.log("dbCall:start");
        console.log("Path:",path);
        //db call to get the team contracts information
        
        getDocs(collection(db, path))
        .then((qSnap) => {

            let ary = [];
            let aryGameRosterPlayers = [];
            let aryFarmRosterPlayers = [];
            let aryScratchedPlayers = [];

            qSnap.forEach((document) => {
                //console.log("a contract was found","document",document,"document.id",document.id,"document.data()",document.data());

                ary.push({
                    id:document.id,
                    value:document.data()
                })

                let level = document.data().level;

                if(level === "Professional"){
                    aryGameRosterPlayers.push({
                        id:document.id,
                        value:document.data()
                    })
                }
                else if(level === "Farm"){
                    aryFarmRosterPlayers.push({
                        id:document.id,
                        value:document.data()
                    })
                }
                else if(level === "Scratched"){
                    aryScratchedPlayers.push({
                        id:document.id,
                        value:document.data()
                    })
                }

                //console.log(ary);
            })

            setContracts(ary);
            setGameRosterPlayers(aryGameRosterPlayers);
            setFarmRosterPlayers(aryFarmRosterPlayers);
            setScratchedRosterPlayers(aryScratchedPlayers);
        })
        .then(() => {
            console.log("db called resolved");
        })
        .catch((err) => {
            console.error(err);
        })
    }

    //when path is updated, call db, this should run 'once' at the first load of this component
    useEffect(()=>{
        if(path != undefined){
            console.log("dbcall from path use effect")
            dbCall();
        }
    },[path])

    useEffect( () => {
        console.log("Doing once...");
        console.log("ManageContracts props:",props)
        console.log("ManageContracts props.team:",props.team,"ManageContracts props.team.id:",props.team.id,"ManageContracts props.team.data:",props.team.data)
        
        if(!team_id){
            console.log("Setting Team Id...");
            setTeamId(props.team.id);
        }
        if(!team_name){
            console.log("Setting Team Name...");
            setTeamName(props.team.data.name);
        }
        if(!team_code){
            console.log("Setting Team Code...");
            setTeamCode(props.team.data.code);
        }
        if(!gm_id){
            console.log("Setting GM Id...");
            setGMId(props.team.data.gm.value);
        }
        if(!league_id){
            console.log("Setting League Id...");
            setLeagueId(props.league);
        }
        
        
    },[gm_id, league_id, props, team_code, team_id, team_name])

    useEffect( () =>{
        if(!league_id && !team_id){
            console.log("league or team not set",league_id,team_id);
            return;
        }

        if(!path){
            console.log("Setting Path...");
            setPath("/leagues/"+league_id+"/teams/"+team_id+"/contracts");
            return;
        }

        if(contracts.length === 0){
            console.log("Contracts is:",contracts,"calling the db...");
            return;
        }

    },[league_id, team_id, path, contracts])

    

    useEffect( () => {
        // if(contracts.length !== 0){
        //     console.log("useEffect>contracts>if contracts.length !== 0 ... contracts object updated",contracts);
        // }
        // else{
        //     console.log("useEffect>contracts>else contracts object updated",contracts);
        // }

        // console.log("useEffect>contracts>",contracts.length);

        // console.log("ManageContracts:gameRosterPlayers",gameRosterPlayers);
        // console.log("ManageContracts:farmRosterPlayers",farmRosterPlayers);
        // console.log("ManageContracts:scratchedRosterPlayers",scratchedRosterPlayers);

        console.log("ManageContracts:selectedGameRosterPlayers",selectedGameRosterPlayers);
        console.log("ManageContracts:selectedFarmRosterPlayers",selectedFarmRosterPlayers);
        console.log("ManageContracts:selectedScratchedPlayers",selectedScratchedPlayers);
        

        
    }, [contracts, gameRosterPlayers, farmRosterPlayers, scratchedRosterPlayers, selectedFarmRosterPlayers, selectedGameRosterPlayers, selectedScratchedPlayers])

    const handleClick = (contract, section) => {
        console.log("click ...",contract)
        
        let ele = document.getElementById(contract.id);
        ele.classList.toggle("active")
        
        if(section === "gameRoster"){

            if(ele.classList.contains("active")){
                //style it as active, selected
                ele.className = "w-48 text-left text-xs whitespace-nowrap bg-slate-500 text-white active"
                setSelectedGameRosterPlayers(selectedGameRosterPlayers => [...selectedGameRosterPlayers, contract])
            }
            else{
                //style it as deselected
                ele.className = "w-48 text-left text-xs whitespace-nowrap bg-white"
                setSelectedGameRosterPlayers(selectedGameRosterPlayers.filter(gameRosterPlayers => gameRosterPlayers.id !== contract.id));
                
            }
        }

        if(section === "scratched"){

            if(ele.classList.contains("active")){
                //style it as active, selected
                ele.className = "w-48 text-left text-xs whitespace-nowrap bg-slate-500 text-white active"
                setSelectedScratchedPlayers(selectedScratchedPlayers => [...selectedScratchedPlayers, contract])
            }
            else{
                //style it as deselected
                ele.className = "w-48 text-left text-xs whitespace-nowrap bg-white"
                setSelectedScratchedPlayers(selectedScratchedPlayers.filter(scratchedRosterPlayers => scratchedRosterPlayers.id !== contract.id));
                
            }
        }

        if(section === "farmRoster"){

            if(ele.classList.contains("active")){
                //style it as active, selected
                ele.className = "w-48 text-left text-xs whitespace-nowrap bg-slate-500 text-white active"
                setSelectedFarmRosterPlayers(selectedFarmRosterPlayers => [...selectedFarmRosterPlayers, contract])
            }
            else{
                //style it as deselected
                ele.className = "w-48 text-left text-xs whitespace-nowrap bg-white"
                setSelectedFarmRosterPlayers(selectedFarmRosterPlayers.filter(farmRosterPlayers => farmRosterPlayers.id !== contract.id));
            }
        }

        

        console.log("ele",ele);
    }
    
    const handleRosterControl = (action) => {
        console.log(action);
    }

    const ScratchPlayers = () => {
        console.log("Scratching",selectedGameRosterPlayers);
        console.table(selectedGameRosterPlayers);

        let updateProms = [];

        selectedGameRosterPlayers.forEach(player => {
            console.log("Player to scratch:",player);
            //todo variablize this path
            let playerRef = doc(db, path+"/"+player.id);
            updateProms.push(updateDoc(playerRef, {
                level:"Scratched"
            }));
        });

        Promise.all(updateProms)
            .then(()=>{
                //db call after foreach loop to update ui
                console.log("dbcall from scratch");
                dbCall();

                setSelectedGameRosterPlayers([]);
            });        
        
        //setFarmRosterPlayers(farmRosterPlayers => [...farmRosterPlayers,selectedGameRosterPlayers])
        //setSelectedGameRosterPlayers([]);

        //return;
    }

    const DressPlayers = () => {
        console.log("Dressing",selectedScratchedPlayers);
        console.table(selectedScratchedPlayers);

        let updateProms = [];

        selectedScratchedPlayers.forEach(player => {
            console.log("Player to dress:",player);
            ////todo variablize this path
            let playerRef = doc(db, path+"/"+player.id);
            
            updateProms.push(updateDoc(playerRef, {
                level:"Professional"
            }));
        });

        Promise.all(updateProms)
            .then(()=>{
                //db call after foreach loop to update ui
                console.log("dbcall from dress");
                dbCall();

                setSelectedScratchedPlayers([]);
            });
        
        //setFarmRosterPlayers(farmRosterPlayers => [...farmRosterPlayers,selectedGameRosterPlayers])
        //setSelectedGameRosterPlayers([]);

        //return;
    }

    const SendToFarm = () => {
        console.log("Sending to farm",selectedScratchedPlayers);

        let updateProms = [];

        selectedScratchedPlayers.forEach(player => {
            console.log("Player to send to farm:",player);
            ////todo variablize this path
            let playerRef = doc(db, path+"/"+player.id);
            updateProms.push(updateDoc(playerRef, {
                level:"Farm"
            }));
        });

        Promise.all(updateProms)
            .then(()=>{
                //db call after foreach loop to update ui
                console.log("dbcall from send2farm");
                dbCall();

                setSelectedScratchedPlayers([]);
            });
        
        //setFarmRosterPlayers(farmRosterPlayers => [...farmRosterPlayers,selectedGameRosterPlayers])
        //setSelectedGameRosterPlayers([]);

        //return;
    }

    const SendToPro = () => {
        console.log("Sending to Pros"+JSON.stringify(selectedFarmRosterPlayers));

        let updateProms = [];

        selectedFarmRosterPlayers.forEach(player => {
            console.log("Player to send to Pros:",player);
            ////todo variablize this path
            let playerRef = doc(db, path+"/"+player.id);
            updateProms.push(updateDoc(playerRef, {
                level:"Scratched"
            }))
        });

        Promise.all(updateProms)
            .then(()=>{
                //db call after foreach loop to update ui
                console.log("dbcall from send2pro");
                dbCall();

                setSelectedFarmRosterPlayers([]);
            });
        
        //setFarmRosterPlayers(farmRosterPlayers => [...farmRosterPlayers,selectedGameRosterPlayers])
        //setSelectedGameRosterPlayers([]);

        //return;
    }



    return (

        <Popup trigger={props.trigger} setTrigger={props.setTrigger}>
            
            <div className='relative left-0 top-5 w-screen sm:max-w-4xl h-[600px] p-2'>

                <div className='bg-white'>
                    <h1 className='text-left text-xs font-bold p-1'>{gameRosterPlayers.length} Total Players</h1>
                    {gameRosterPlayers.length === 20?(
                        <h1 className='text-center text-green-500 text-xs font-bold p-1'>Valid Roster</h1>
                    ):(
                        <h1 className='text-center text-red-500 text-xs font-bold p-1'>Invalid Roster, need 20 players.</h1>
                    )}
                        <div className='flex p-2 pt-0'>
                            <div className='flex flex-col'>    
                                <h1 className='font-bold text-xs text-left'>Game Roster</h1>
                                <div className='w-52 h-56 border-2 overflow-y-scroll'>
                                    <ul className='w-full flex flex-col justify-evenly'>
                                        {gameRosterPlayers.map(contract => {
                                            return(
                                                <li key={contract.id} className='w-full p-0 m-0'>
                                                    <button 
                                                        id={contract.id}
                                                        className="w-48 text-left text-xs whitespace-nowrap m-0 p-0"
                                                        onClick={()=>handleClick(contract,"gameRoster")}>
                                                            {contract.value.player_name}                        
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className='flex w-full p-2 items-center justify-center'>
                                <button className='w-28 border-2 p-2 text-center' onClick={()=>ScratchPlayers()}>Scratch</button>
                            </div>
                        </div>

                        <div className='flex p-2 pt-0'>
                            <div className='flex flex-col'>    
                                <h1 className='font-bold text-xs text-left'>Scratches</h1>
                                <div className='w-52 h-56 border-2 overflow-y-scroll'>
                                    <ul className='w-full flex flex-col justify-evenly'>
                                        {scratchedRosterPlayers.map(contract => {
                                            return(
                                                <li key={contract.id} className='w-full p-0 m-0'>
                                                    <button 
                                                        id={contract.id}
                                                        className="w-48 text-left text-xs whitespace-nowrap m-0 p-0"
                                                        onClick={()=>handleClick(contract,"scratched")}>
                                                            {contract.value.player_name}                        
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className='flex flex-col w-full p-2 items-center justify-evenly'>
                                <button className='w-28 border-2 p-2 text-center whitespace-nowrap' onClick={()=>DressPlayers()}>Dress</button>
                                <button className='w-28 border-2 p-2 text-center whitespace-nowrap' onClick={()=>SendToFarm()}>Send to Farm</button>
                            </div>
                        </div>

                        <div className='flex p-2 pt-0'>
                            <div className='flex flex-col'>    
                                <h1 className='font-bold text-xs text-left'>Farm Roster</h1>
                                <div className='w-52 h-56 border-2 overflow-y-scroll'>
                                    <ul className='w-full flex flex-col justify-evenly'>
                                        {farmRosterPlayers.map(contract => {
                                            return(
                                                <li key={contract.id} className='w-full p-0 m-0'>
                                                    <button 
                                                        id={contract.id}
                                                        className="w-48 text-left text-xs whitespace-nowrap m-0 p-0"
                                                        onClick={()=>handleClick(contract,"farmRoster")}>
                                                            {contract.value.player_name}                        
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className='flex flex-col w-full p-2 items-center justify-evenly'>
                                <button className='w-28 border-2 p-2 text-center whitespace-nowrap' onClick={()=>SendToPro()}>Send to Pro</button>
                            </div>
                        </div>
                </div>
                

                <div>    
                    <div>
                        <h1>Selected Contracts</h1>
                    </div>
                    <div className='border-2 border-yellow-400'>
                        <h1 className='font-bold text-lg'>Controls</h1>
                        <div className='flex'>
                            <button className='border-2 w-full' onClick={()=>handleRosterControl('add')}>Add</button>
                            <button className='border-2 w-full'>Remove</button>
                            <button className='border-2 w-full'>Clear</button>
                        </div>
                    </div>

                    <div className='border-2 border-red-500'>
                        <h1 className='font-bold text-lg'>Game Roster</h1>
                        <div className=''>
                            <ul className='flex p-2 justify-evenly'>
                                <li className='border-2 w-full'>
                                    Player 1
                                </li>
                                <li className='border-2 w-full'>
                                    Player 2
                                </li>
                                <li className='border-2 w-full'>
                                    Player 3
                                </li>
                                <li className='border-2 w-full'>
                                    Player 4
                                </li>
                                <li className='border-2 w-full'>
                                    Player 5
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    hi
                </div>
            </div>
        </Popup>
    )
}

export default ManageContracts