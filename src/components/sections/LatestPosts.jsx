import {useEffect,useMemo,useState} from 'react';
import {ArrowUpRight,Clock3} from 'lucide-react';
import {Link} from 'react-router-dom';
import {getPublished} from '../../services/firestore';
import Reveal from '../common/Reveal';

function readingTime(post){
  const text=(post?.contentHtml||post?.content||'').replace(/<[^>]+>/g,' ');
  return Math.max(1,Math.ceil(text.trim().split(/\s+/).filter(Boolean).length/200));
}

export default function LatestPosts(){
  const [posts,setPosts]=useState([]);
  useEffect(()=>{let active=true;getPublished('posts').then(rows=>{if(active)setPosts(rows.slice(0,3))}).catch(()=>{});return()=>{active=false}},[]);
  const items=useMemo(()=>posts,[posts]);
  return <section id="blog" className="section latest-posts"><Reveal><div className="section-kicker">05 — Journal</div><div className="section-head"><div><h2>Ideas, insights &<br/><span>things I’m building.</span></h2><p>Practical notes on design, development, product thinking and lessons from real projects.</p></div><Link className="text-link" to="/blog">View all posts <ArrowUpRight size={15}/></Link></div><div className="blog-grid">{items.map(post=><Link className="blog-card" to={`/blog/${post.slug}`} key={post.id}><div className="blog-media">{(post.featuredImageUrl||post.featuredImage||post.imageUrl)&&<img src={post.featuredImageUrl||post.featuredImage||post.imageUrl} alt="" loading="lazy"/>}</div><div className="blog-card-body"><div className="blog-meta"><span>{post.category||'Article'}</span><span><Clock3 size={13}/> {readingTime(post)} min read</span></div><h3>{post.title}</h3>{post.excerpt&&<p>{post.excerpt}</p>}<span className="blog-read">Read article <ArrowUpRight size={15}/></span></div></Link>)}</div>{!items.length&&<div className="empty-public"><p>New articles are coming soon.</p><Link className="btn secondary" to="/blog">Open journal</Link></div>}</Reveal></section>
}
