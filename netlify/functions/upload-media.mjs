import {S3Client,PutObjectCommand} from '@aws-sdk/client-s3';
import {getAuth} from 'firebase-admin/auth';
import {initializeApp,getApps,cert} from 'firebase-admin/app';
const allowed=new Set(['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','application/pdf']);
const maxBytes=10*1024*1024;
function json(body,status=200){return{status,headers:{'content-type':'application/json','cache-control':'no-store'},body:JSON.stringify(body)}}
function firebaseAdmin(){if(!getApps().length){const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;if(!raw)throw new Error('Firebase server credentials are not configured');initializeApp({credential:cert(JSON.parse(raw))})}return getAuth()}
export default async request=>{
 if(request.method!=='POST')return json({error:'Method not allowed'},405);
 try{
  const auth=request.headers.get('authorization')||'';if(!auth.startsWith('Bearer '))return json({error:'Authentication required'},401);
  const decoded=await firebaseAdmin().verifyIdToken(auth.slice(7));if(decoded.admin!==true)return json({error:'Admin permission required'},403);
  if(!process.env.B2_ENDPOINT||!process.env.B2_REGION||!process.env.B2_KEY_ID||!process.env.B2_APPLICATION_KEY||!process.env.B2_BUCKET)return json({error:'Storage is not configured'},503);
  if(!(request.headers.get('content-type')||'').includes('application/json'))return json({error:'Expected JSON'},415);
  const {fileName,contentType:mime,base64,folder='general'}=await request.json();if(!fileName||!mime||!base64)return json({error:'fileName, contentType and base64 are required'},400);if(!allowed.has(mime))return json({error:'Unsupported file type'},415);
  const buffer=Buffer.from(base64,'base64');if(buffer.length>maxBytes)return json({error:'File exceeds 10MB limit'},413);
  const safeFolder=String(folder).toLowerCase().replace(/[^a-z0-9/_-]+/g,'-').replace(/^\/+|\/+$/g,'')||'general';const safe=fileName.toLowerCase().replace(/[^a-z0-9._-]+/g,'-');const key=`media/${safeFolder}/${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}-${safe}`;
  const client=new S3Client({endpoint:process.env.B2_ENDPOINT,region:process.env.B2_REGION,credentials:{accessKeyId:process.env.B2_KEY_ID,secretAccessKey:process.env.B2_APPLICATION_KEY}});await client.send(new PutObjectCommand({Bucket:process.env.B2_BUCKET,Key:key,Body:buffer,ContentType:mime,CacheControl:'public, max-age=31536000, immutable'}));
  const base=(process.env.B2_PUBLIC_BASE_URL||'').replace(/\/$/,'');return json({key,url:base?`${base}/${key}`:null,size:buffer.length,contentType:mime});
 }catch(e){console.error(e);return json({error:e?.message||'Upload failed'},500)}
}
