import {useEffect,useRef} from 'react';
import {Bold,Italic,Underline,Heading1,Heading2,List,Quote,Code2,Link,Image as ImageIcon,Minus,Undo2,Redo2} from 'lucide-react';

const actions=[
 ['bold','Bold',Bold],['italic','Italic',Italic],['underline','Underline',Underline],['formatBlock','H1',Heading1,'<h1>'],['formatBlock','H2',Heading2,'<h2>'],['insertUnorderedList','List',List],['formatBlock','Quote',Quote,'<blockquote>'],['formatBlock','Code',Code2,'<pre>'],['createLink','Link',Link],['insertImage','Image',ImageIcon],['insertHorizontalRule','Divider',Minus],['undo','Undo',Undo2],['redo','Redo',Redo2]
];
export default function RichTextEditor({value,onChange,placeholder='Start writing…'}){
 const ref=useRef(null);
 useEffect(()=>{if(ref.current && ref.current.innerHTML!==value) ref.current.innerHTML=value||''},[value]);
 const run=(cmd,arg)=>{ref.current?.focus();if(cmd==='createLink'){const url=window.prompt('URL');if(url)document.execCommand(cmd,false,url)}else if(cmd==='insertImage'){const url=window.prompt('Image URL');if(url)document.execCommand(cmd,false,url)}else document.execCommand(cmd,false,arg);onChange(ref.current?.innerHTML||'')};
 return <div className="rich-editor"><div className="rich-toolbar">{actions.map(([cmd,label,Icon,arg])=><button key={label} type="button" title={label} onMouseDown={e=>e.preventDefault()} onClick={()=>run(cmd,arg)}><Icon size={16}/><span>{label}</span></button>)}</div><div ref={ref} className="rich-canvas" contentEditable suppressContentEditableWarning data-placeholder={placeholder} onInput={e=>onChange(e.currentTarget.innerHTML)} onBlur={e=>onChange(e.currentTarget.innerHTML)} /> </div>
}
