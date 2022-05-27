import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import ManageContracts from './ManageContracts';

const ManageTeam = (props) => {

  const commissioner_league_path = props.userInfo.commissioner_for_league.path;
  const league_id = props.userInfo.default_league.value;
  const team_id = props.userInfo.team;
  const [team, setTeam] = useState("");
  const [manageContracts, setManageContracts] = useState(false);

  console.log("league",league_id);

  //run some db queries to collect data for this component
  //const leagueCollection = doc(db, 'leagues/'+league_id);

  //run once, query db and set league
  useEffect( () => {

    //doc ref
    const teamDoc = doc(db, 'leagues/'+league_id+"/teams/"+team_id)

    getDoc(teamDoc)
    .then((doc) => {
      setTeam({
        id: doc.id,
        data: doc.data()
      })
    })

  },[])

  //run once league has been set
  useEffect( () => {

    console.log("team is:",team);
    
  },[team])

  return (
    <div className='mt-2'>
      {team.data && 
      <div className='pointer-events-auto shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center'>
        <h1 className='text-center text-lg font-bold'>
          {team.data.name}
        </h1>

        <button 
          className={` w-full h-10 ${manageContracts? "bg-slate-500 text-white":"hover:bg-zinc-600 hover:text-white focus:bg-slate-500 focus:text-white"}`}
          onClick={() => {setManageContracts(!manageContracts);}}>    
          Manage Contracts
        </button>
        
        {manageContracts &&
          <ManageContracts team={team} league={league_id} trigger={manageContracts} setTrigger={setManageContracts}/>
        }
        
      </div>
      }
    </div>
  )
}

export default ManageTeam