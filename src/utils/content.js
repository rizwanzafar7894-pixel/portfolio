export function slugify(value=''){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}
export function plainText(html=''){const el=document.createElement('div');el.innerHTML=html;return el.textContent||el.innerText||''}
export function readingMeta(html=''){const words=plainText(html).trim().split(/\s+/).filter(Boolean);return {wordCount:words.length,readingTime:Math.max(1,Math.ceil(words.length/200))}}
export function parseList(value){return Array.isArray(value)?value:String(value||'').split(',').map(v=>v.trim()).filter(Boolean)}
