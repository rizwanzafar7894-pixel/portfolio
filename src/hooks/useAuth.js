import {useEffect,useState} from 'react';
import {onAuthStateChanged,signOut} from 'firebase/auth';
import {auth} from '../firebase/config';
export default function useAuth(){
  const [state,setState]=useState({user:null,loading:true,isAdmin:false});
  useEffect(()=>{if(!auth){setState({user:null,loading:false,isAdmin:false});return;}return onAuthStateChanged(auth,async user=>{
    if(!user){setState({user:null,loading:false,isAdmin:false});return;}
    try{const token=await user.getIdTokenResult();setState({user,loading:false,isAdmin:token.claims.admin===true});}
    catch{setState({user,loading:false,isAdmin:false});}
  });},[]);
  return {...state,logout:()=>auth&&signOut(auth)};
}
