import { collection, collectionGroup, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import Select from 'react-select';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}



const ManageLeague = (props) => {

  console.log("ManageLeague",props);
  console.log("userInfo",props.userInfo);
  console.log("commissioner_for_league",props.userInfo.commissioner_for_league);
  console.log("commissioner_for_league.path",props.userInfo.commissioner_for_league.path);

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

  //functions
  function setUserSelectOptions(i){
    console.log("setUserSelectOptions i:",i);

    const options = [];

    for(const data of i){
      console.log("within the for loop, data",data);
      options.push({
        value:data.id,
        label:data.data.name? data.data.name : data.data.email
      })
    }

    console.log("output of options for users",options);

    setGMOptions(options);
  }

  function setTeamSelectOptions(i){
    console.log("setTeamSelectOptions",i);

    const options = [];

    for(const data of i){
      console.log("within the for loop, data",data);
      options.push({
        value:data.id,
        label:data.data.name? data.data.name : data.data.code
      })
    }

    console.log("output of options for teams",options);

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
          console.log(doc.id, "=>",doc.data());
          
          i.name = doc.data().name;
          i.salary_cap = numberWithCommas(doc.data().salary_cap);
          i.commissioner = doc.data().commissioner.id;
          i.current_season = doc.data().current_season;
          i.id = doc.id;

          console.log("league info after db query, within db result loop",i);
          setleagueInfo(i);

        })  
      }
    })

    //usersSnapshot: query the db for a list of all users, regardless if they are a gm or not
    try{
      const userQ = query(collection(db,"users"), where("isGM", "==", false));
      console.log("userQ",userQ)
      const usersSnapshot = getDocs(userQ).then((data) => {

        console.log("usersSnapshot",data)

        if(mounted){
          let i = [];
  
          data.forEach((doc) => {
            console.log("usersSnapshot doc.data()",doc.data(),"doc",doc);
            i.push({
              id: doc.id,
              data: doc.data()
            });
          })
  
          console.log("i",i);
          
          setAvailableUsers(i);
        }
      })
    }
    catch(e){
      console.error("userQ/usersSnapshot error:",e);
    }
    

    //gmQ, gmSnapshot: query the db for a list of GMs, users who are assigned to a team in the league
    // const gmQ = query(collection(db, "users"), where("isGM", "==", true));
    // const gmSnapshot = getDocs(gmQ)
    // .then((data) => {
    //   if(mounted){
    //     let i = [];

    //     console.log(data);

    //     data.forEach((doc) => {
    //       console.log("doc.data()",doc.data());
    //       i.push(doc.data());
    //     })

    //     console.log("i",i);
    //   }
    // })

    //teamQ, teamSnapshot: query the db for a list of teams that do not have a GM assigned to them yet
    console.log("league_path",league_path)
    const teamQ = query(collection(db,league_path+"/teams"), orderBy("name"), where('hasGM', '==', false));
    console.log("teamQ",teamQ)
    const teamSnapshot = getDocs(teamQ)
      .then((data) => {
        if(mounted){
          let i = [];

          console.log("teams query",data);

          data.forEach((doc) => {
            console.log("doc.data()",doc.data());
            i.push({
              id: doc.id,
              data: doc.data()
            });
          })

          setAvailableTeams(i);
        }
      })
    
    //gm query
    console.log("list of GMs");
    const gmQ = query( collection(db, league_path+"/teams"), where('hasGM', '==', true), orderBy("name") )
    const gmSnapshot = getDocs(gmQ).then( (data) => {
      if(mounted){
        let i = [];

        console.log("gmSnapshot:list of GMs who run teams", data);

        data.forEach((doc) => {
          i.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setLeagueGMs(i);
      }
    })


    //return statement called on unmount of component
    return () => {
      mounted = false;
    }    
  },[])

  //when league info is set/updated
  useEffect( () => {
    if(Object.keys("leagueInfo").length == 0){
      console.log("leagueinfo not set");
    }
    else{
      console.log("leagueInfo");
      console.log(leagueInfo);
    }

  }, [leagueInfo])

  //set list objects to populate dropdowns
  useEffect( () => {
    
    //check for list of users
    if(Object.keys("availableUsers").length == 0){
      console.log("availableUsers not set");
    }
    else{
      console.log("availableUsers",availableUsers);
      setUserSelectOptions(availableUsers);
    }

    //check for list of teams
    if(Object.keys("availableTeams").length == 0){
      console.log("availableTeams not set");
    }
    else{
      console.log("availableTeams",availableTeams);
      setTeamSelectOptions(availableTeams);
    }

    //check for list of GMs who run teams
    if(Object.keys("leagueGMs").length == 0){
      console.log("leagueGMs not set");
    }
    else{
      console.log("leagueGMs",leagueGMs);
      //setTeamSelectOptions(availableTeams);
    }

  }, [availableUsers, availableTeams, leagueGMs])

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
          {leagueGMs && Object.keys(leagueGMs).map((key) => (
            <h3 className='text-left px-4'>
              {console.log("key",key)}
              {console.log("leagueGMs",leagueGMs)}
              {console.log("leagueGMs[key]",leagueGMs[key])}
              {console.log("leagueGMs[key].id",leagueGMs[key].id)}
              {console.log("leagueGMs[key].data",leagueGMs[key].data)}
              {console.log("leagueGMs[key].data.name",leagueGMs[key].data.name)}
              {leagueGMs[key].data.name} - {leagueGMs[key].data.gm.label}{console.log(leagueGMs[key])}
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
    </div>
  )
}

export default ManageLeague
