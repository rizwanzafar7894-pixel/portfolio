import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {getPublished} from '../services/firestore';
export default function Blog(){const [posts,setPosts]=useState([]);useEffect(()=>{getPublished('posts').then(setPosts).catch(()=>{})},[]);return <main className="detail"><Link to="/">← Back</Link><small>Journal</small><h1>Latest posts</h1><div className="project-grid">{posts.map(p=><Link className="project-card" to={`/blog/${p.slug}`} key={p.id}>{p.featuredImageUrl&&<img src={p.featuredImageUrl} alt=""/>}<div className="project-overlay"><div><small>{p.category||'Article'}</small><h3>{p.title}</h3></div></div></Link>)}</div>{!posts.length&&<p>No published posts yet.</p>}</main>}
