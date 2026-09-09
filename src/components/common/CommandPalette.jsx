import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight,Command,Search} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const ACTIONS=[
  {label:'Go to About',keywords:'about profile story',href:'#about'},
  {label:'Go to Services',keywords:'services expertise',href:'#services'},
  {label:'View Projects',keywords:'projects work portfolio',href:'/projects'},
  {label:'Read Blog',keywords:'blog articles writing',href:'/blog'},
  {label:'View Pricing',keywords:'pricing plans budget',href:'#pricing'},
  {label:'Open FAQ',keywords:'faq questions answers',href:'#faq'},
  {label:'Start a Project',keywords:'contact hire quote project',href:'#contact'}
];

export default function CommandPalette(){
  const [open,setOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [active,setActive]=useState(0);
  const inputRef=useRef(null);
  const navigate=useNavigate();
  const filtered=useMemo(()=>ACTIONS.filter(a=>`${a.label} ${a.keywords}`.toLowerCase().includes(query.toLowerCase())).slice(0,7),[query]);

  useEffect(()=>{
    const onKeyDown=e=>{
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setOpen(v=>!v);return}
      if(!open)return;
      if(e.key==='Escape'){setOpen(false);return}
      if(e.key==='ArrowDown'){e.preventDefault();setActive(i=>Math.min(i+1,Math.max(filtered.length-1,0)))}
      if(e.key==='ArrowUp'){e.preventDefault();setActive(i=>Math.max(i-1,0))}
      if(e.key==='Enter'&&filtered[active]){e.preventDefault();run(filtered[active])}
    };
    window.addEventListener('keydown',onKeyDown);
    return()=>window.removeEventListener('keydown',onKeyDown);
  },[open,active,filtered]);

  useEffect(()=>{if(open){setQuery('');setActive(0);requestAnimationFrame(()=>inputRef.current?.focus())}},[open]);

  const run=action=>{
    setOpen(false);
    if(action.href.startsWith('/')) navigate(action.href);
    else if(location.pathname!=='/') navigate(`/${action.href}`); else document.querySelector(action.href)?.scrollIntoView({behavior:'smooth',block:'start'});
  };

  return <>
    <button className="command-trigger" onClick={()=>setOpen(true)} aria-label="Open command palette"><Command size={14}/><span>Search</span><kbd>⌘K</kbd></button>
    {open&&<div className="command-backdrop" onMouseDown={()=>setOpen(false)}>
      <div className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={e=>e.stopPropagation()}>
        <div className="command-search"><Search size={17}/><input ref={inputRef} value={query} onChange={e=>{setQuery(e.target.value);setActive(0)}} placeholder="Search pages and actions…"/><kbd>ESC</kbd></div>
        <div className="command-list">
          {filtered.length?filtered.map((action,index)=><button key={action.label} className={index===active?'active':''} onMouseEnter={()=>setActive(index)} onClick={()=>run(action)}><span>{action.label}</span><ArrowRight size={15}/></button>):<div className="command-empty">No matching action</div>}
        </div>
        <div className="command-footer"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div>
      </div>
    </div>}
  </>;
}
