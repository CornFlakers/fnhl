import { addDoc, collection, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import Select from 'react-select';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/*
Clicking Manage Rosters will load this pop-up.
  build it like: https://fnhlonline.com/gmeditor/
  no auto or protect buttons required.

  once you have a valid roster,
  grey out button,
  once you have valid roster, let them click 'manage lines'

  manage lines should load in a pop-ip
  rosters must be under cap

*/

const ManageLeague = (props) => {

  //console.log("ManageLeague.Props",props);

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
  const [playerAge, setPlayerAge] = useState(18);//user provided, defualt 18
  const [playerCareerEarnings, setPlayerCareerEarnings] = useState(0);//default 0
  const [playerCondition, setPlayerCondition] = useState(100);//default 100
  const [playerCurrentTeam, setPlayerCurrentTeam] = useState("fTegT7RJrRl57U4FTV9O");//user provided
  const [playerCurrentTeamName, setPlayerCurrentTeamName] = useState("Anaheim");//user provided
  const [playerTeams, setPlayerTeams] = useState([]);
  const [playerHeight, setPlayerHeight] = useState(72);//default 6ft / 72"
  const [playerShotDir, setPlayerShotDir] = useState();//user provided
  const [playerWeight, setPlayerWeight] = useState(200);//user provided, default 200
  const [playerIT, setPlayerIT] = useState(50);//user provided, default 50
  const [playerSP, setPlayerSP] = useState(50);//user provided, default 50
  const [playerST, setPlayerST] = useState(50);//user provided, default 50
  const [playerEN, setPlayerEN] = useState(50);//user provided, default 50
  const [playerDU, setPlayerDU] = useState(50);//user provided, default 50
  const [playerDI, setPlayerDI] = useState(50);//user provided, default 50
  const [playerSK, setPlayerSK] = useState(50);//user provided, default 50
  const [playerPA, setPlayerPA] = useState(50);//user provided, default 50
  const [playerPC, setPlayerPC] = useState(50);//user provided, default 50
  const [playerDF, setPlayerDF] = useState(50);//user provided, default 50
  const [playerSC, setPlayerSC] = useState(50);//user provided, default 50
  const [playerEX, setPlayerEX] = useState(50);//user provided, default 50
  const [playerLD, setPlayerLD] = useState(50);//user provided, default 50
  const [playerSalary, setPlayerSalary] = useState(750000);//user provided, default 750 000
  const [playerPosition, setPlayerPosition] = useState("F");//user provided, default F

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
          i.path = doc.ref.path;

          setleagueInfo(i);

        })  
      }
    })

    //usersSnapshot: query the db for a list of all users, regardless if they are a gm or not
    try{
      const userQ = query(collection(db,"users"), where("isGM", "==", false));
      const usersSnapshot = 
        getDocs(userQ)
          .then((querySnapshot) => {
            let i = [];
            
            querySnapshot.forEach((doc) => {
              i.push({
                doc: doc,
                id: doc.id,
                data: doc.data()
              });
            })
            
            setAvailableUsers(i);
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
  },[league_path, playerTeams])

  useEffect( () => {
    console.log("ManageLeague>LeagueInfo",leagueInfo);
  }, [leagueInfo])

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

  //a function to create the player, when the user clicks in the ui after filling in form
  const createPlayer = (e) => {
    e.preventDefault();

    //build out the player object based on input from form/
    let player = buildPlayerObj();
    console.log("ManageLeague>createPlayer",player);

    //log to console for opt to review and confirm
    if(window.confirm("Are you sure you want to Create this Player?")){
      //user wants to create the player, proceed.
      let dbPlayerCreateResult = dbPlayerCreate(player);
      console.log(dbPlayerCreateResult);
    }
    else{
      console.log("cancel");
    }
  }

  //function to create the player in the db and assign them to a team if applicable, updating a teams contracts
  function dbPlayerCreate(player){
    console.log("dbPlayerCreate>player",player);

    //update firestore players collection
    try{
      //write an update to the players collection of the league as a new player has been added to the league
      //and potentially to a particular team
      let newPlayerRef = doc(collection(db, league_path+"/players"));
      setDoc(newPlayerRef,{
        age: player.age,
        career_earnings: player.career_earnings,
        condition: player.condition,
        current_team: player.current_team,
        current_team_value: player.current_team_value,
        draft: player.draft,
        drafted_at: player.drafted_at,
        drafted_by: player.drafted_by,
        drafted_by_id: player.drafted_by_id,
        drafted_detail: player.drafted_detail,
        height_in_inches: player.height_in_inches,
        isInjured: player.isInjured,
        name: player.name,
        position: player.position,
        shot_direction: player.shot_direction,
        weight_in_lbs: player.weight_in_lbs,
        years_in_pro: player.years_in_pro
      })
      .then( () => {
        console.log("dbPlayerCreate>player creation write complete",);
        //time to write the players stats record
        addDoc(collection(db,newPlayerRef.path+"/stats"),{
          DF: player.stats.DF,
          DI: player.stats.DI,
          DU: player.stats.DU,
          EN: player.stats.EN,
          EX: player.stats.EX,
          IT: player.stats.IT,
          LD: player.stats.LD,
          PA: player.stats.PA,
          PC: player.stats.PC,
          SC: player.stats.SC,
          SK: player.stats.SK,
          SP: player.stats.SP,
          ST: player.stats.ST,
          salary: player.stats.salary,
          assists: player.stats.assists,
          average_time_on_ice: player.stats.average_time_on_ice,
          game_tying_goals: player.stats.game_tying_goals,
          game_winning_goals: player.stats.game_winning_goals,
          games_played: player.stats.games_played,
          goals: player.stats.goals,
          hits: player.stats.hits,
          pims: player.stats.pims,
          plus_minus: player.stats.plus_minus,
          points: player.stats.points,
          powerplay_goals: player.stats.powerplay_goals,
          season: player.stats.season,
          shooting_percentage: player.stats.shooting_percentage,
          short_handed_goals: player.stats.short_handed_goals,
          shots: player.stats.shots,
          team: player.stats.team,
          team_id: player.stats.team_id
        })
        .then( () => {
          console.log("dbPlayerCreate>stats created/updated")
          console.log("dbPlayerCreate>player creation stat creation complete");
          //time to write to the teams contracts if applicable
          addDoc(collection(db,leagueInfo.path+"/teams/"+player.current_team+"/contracts"),{
            jersery_number:0,
            level:"Professional",
            player_id:newPlayerRef,
            player_name:player.name,
            position:player.position,
            salary:player.stats.salary,
            season:player.stats.season
          })
          .then(()=>{
            console.log("contracts record updated")
          })
        })
        .then( () => {
          return "dbPlayerCreate>success";
        });
      })
    }
    catch(e){
      console.error(e);
      return "dbPlayerCreate>fail";
    }
  }

  function buildPlayerObj(){
    let obj = {
      age: playerAge,
      career_earnings: 0,
      condition: 100,
      current_team: playerCurrentTeam,
      current_team_value: playerCurrentTeamName,
      draft: "0",
      drafted_at: 0,
      drafted_by: playerCurrentTeamName,
      drafted_by_id: playerCurrentTeam,
      drafted_detail: "",
      height_in_inches: playerHeight? playerHeight : 72,
      isInjured: false,
      name: playerName?playerName:"Player",
      position: playerPosition?playerPosition:"F",
      shot_direction: playerShotDir?playerShotDir:"R",
      weight_in_lbs: playerWeight? playerWeight : 200,
      years_in_pro: 0,
      stats:{
        season:leagueInfo.current_season,
        team:playerCurrentTeamName,
        team_id:playerCurrentTeam,
        games_played:0,
        goals:0,
        assists:0,
        points:0,
        plus_minus:0,
        pims:0,
        powerplay_goals:0,
        short_handed_goals:0,
        game_winning_goals:0,
        game_tying_goals:0,
        hits:0,
        shots:0,
        shooting_percentage:0,
        average_time_on_ice:0,
        IT:playerIT?playerIT:50,
        SP:playerSP?playerSP:50,
        ST:playerST?playerST:50,
        EN:playerEN?playerEN:50,
        DU:playerDU?playerDU:50,
        DI:playerDI?playerDI:50,
        SK:playerSK?playerSK:50,
        PA:playerPA?playerPA:50,
        PC:playerPC?playerPC:50,
        DF:playerDF?playerDF:50,
        SC:playerSC?playerSC:50,
        EX:playerEX?playerEX:50,
        LD:playerLD?playerLD:50,
        salary:playerSalary?playerSalary:750000
      }
    }
    return obj;
  }

  const clearPlayerForm = (e) => {
    e.preventDefault();
    
    let txtPlayerName = document.getElementById("player_name");
    txtPlayerName.value = "";
    setPlayerName("");

    let txtPlayerAge = document.getElementById("player_age");
    txtPlayerAge.value = "";
    setPlayerAge();

  }

  //user uploaded a file, for baseloading players for a league
  const onFileChange = (e) => {
    let file = e.target.files[0];
    if(file.type !== "text/csv"){
      alert("not a valid filetype");
      return;
    }
    console.log(file);
  }

  const onFileUpload = () => {
    alert("file uploaded");
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
      
      {/* Base load players */}
      <div className='shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center mt-2 pt-2'>
        <h1 className='text-center underline font-bold'>Baseload Players</h1>
        <p>Upload a .csv in a specific format, contact <a className='underline' href="mailto:wsbarth92@gmail.com">wsbarth92@gmail.com</a> for details</p>
        
        <div className='flex flex-col p-2 mt-2'>
          <input type="file" onChange={onFileChange} />
        </div>

        <div className='text-center border-t-2 mt-2'>
          <button className='w-full h-10 hover:bg-zinc-600 hover:text-white' onClick={onFileUpload}>Upload</button>
        </div>
        
      </div>

      {/* Create a player */}
      <div className='shadow-md bg-white sm:max-w-lg max-w-xs m-auto w-full text-center mt-2 pt-2'>
        <h1 className='text-center underline font-bold'>Create a Player</h1>
        <p>Create a new player, associate them to a Team's Contracts</p>

        <div>
          <form onSubmit={createPlayer}>

            <div className='border-t-2 mt-4'>
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

              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>Player Name:</h1>
              <input className='w-[150px] text-right'  type='text' id="player_name" onChange={(e) => setPlayerName(e.target.value)} placeholder="Player Name..." />
              </div>

              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>Age:</h1>
              <input className='w-[150px] text-right' type='text' id="player_age" onChange={(e) => setPlayerAge(e.target.value)} placeholder="Age..." />
              </div>

              <div className='flex justify-center'>
                <h1 className='w-[150px] text-left'>Current Team:</h1>
                <select className='w-[150px] text-right' id="createPlayerCurrentTeamSelect" onChange={(e) => {
                  var ele = document.getElementById("createPlayerCurrentTeamSelect");
                  var val = ele.options[ele.selectedIndex].text;
                  setPlayerCurrentTeam(e.target.value);
                  setPlayerCurrentTeamName(val);
                }}>
                  { playerTeams.map((team) => {
                      return(
                        <option value={team.id} key={team.id}>{team.value.name}</option>
                      )
                    })
                  }
                </select>
              </div>

              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>Height (inches):</h1>
              <input className='w-[150px] text-right' type='text' id="player_height" onChange={(e) => setPlayerHeight(e.target.value)} placeholder="Height (inches)..." />
              </div>

              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>Shot Direction:</h1>
              <input className='w-[150px] text-right' type='text' id="player_shot_dir" onChange={(e) => setPlayerShotDir(e.target.value)} placeholder="L or R..." />
              </div>

              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>Weight (lbs):</h1>
              <input className='w-[150px] text-right' type='text' id="player_weight" onChange={(e) => setPlayerWeight(e.target.value)} placeholder="Weight in lbs..." />
              </div>

              <div className='flex justify-center'>
                <h1 className='text-xl font-bold'>Stats</h1>
              </div>

              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>IT:</h1>
              <input className='w-[150px] text-right' type='text' id="player_it" onChange={(e) => setPlayerIT(e.target.value)} placeholder="IT / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>SP:</h1>
              <input className='w-[150px] text-right' type='text' id="player_sp" onChange={(e) => setPlayerSP(e.target.value)} placeholder="SP / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>ST:</h1>
              <input className='w-[150px] text-right' type='text' id="player_st" onChange={(e) => setPlayerST(e.target.value)} placeholder="ST / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>EN:</h1>
              <input className='w-[150px] text-right' type='text' id="player_en" onChange={(e) => setPlayerEN(e.target.value)} placeholder="EN / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>DU:</h1>
              <input className='w-[150px] text-right' type='text' id="player_du" onChange={(e) => setPlayerDU(e.target.value)} placeholder="DU / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>DI:</h1>
              <input className='w-[150px] text-right' type='text' id="player_di" onChange={(e) => setPlayerDI(e.target.value)} placeholder="DI / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>SK:</h1>
              <input className='w-[150px] text-right' type='text' id="player_sk" onChange={(e) => setPlayerSK(e.target.value)} placeholder="SK / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>PA:</h1>
              <input className='w-[150px] text-right' type='text' id="player_pa" onChange={(e) => setPlayerPA(e.target.value)} placeholder="PA / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>PC:</h1>
              <input className='w-[150px] text-right' type='text' id="player_pc" onChange={(e) => setPlayerPC(e.target.value)} placeholder="PC / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>DF:</h1>
              <input className='w-[150px] text-right' type='text' id="player_df" onChange={(e) => setPlayerDF(e.target.value)} placeholder="DF / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>SC:</h1>
              <input className='w-[150px] text-right' type='text' id="player_sc" onChange={(e) => setPlayerSC(e.target.value)} placeholder="SC / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>EX:</h1>
              <input className='w-[150px] text-right' type='text' id="player_ex" onChange={(e) => setPlayerEX(e.target.value)} placeholder="EX / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>LD:</h1>
              <input className='w-[150px] text-right' type='text' id="player_ld" onChange={(e) => setPlayerLD(e.target.value)} placeholder="LD / 99" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>Salary:</h1>
              <input className='w-[150px] text-right' type='text' id="player_salary" onChange={(e) => setPlayerSalary(e.target.value)} placeholder="no , just nums" />
              </div>
              <div className='flex justify-center'>
              <h1 className='w-[150px] text-left'>Position:</h1>
              <input className='w-[150px] text-right' type='text' id="player_position" onChange={(e) => setPlayerPosition(e.target.value)} placeholder="F,D,G" />
              </div>
              {/* TODO: add in the stats here to create the player with a baseload of stats */}


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
