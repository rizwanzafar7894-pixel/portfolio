import {useEffect,useState} from 'react';
import {useParams,Link} from 'react-router-dom';
import {projects as fallback} from '../data/defaults';
import {getPublishedBySlug} from '../services/firestore';
export default function ProjectDetails(){
 const {slug}=useParams(); const [p,setP]=useState(fallback.find(x=>x.id===slug)||null); const [loading,setLoading]=useState(!p);
 useEffect(()=>{getPublishedBySlug('projects',slug).then(x=>{if(x)setP(x)}).catch(()=>{}).finally(()=>setLoading(false))},[slug]);
 if(loading)return <main className="notfound"><h1>Loading project…</h1></main>;
 if(!p)return <div className="notfound"><h1>Project not found</h1><Link to="/">Back home</Link></div>;
 const image=p.imageUrl||p.img; const gallery=p.gallery||[]; const tags=p.tags||[];
 return <main className="detail"><Link to="/">← Back</Link><img src={image} alt={p.title}/><div className="detail-copy"><small>{p.category||p.cat}</small><h1>{p.title}</h1><p>{p.description||p.desc}</p>{p.shortDescription&&<p>{p.shortDescription}</p>}<div className="chips">{tags.map(x=><span key={x}>{x}</span>)}</div>{p.result&&<p><b>Result:</b> {p.result}</p>}{p.liveUrl&&<a href={p.liveUrl} target="_blank" rel="noreferrer">Live project ↗</a>}{gallery.length>0&&<div className="detail-gallery">{gallery.map((url,i)=><img key={url+i} src={url} alt={`${p.title} ${i+1}`} loading="lazy"/>)}</div>}</div></main>
}
