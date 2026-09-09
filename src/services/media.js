import {addDoc,collection,serverTimestamp} from 'firebase/firestore';
import {db,auth} from '../firebase/config';
const MAX=10*1024*1024;
const allowed=new Set(['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','application/pdf']);
export async function uploadMedia(file,{folder='general',alt=''}={}){
 if(!file)throw new Error('Select a file');
 if(file.size>MAX)throw new Error('Maximum file size is 10MB');
 if(!allowed.has(file.type))throw new Error('Unsupported file type');
 if(!auth?.currentUser)throw new Error('Admin session expired. Sign in again.');
 const token=await auth.currentUser.getIdToken();
 const base64=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=reject;r.readAsDataURL(file)});
 const response=await fetch('/.netlify/functions/upload-media',{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${token}`},body:JSON.stringify({fileName:file.name,contentType:file.type,base64,folder})});
 const data=await response.json();if(!response.ok)throw new Error(data.error||'Upload failed');if(!db)throw new Error('Firebase is not configured');
 const ref=await addDoc(collection(db,'media'),{name:file.name,key:data.key,url:data.url||'',size:data.size,contentType:data.contentType,folder,alt,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});return{id:ref.id,...data,name:file.name,folder,alt};
}
