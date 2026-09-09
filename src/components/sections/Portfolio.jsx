import {useEffect,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {projects as fallback} from '../../data/defaults';
import {getPublished} from '../../services/firestore';
import Reveal from '../common/Reveal';
import ProjectModal from '../portfolio/ProjectModal';

export default function Portfolio(){
 const [filter,setFilter]=useState('all'); const [selected,setSelected]=useState(null); const [projects,setProjects]=useState(fallback);
 useEffect(()=>{let live=true;getPublished('projects').then(rows=>{if(live&&rows.length)setProjects(rows)}).catch(()=>{});return()=>{live=false}},[]);
 const list=filter==='all'?projects:projects.filter(p=>(p.category||p.cat)===filter);
 return <section id="work" className="section portfolio"><Reveal><div className="section-kicker">04 — Selected work</div><div className="section-head"><h2>Work that does<br/><span>the talking.</span></h2><div className="filters">{[['all','All'],['app','App'],['web','Web'],['brand','Branding']].map(([k,v])=><button className={filter===k?'active':''} onClick={()=>setFilter(k)} key={k}>{v}</button>)}</div></div><div className="project-grid">{list.map((p,i)=><article className={'project-card '+(i===0?'featured':'')} key={p.id||p.slug||p.title} onClick={()=>setSelected(p)}><img src={p.imageUrl||p.img} alt={p.title||''} loading="lazy"/><div className="project-overlay"><div><small>{p.category||p.cat}</small><h3>{p.title}</h3></div><span><ArrowUpRight/></span></div></article>)}</div></Reveal><ProjectModal project={selected} onClose={()=>setSelected(null)}/></section>
}
