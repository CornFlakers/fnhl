import { createContext, useContext, useEffect, useState } from "react";
import 
{
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged
} from 'firebase/auth'
import {auth, db} from '../firebase'
import { doc, setDoc } from "firebase/firestore";

export const UserContext = createContext()

//exports
//AuthContextProvider
export const AuthContextProvider = ({children}) => {

    const[user, setUser] = useState({})

    //createUser
    const createUser = (email, password) => {
        const createResult = createUserWithEmailAndPassword(auth, email, password)
        .then((data) => {
            console.log("data[uid]");
            console.log(data.user["uid"]);

            //create user record
            setDoc(doc(db,"users",data.user["uid"]),{
                email: email,
                isGM: false,
                isLeagueOfficial: false,
                commissioner_for_league: '',
                name: ''
            });
        })
        console.log(createResult);
        return createResult;
    };

    //signin
    const signIn = async (email, password) => {
        try{
            return signInWithEmailAndPassword(auth, email, password)
        }catch(e){
            console.error(e);
            //TODO better error handling
        }
    }

    //signout/logout
    const logout = () => {
        return signOut(auth)
    }

    //useEffect
    useEffect(() => {
        //unsubscribe
        const unsubscribe = onAuthStateChanged(auth,(currentUser) => {
            //console.log(currentUser)
            setUser(currentUser)
        })
        return () => {
            unsubscribe()
        }
    },[])

    return(
        <UserContext.Provider value={{createUser, user, logout, signIn}}>
            {children}
        </UserContext.Provider>
    )
}

//UserAuth
export const UserAuth = () => {
    return useContext(UserContext)
}