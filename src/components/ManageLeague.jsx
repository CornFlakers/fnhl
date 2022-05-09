import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import Select from 'react-select';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}



const ManageLeague = () => {

  const [leagueInfo, setleagueInfo] = useState({});
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableGMs, setAvailableGMs] = useState([]);
  
  const [lstUsers, setListUsers] = useState();//users
  const [lstGMs, setListGMs] = useState();
  const [lstTeams, setListTeams] = useState();

  const [gmOptions, setGMOptions] = useState();//options to select gms and assign them to a team
  const [teamOptions, setTeamOptions] = useState();//team options to select and pair with a selected gm

  const [gmValue, setGMValue] = useState("");//the selected gm value
  const [teamValue, setTeamValue] = useState("");//the selected team value

  //functions
  function prepareGMOptions(i){
    console.log("prepGMOptions",i);

    const options = [];

    //end goal
    // const options = [
    //   { value: 'chocolate', label: 'Chocolate' },
    //   { value: 'strawberry', label: 'Strawberry' },
    //   { value: 'vanilla', label: 'Vanilla' }
    // ]

    i.forEach((data) => {
      console.log("foreach data",data);
      data.name ? options.push({value:data.id, label:data.name}) : console.log("err");
    })

    // const options = [
    //   { value:x, label: y}
    // ]
  }

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
    const usersSnapshot = getDocs(collection(db,"users"))
    .then((data) => {
      if(mounted){
        let i = [];

        data.forEach((doc) => {
          console.log("doc.data()",doc.data(),"doc",doc);
          i.push({
            id: doc.id,
            data: doc.data()
          });
        })

        console.log("i",i);
        setAvailableUsers(i);
      }
    })

    //gmQ, gmSnapshot: query the db for a list of GMs, users who are assigned to a team in the league
    const gmQ = query(collection(db, "users"), where("isGM", "==", true));
    const gmSnapshot = getDocs(gmQ)
    .then((data) => {
      if(mounted){
        let i = [];

        console.log(data);

        data.forEach((doc) => {
          console.log("doc.data()",doc.data());
          i.push(doc.data());
        })

        console.log("i",i);
        setAvailableGMs(i);
        prepareGMOptions(i);
      }
    })
    
    //return statement called on unmount of component
    return () => {
      mounted = false;
    }    
  },[])

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
    if(Object.keys("availableUsers").length == 0){
      console.log("availableUsers not set");
    }
    else{
      console.log("availableUsers",availableUsers);
      setListUsers(availableUsers.map((d) =><h1 key={d.id? d.id : "no user id found"}>{d.data.name? d.data.name : d.data.email}</h1>));
      setUserSelectOptions(availableUsers);
    }

    if(Object.keys("availableGMs").length == 0){
      console.log("availableGMs not set");
    }
    else{
      console.log("availableGMs",availableGMs);
      setListGMs(availableGMs.map((d) =><h1 key={d.name? d.name : d.email}>{d.name? d.name : d.email}</h1>));
    }

  }, [availableUsers, availableGMs])

  useEffect( () => {
    //lstUsers
    if(Object.keys("lstUsers").length == 0){
      console.log("lstUsers not set");
    }
    else{
      console.log("lstUsers",lstUsers);
    }

    //lstGMs
    if(Object.keys("lstGMs").length == 0){
      console.log("lstGMs not set");
    }
    else{
      console.log("lstGMs",lstGMs);
    }

    //lstTeams
    if(Object.keys("lstTeams").length == 0){
      console.log("lstTeams not set");
    }
    else{
      console.log("lstTeams",lstTeams);
    }
    

  }, [lstUsers, lstGMs, lstTeams])

  //functions
  const updateGMCollection = (e) => {
    e.preventDefault();

      let data = {
        name: 'productName',
        size: 'medium',
        userRef: db.doc('users/' + auth().currentUser.uid)
      };

      console.log("leagueInfo i.id",leagueInfo);

      db.collection('leagues//gms').add(data);

      console.log("submit profile form");
      
        try{
            //call db to update user
            //const userRef = doc(db, "users", userid)
            
            // const updateUserDoc = updateDoc(userRef, {
            //     name: newName
            // }).then((data) => {
            //     console.log("document added",data);
            //     window.location.reload(false)
            // }).catch((e) => {
            //     console.error(e.message);
            // })

        }catch(e){
            console.error("error",e.message);
        }
  }

  return (
    <div className='mt-2'>
      <div className='text-center border-b-2'>
        <h1 className='text-xl'>
          <b>{leagueInfo?.name} - Season:</b> {leagueInfo?.current_season} <b>Salary Cap:</b> {leagueInfo?.salary_cap}
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
      <div className='flex flex-wrap'>
        <div className='w-64 m-auto text-center shadow-sm mt-2 mb-0'>
          <h1 className='w-64 m-auto'>List of available Users</h1>
          <div className='w-64 m-auto text-left'>
            <Select options={gmOptions} />
          </div>  
        </div>

        <div className='w-64 m-auto text-center shadow-sm mt-2 mb-0'>
          <h1 className='w-64 m-auto'>List of Teams</h1>
            <div className='w-64 m-auto text-left'>
              <h1>team</h1>
            </div>
        </div>
      </div>

      <div className='w-64 m-auto text-center shadow-sm mt-2 mb-0'>
          <h1 className='w-64 m-auto'>List of GMs</h1>
          <div className='w-64 m-auto text-left'>
            {lstGMs}
          </div>
        </div>
      

      <form onSubmit={updateGMCollection}>

      </form>
    </div>
  )
}

export default ManageLeague