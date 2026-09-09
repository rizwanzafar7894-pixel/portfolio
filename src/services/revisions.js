import {addDoc,collection,getDocs,query,orderBy,serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase/config';
export async function createRevision(collectionName,documentId,data){
 if(!db) throw new Error('Firebase is not configured');
 const ref=collection(db,collectionName,documentId,'revisions');
 await addDoc(ref,{snapshot:{...data},createdAt:serverTimestamp()});
}
export async function listRevisions(collectionName,documentId){
 if(!db) throw new Error('Firebase is not configured');
 const q=query(collection(db,collectionName,documentId,'revisions'),orderBy('createdAt','desc'));
 const s=await getDocs(q);return s.docs.map(d=>({id:d.id,...d.data()}));
}
