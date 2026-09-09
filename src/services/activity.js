import {addDoc,collection,serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase/config';
export async function logAdminActivity({action,collectionName,documentId,summary=''}){if(!db)return;await addDoc(collection(db,'adminActivity'),{action,collection:collectionName,documentId:documentId||null,summary,createdAt:serverTimestamp()})}
