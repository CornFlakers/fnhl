import { collection, collectionGroup, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import Select from 'react-select';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}



const ManageLeague = (props) => {

  const league_path = props.userInfo.commissioner_for_league.path;

  const [leagueInfo, setleagueInfo] = useState({});
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [leagueGMs, setLeagueGMs] = useState([]);
  
  const [gmOptions, setGMOptions] = useState();//options to select gms and assign them to a team
  const [teamOptions, setTeamOptions] = useState();//team options to select and pair with a selected gm
  const [allTeamOptions, setAllTeamOptions] = useState(); //get a list of all teams to be used to select which two teams to play in the sim

  const [gmValue, setGMValue] = useState("");//the selected gm value
  const [teamValue, setTeamValue] = useState("");//the selected team value

  const [homeTeam, setHomeTeam] = useState();
  const [awayTeam, setAwayTeam] = useState();

  const [playerName, setPlayerName] = useState();//user provided
  const [playerAge, setPlayerAge] = useState();//user provided
  const [playerCareerEarnings, setPlayerCareerEarnings] = useState(0);//default 0
  const [playerCondition, setPlayerCondition] = useState(100);//default 100
  const [playerCurrentTeam, setPlayerCurrentTeam] = useState();//user provided
  const [playerTeams, setPlayerTeams] = useState([]);

  //functions
  function setUserSelectOptions(i){

    const options = [];

    for(const data of i){
      options.push({
        value:data.id,
        label:data.data.name? data.data.name : data.data.email
      })
    }

    setGMOptions(options);
  }

  function setTeamSelectOptions(i){

    const options = [];

    for(const data of i){
      options.push({
        value:data.id,
        label:data.data.name? data.data.name : data.data.code
      })
    }

    setTeamOptions(options);
  }

  //db functions
  useEffect( () => {
  
    let mounted = true;

    //leagueSnapshot: get a list of 'all the leagues' in the sim, currently just building for one
    const leagueSnapshot = getDocs(collection(db,'leagues'))
    .then((data) => {
      if(mounted){
        let i = {};

        data.forEach((doc) => {
          
          i.name = doc.data().name;
          i.salary_cap = numberWithCommas(doc.data().salary_cap);
          i.commissioner = doc.data().commissioner.id;
          i.current_season = doc.data().current_season;
          i.id = doc.id;

          setleagueInfo(i);

        })  
      }
    })

    //usersSnapshot: query the db for a list of all users, regardless if they are a gm or not
    try{
      const userQ = query(collection(db,"users"), where("isGM", "==", false));
      const usersSnapshot = getDocs(userQ).then((data) => {

        if(mounted){
          let i = [];
  
          data.forEach((doc) => {
            i.push({
              id: doc.id,
              data: doc.data()
            });
          })
          
          setAvailableUsers(i);
        }
      })
    }
    catch(e){
      console.error("userQ/usersSnapshot error:",e);
    }
    
    //teamQ, teamSnapshot: query the db for a list of teams that do not have a GM assigned to them yet
    const teamQ = query(collection(db,league_path+"/teams"), orderBy("name"), where('hasGM', '==', false));
    const teamSnapshot = getDocs(teamQ)
      .then((data) => {
        if(mounted){
          let i = [];

          data.forEach((doc) => {
            i.push({
              id: doc.id,
              data: doc.data()
            });
          })

          setAvailableTeams(i);
        }
      })
    
    //gm query
    const gmQ = query( collection(db, league_path+"/teams"), where('hasGM', '==', true), orderBy("name") )
    const gmSnapshot = getDocs(gmQ).then( (data) => {
      if(mounted){
        let i = [];

        data.forEach((doc) => {
          i.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setLeagueGMs(i);
      }
    })

    //all team query for create a player team list
    if(playerTeams.length === 0)
    {
      const createPlayerTeamListQ = query(collection(db, league_path+"/teams"), orderBy("name"))
      getDocs(createPlayerTeamListQ)
        .then((doc) => {
          if(mounted){
            doc.forEach((doc) => {
              console.log("createPlayerTeamListQ",doc)
              setPlayerTeams(old => [...old, {
                "id":doc.id,
                "value":doc.data()
              }])
            })
          }
        })
        .then(console.log("teams set"))
        .catch((err) => {console.error(err)})
    }
    


    //return statement called on unmount of component
    return () => {
      mounted = false;
    }    
  },[])

  //run on playerTeams update
  useEffect( () => {
    if(playerTeams.length === 0){
      return;
    }
    else{
      console.log("PlayerTeams",playerTeams);
    }

  }, [playerTeams])

  //set list objects to populate dropdowns
  useEffect( () => {
    
    //check for list of users
    if(availableUsers.length === 0){
      //
    }
    else{
      setUserSelectOptions(availableUsers);
    }

    //check for list of teams
    if(availableTeams.length === 0){
      //
    }
    else{
      setTeamSelectOptions(availableTeams);
    }

  }, [availableUsers, availableTeams])

  const handleUserChange = (e) => {
    console.log("handleUserChange",e);
    setGMValue(e)
  }

  const handleTeamChange = (e) => {
    console.log("handleTeamChange",e);
    setTeamValue(e)
  }

  const updateTeamOwners = (e) => {
    e.preventDefault();
    console.log("updateTeamOwners",e);
    console.log("gmValue",gmValue)
    console.log("gmValue.value",gmValue.value)

    console.log("teamValue",teamValue)
    console.log("teamValue.value",teamValue.value)

    //update firestore teams collection to set teamValue.gm = gmValue
    try{
      //write an update to the teams collection that there is a GM now, and also add the gm object for name/id for future lookups
      updateDoc( doc(db, league_path+"/teams/"+teamValue.value), {gm: gmValue, hasGM: true} )
      .then( () => {
        console.log("write complete");
        //then write to update user collection that this user is a GM now
        updateDoc ( doc(db, 'users', gmValue.value), {isGM: true, team: teamValue.value} )
        .then( () => {
          console.log("user collection updated")
        })
      });
    }
    catch(e){
      console.error(e);
    }

    //update list of GMs

  }

  const simulateGames = (e) => {
    e.preventDefault();
    console.log("sim games");
  }

  const handleHomeTeamChange = (e) => {
    setHomeTeam(e)
  }

  const handleAwayTeamChange = (e) => {
    setAwayTeam(e)
  }

  const createPlayer = (e) => {
    e.preventDefault()
    if(window.confirm("Player created...")){
      let obj = {
        age: playerAge,
        career_earnings: 0,
        condition: 100,
        current_team: playerCurrentTeam,
        current_team_value: "team name",
        draft: "",
        drafted_at: 0,
        drafted_by: "team_name",
        drafted_detail: "1/26, First Round, 26th Overall",
        height_in_inches: 72,
        isInjured: false,
        name: playerName,
        shot_direction: "right",
        weight_in_lbs: 200,
        years_in_pro: 1,
      }

      console.log("obj",obj);
    }
    else{
      console.log("cancel");
    }
  }

  const clearPlayerForm = (e) => {
    e.preventDefault();
    let txtPlayerName = document.getElementById("player_name");
    console.log(txtPlayerName);
    setPlayerName("");
    setPlayerAge("");
  }

  return (
    <div className='mt-2'>
      
      <div className='shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center'>
        <h1 className='text-center text-lg'>
          <b>{leagueInfo?.name} - Season:</b> {leagueInfo?.current_season}
        </h1>
        <h1 className='text-center text-lg'>
        <b>Salary Cap:</b> {leagueInfo?.salary_cap}
        </h1>
      </div>
      
      {/* 
      This section is where a commissioner can manage the league.
      Define Teams?
      Manage Team to Owner relationship?
      Create/Set Schedule?
      Sim a game between two teams?
        One off?
        Based on schedule?
      */}
      
      {/* List of GMs */}
      
      <div className='shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center mt-2'>
        <form onSubmit={simulateGames}>
            
          <h1 className='text-center underline font-bold pt-2'>Simulate</h1>
          <p className='p-2 text-center'>Select two teams to simulate a game</p>

          <div className='flex flex-wrap px-4 justify-center'>
            <div className='p-1'>
              <h1 className='w-40 align-middle'>Home Team</h1>
              <div className='w-64'>
                <Select options={allTeamOptions} onChange={handleHomeTeamChange} />
              </div>
            </div>

            <div className='p-2'>
              <h1 className='w-40'>Away Team</h1>
              <div className='w-64'> 
                <Select options={allTeamOptions} onChange={handleAwayTeamChange} />
              </div>
            </div>
          </div>

          <div className='text-center border-t-2 mt-4'>
            <button className='w-full h-10 hover:bg-zinc-600 hover:text-white' type='submit'>Simulate</button>
          </div>
            
        </form>
      </div>  

      <div className='shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center mt-2'>
        <h1 className='text-center underline font-bold py-2'>List of League GMs</h1>
          {leagueGMs.map((gm) => (
            <h3 className='text-left px-4' key={gm.id}>
              {gm.data.name} - {gm.data.gm.label}
            </h3>
          ))} 
      </div>

      <div className='shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center mt-2 pt-2'>
        <form onSubmit={updateTeamOwners}>
            
          <h1 className='text-center underline font-bold'>Manage Your League</h1>
          <p className='p-2 text-left px-4'>Select a User, who is not already a GM. Then select a Team, that does not already have a GM. Submit to make the link.</p>

          <div className='flex flex-wrap px-4 justify-center'>

            <div className='p-2'>
              <h1 className='w-40 align-middle'>List of Available Users</h1>
              <div className='w-64'>
                <Select options={gmOptions} onChange={handleUserChange} />
              </div>
            </div>

            <div className='p-2'>
              <h1 className='w-40'>List of Available Teams</h1>
              <div className='w-64'> 
                <Select options={teamOptions} onChange={handleTeamChange} />
              </div>
            </div>
          </div>

          <div className='text-center border-t-2 mt-4'>
            <button className='w-full h-10 hover:bg-zinc-600 hover:text-white' type='submit'>Submit</button>
          </div>
        </form>
      </div> 
      
      <div className='shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center mt-2 pt-2'>
        <h1 className='text-center underline font-bold'>Create a Player</h1>
        <p>Create a new player, associate them to a Team's Contracts</p>

        <div>
          <form onSubmit={createPlayer}>
            <div>

            </div>
            <div className='text-center border-t-2 mt-4'>
            {/* doc_id: guid,
        age: 00,
        career_earnings: 50000000, set 0 default
        condition: 100, set 100 default
        current_team: "{team_id}",
        current_team_value: "team name",
        draft: "{draft_id}",
        drafted_at: 1,
        drafted_by: "team_name",
        drafted_detail: "1/26, First Round, 26th Overall",
        height_in_inches: 000,
        isInjured: true/false,
        name: "player name",
        shot_direction: "left or right",
        weight_in_lbs: 000,
        years_in_pro: 00, */}

              
              <label>Player Name</label>
              <input type='text' id="player_name" onChange={(e) => setPlayerName(e.target.value)} placeholder="Text..." />

              <label>Age</label>
              <input type='text' id="player_age" onChange={(e) => setPlayerAge(e.target.value)} placeholder="Number..." />

              <label>Current Team</label>
              <select onChange={(e) => {console.log(e); setPlayerCurrentTeam(e.target.value)}}>
                { playerTeams.map((team) => {
                    return(
                      <option value={team.id} key={team.id}>{team.value.name}</option>
                    )
                  })
                }
              </select>


              <div className='flex'>
              <button className='w-full h-10 border-t-2' onClick={clearPlayerForm}>Clear</button>
              <input className='w-full h-10 border-t-2' type='submit' value="Create Player" />
              </div>
            </div>
          </form>
        </div>
      </div> 
    </div>
  )
}

export default ManageLeague
