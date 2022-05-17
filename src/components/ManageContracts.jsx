import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'

const ManageContracts = (props) => {

    console.log("ManageContracts props:",props)
    console.log("ManageContracts props.team:",props.team,"ManageContracts props.team.id:",props.team.id,"ManageContracts props.team.data:",props.team.data)
    
    // const team_id = props.team.id;
    // const team_name = props.team.data.name;
    // const team_code = props.team.data.code;
    // const gm_id = props.team.data.gm.value;
    // const league_id = props.league;

    //console.log("in league:"+league_id+"a team:"+team_id,"-",team_name,":",team_code,"...",gm_id);

    //const path = "/leagues/"+league_id+"/teams/"+team_id+"/contracts"

    //console.log("path:",path)

    const [contracts, setContracts] = useState([]);
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [team_id, setTeamId] = useState();
    const [team_name, setTeamName] = useState();
    const [team_code, setTeamCode] = useState();
    const [gm_id, setGMId] = useState();
    const [league_id, setLeagueId] = useState();
    const [path, setPath] = useState();
    

    useEffect( () => {
        console.log("Doing once...");
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
        
        
    },[])

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
            dbCall();
            return;
        }

    },[league_id, team_id, path])

    const dbCall = () => {
        console.log("dbCall:start");
        console.log("Path:",path);
        //db call to get the team contracts information
        const querySnapshot = getDocs(collection(db, path))
        .then((qSnap) => {
            qSnap.forEach((document) => {
                console.log(document,document.id,document.data());
                setContracts([...contracts,{
                    id:document.id,
                    value:document.data()
                }]);
            })
        })
        .then(() => {
            console.log("db called resolved");
        })
        .catch((err) => {
            console.error(err);
        })
    }

    useEffect( () => {
        if(contracts){
            console.log("contracts object updated",contracts);
        }
        
    }, [contracts])

    const handleClick = (contract) => {
        console.log("click ...",contract)
        let ele = document.getElementById(contract.id);
        ele.classList.toggle("active")

        
        if(ele.classList.contains("active")){
            //style it as active, selected
            ele.className = "w-full h-10 bg-slate-500 text-white hover:bg-zinc-600 hover:text-white focus:bg-slate-500 focus:text-white active"
            setSelectedContracts(selectedContracts => [...selectedContracts,contract])
        }
        else{
            //style it as deselected
            setSelectedContracts(selectedContracts.filter(contracts => contracts.id !== contract.id));
            ele.className = "w-full h-10 bg-white text-black"
        }

        console.log("ele",ele);
    }

    useEffect(()=>{
        if(selectedContracts.length > 0){
            console.log("selected contracts",selectedContracts);
        }
    },[selectedContracts])
    

  return (
      <div className='border-2'>
          
            <div className='w-full'> 
                <h1 className='w-full '>List of players under contract</h1>
                <div className='w-full'>
                    <ul className='w-full flex justify-evenly'>
                    {contracts.map(contract => {
                        return(
                            <li key={contract.id} className='w-full'>
                                <button 
                                    id={contract.id}
                                    className="w-full h-10"
                                    onClick={()=>handleClick(contract)}>
                                        {contract.value.player_name}                        
                                </button>
                            </li>
                        )
                    })}
                    </ul>
                </div>
            </div>

            <div>
                <h1>Selected Contracts</h1>
                    <div className='flex'>
                    {selectedContracts.map( (selectedContract,index) => {
                        return(
                            <h1 key={selectedContract.id}>{index>0 && ","}{selectedContract.value.player_name}</h1>
                        )
                    })}
                    </div>

            </div>

            <div className='border-2 border-yellow-400'>
                <h1 className='font-bold text-lg'>Controls</h1>
                <div className='flex'>
                    <button className='border-2 w-full'>Add</button>
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
    
  )
}

export default ManageContracts