import {ArrowDown,ArrowUpRight,Sparkles} from 'lucide-react';
import {useEffect,useMemo,useState} from 'react';
import {getDocument} from '../../services/firestore';

const FALLBACK_PROFILE='/profile-placeholder.svg';
const TYPEWRITER_WORDS=['digital products','mobile apps','brand identities','user experiences'];

export default function Hero(){
  const [wordIndex,setWordIndex]=useState(0);
  const [typedWord,setTypedWord]=useState('');
  const [deleting,setDeleting]=useState(false);
  const [profile,setProfile]=useState(FALLBACK_PROFILE);
  const [settings,setSettings]=useState({});

  useEffect(()=>{
    const currentWord=TYPEWRITER_WORDS[wordIndex];

    if(deleting&&typedWord.length===0){
      const pause=setTimeout(()=>{
        setDeleting(false);
        setWordIndex(index=>(index+1)%TYPEWRITER_WORDS.length);
      },220);
      return()=>clearTimeout(pause);
    }

    const finishedTyping=!deleting&&typedWord===currentWord;
    const delay=finishedTyping?1250:deleting?42:82;

    const timer=setTimeout(()=>{
      if(finishedTyping){
        setDeleting(true);
        return;
      }

      if(deleting){
        setTypedWord(currentWord.slice(0,Math.max(0,typedWord.length-1)));
      }else{
        setTypedWord(currentWord.slice(0,typedWord.length+1));
      }
    },delay);

    return()=>clearTimeout(timer);
  },[deleting,typedWord,wordIndex]);

  useEffect(()=>{
    getDocument('siteSettings','public').then(data=>{
      if(data){
        setSettings(data);
        if(data.profileImageUrl)setProfile(data.profileImageUrl);
      }
    }).catch(()=>{});
  },[]);

  const profileName=useMemo(()=>{
    const savedName=(settings.profileName||'').trim();
    if(!savedName||/^nancy(?:\s|$)/i.test(savedName))return 'Muhammad Rizwan';
    return savedName;
  },[settings.profileName]);

  return <section id="top" className="hero section">
    <div className="hero-orb orb-a"/>
    <div className="hero-orb orb-b"/>
    <div className="hero-layout">
      <div className="hero-copy-column">
        <div className="eyebrow"><Sparkles size={14}/> Independent designer & developer</div>
        <h1>I build <em className="typewriter-word" aria-live="polite">{typedWord}<span className="typewriter-caret" aria-hidden="true"/></em><br/>that move businesses forward.</h1>
        <p className="hero-copy">{settings.heroLead||'Strategy, design and development in one focused workflow — from the first idea to a polished product people love to use.'}</p>
        <div className="hero-actions"><a className="btn primary" href="#work">Explore my work <ArrowUpRight size={17}/></a><a className="text-link" href="#contact">Start a project <ArrowDown size={16}/></a></div>
        <div className="hero-meta"><span><b>{settings.experience||'7+'}</b> years experience</span><span><b>{settings.projectsCount||'60+'}</b> projects shipped</span><span><b>{settings.countries||'14'}</b> countries reached</span></div>
      </div>
      <div className="hero-profile">
        <div className="profile-frame"><img src={profile} alt={profileName} onError={e=>{e.currentTarget.src=FALLBACK_PROFILE}}/><span className="profile-status" aria-label="Available for work"/></div>
        <strong>{profileName}</strong>
        <small>{settings.profileRole||'UI/UX Designer & Developer'}</small>
      </div>
    </div>
  </section>;
}
