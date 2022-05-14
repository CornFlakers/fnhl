import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';

const ManageTeam = (props) => {

  const commissioner_league_path = props.userInfo.commissioner_for_league.path;
  const league_id = props.userInfo.default_league.value;
  const team_id = props.userInfo.team;
  const [team, setTeam] = useState("");

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
      <div className='shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center'>
        {team.data && 
          <h1 className='text-center text-lg font-bold'>
            {team.data.name}
          </h1>
        }
      </div>
    </div>
  )
}

export default ManageTeam