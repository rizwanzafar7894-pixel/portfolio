import {useEffect,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {getPublishedBySlug} from '../services/firestore';
export default function PostDetails(){
 const {slug}=useParams(); const [post,setPost]=useState(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{getPublishedBySlug('posts',slug).then(setPost).catch(()=>{}).finally(()=>setLoading(false))},[slug]);
 if(loading)return <main className="notfound"><h1>Loading…</h1></main>;
 if(!post)return <main className="notfound"><h1>Post not found</h1><Link to="/">Back home</Link></main>;
 return <article className="detail post-detail"><Link to="/">← Back</Link>{post.featuredImageUrl&&<img src={post.featuredImageUrl} alt={post.title}/>}<small>{post.category||'Article'}</small><h1>{post.title}</h1>{post.excerpt&&<p className="lead">{post.excerpt}</p>}<div className="post-content" dangerouslySetInnerHTML={{__html:post.contentHtml||post.content||''}}/></article>
}
