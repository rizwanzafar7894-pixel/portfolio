import {collection,doc,getDocs,getDoc,setDoc,deleteDoc,serverTimestamp,query,orderBy,limit,where} from 'firebase/firestore';
import {db} from '../firebase/config';
import {logAdminActivity} from './activity';
function ready(){if(!db)throw new Error('Firebase is not configured');}
export async function listAdmin(collectionName){ready();try{const q=query(collection(db,collectionName),orderBy('updatedAt','desc'));const s=await getDocs(q);return s.docs.map(d=>({id:d.id,...d.data()}))}catch(e){if(e?.code==='failed-precondition'||e?.code==='invalid-argument'){const s=await getDocs(collection(db,collectionName));return s.docs.map(d=>({id:d.id,...d.data()}))}throw e}}
export async function getAdmin(collectionName,id){ready();const s=await getDoc(doc(db,collectionName,id));return s.exists()?{id:s.id,...s.data()}:null}
export async function saveAdmin(collectionName,data,id){ready();const ref=id?doc(db,collectionName,id):doc(collection(db,collectionName));const payload={...data,updatedAt:serverTimestamp(),...(id?{}:{createdAt:serverTimestamp()})};delete payload.id;await setDoc(ref,payload,{merge:true});await logAdminActivity({action:id?'update':'create',collectionName,documentId:ref.id,summary:data.title||data.name||''});return ref.id}
export async function removeAdmin(collectionName,id){ready();await deleteDoc(doc(db,collectionName,id));await logAdminActivity({action:'delete',collectionName,documentId:id});}
export async function duplicateAdmin(collectionName,data){const copy={...data};delete copy.id;delete copy.createdAt;delete copy.updatedAt;copy.title=`${copy.title||'Untitled'} Copy`;copy.slug=`${copy.slug||'untitled'}-copy-${Date.now()}`;return saveAdmin(collectionName,copy)}
export async function listActivity(max=50){ready();const q=query(collection(db,'adminActivity'),orderBy('createdAt','desc'),limit(max));const s=await getDocs(q);return s.docs.map(d=>({id:d.id,...d.data()}))}
export async function countCollection(collectionName){ready();const s=await getDocs(collection(db,collectionName));return s.size}
export async function listScheduled(collectionName){ready();const now=new Date();const items=await listAdmin(collectionName);return items.filter(x=>x.publishAt && new Date(x.publishAt)<=now && x.published===false)}
