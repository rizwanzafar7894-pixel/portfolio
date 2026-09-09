import {useEffect,useState} from 'react';
import {ArrowUpRight,Sparkles,Zap,Palette,Code2,Rocket} from 'lucide-react';
import Reveal from './Reveal';
import {getPublished} from '../../services/firestore';
import {tools as fallbackTools} from '../../data/defaults';

const STEPS=[
 {id:'01',title:'Discover',text:'Clarify the audience, business goal and the smallest useful outcome before design starts.',icon:Sparkles},
 {id:'02',title:'Design',text:'Turn the direction into a clear visual system, responsive flows and interaction details.',icon:Palette},
 {id:'03',title:'Build',text:'Translate the approved experience into fast, accessible, production-ready interfaces.',icon:Code2},
 {id:'04',title:'Launch',text:'Polish, test and ship with a practical handoff that keeps the product easy to evolve.',icon:Rocket}
];

export default function PremiumExperience(){
 const [tools,setTools]=useState(fallbackTools);
 const [active,setActive]=useState(0);
 useEffect(()=>{getPublished('tools').then(rows=>{if(rows.length)setTools(rows.map(x=>x.name||x.title).filter(Boolean))}).catch(()=>{});},[]);
 useEffect(()=>{
  const onMove=e=>{document.documentElement.style.setProperty('--mx',`${e.clientX}px`);document.documentElement.style.setProperty('--my',`${e.clientY}px`)};
  window.addEventListener('pointermove',onMove,{passive:true});
  const buttons=[...document.querySelectorAll('.magnetic')];
  const clean=[];
  buttons.forEach(el=>{const move=e=>{if(matchMedia('(pointer:fine)').matches){const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.08}px,${(e.clientY-(r.top+r.height/2))*.08}px)`}};const leave=()=>{el.style.transform=''};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);clean.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave)})});
  return()=>{window.removeEventListener('pointermove',onMove);clean.forEach(fn=>fn())};
 },[]);
 return <>
  <section id="process" className="section premium-process"><Reveal>
   <div className="section-kicker">05 — How I work</div>
   <div className="section-head"><div><h2>A process built for<br/><span>momentum.</span></h2><p className="section-subtitle">A simple path from first conversation to a polished launch.</p></div><a className="btn secondary magnetic" href="#contact">Start a project <ArrowUpRight size={16}/></a></div>
   <div className="process-timeline">{STEPS.map((step,i)=>{const Icon=step.icon;return <button key={step.id} className={`process-step ${i===active?'active':''}`} onClick={()=>setActive(i)}><span className="process-index">{step.id}</span><span className="process-icon"><Icon size={18}/></span><span className="process-copy"><b>{step.title}</b><small>{step.text}</small></span></button>})}</div>
   <div className="process-detail"><span>Currently exploring</span><strong>{STEPS[active].title}</strong><p>{STEPS[active].text}</p><div className="process-line"><i style={{width:`${((active+1)/STEPS.length)*100}%`}}/></div></div>
  </Reveal></section>
  <section className="section tech-marquee-section"><Reveal>
   <div className="section-kicker">Tools I use</div>
   <div className="tech-marquee" aria-label="Technology and design tools"><div className="tech-track">{[...tools,...tools].map((tool,i)=><span key={`${tool}-${i}`}><Zap size={13}/>{tool}</span>)}</div></div>
  </Reveal></section>
  <div className="cursor-glow" aria-hidden="true"/>
 </>;
}
