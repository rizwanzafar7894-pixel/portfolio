import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

function ready(){ if(!db) throw new Error('Firebase is not configured'); }

export async function getPublished(name){
  ready();
  try {
    const q=query(collection(db,name),where('published','==',true),orderBy('updatedAt','desc'));
    const s=await getDocs(q);
    return s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>!x.publishAt || new Date(x.publishAt)<=new Date());
  } catch (error) {
    // Missing composite indexes should not break the public site during setup.
    if(error?.code==='failed-precondition') {
      const s=await getDocs(query(collection(db,name),where('published','==',true)));
      return s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>!x.publishAt || new Date(x.publishAt)<=new Date());
    }
    throw error;
  }
}

export async function getPublishedBySlug(name,slug){
  ready();
  const q=query(collection(db,name),where('published','==',true),where('slug','==',slug));
  const s=await getDocs(q);
  return s.empty?null:{id:s.docs[0].id,...s.docs[0].data()};
}

export async function getDocument(name,id){ ready(); const s=await getDoc(doc(db,name,id)); return s.exists()?{id:s.id,...s.data()}:null; }

export async function submitDocument(name,data){
  ready();
  return addDoc(collection(db,name),{...data,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
}
