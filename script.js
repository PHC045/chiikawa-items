
let PRODUCTS=[];
async function load(){
  try{
    const r=await fetch('products.json'); const j=await r.json();
    PRODUCTS=j.products||[];
  }catch(e){ PRODUCTS=[]; }
  initFilters(PRODUCTS); render();
}
function initFilters(items){
  const cats = Array.from(new Set(items.map(i=>i.category||'未分類'))).sort();
  const sel = document.getElementById('category');
  if (sel) sel.innerHTML = '<option value="">全部</option>' + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
}
function render(){
  const grid=document.getElementById('grid'); if(!grid) return;
  const q=(document.getElementById('q')?.value||'').toLowerCase();
  const cat=document.getElementById('category')?.value||'';
  const sort=document.getElementById('sort')?.value||'created_desc';
  let list=PRODUCTS.slice();
  if(q) list=list.filter(p=>[p.name,p.note,(p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q));
  if(cat) list=list.filter(p=>(p.category||'未分類')===cat);
  list.sort((a,b)=>{
    if (sort==='name_asc') return (a.name||'').localeCompare(b.name||'');
    return 0;
  });
  grid.innerHTML='';
  const tpl=document.getElementById('cardTpl');
  list.forEach(p=>{
    const n=tpl.content.cloneNode(true);
    const img=n.querySelector('.card-img');
    img.src=p.image||''; img.alt=p.name||'商品';
    n.querySelector('.card-title').textContent=p.name||'名稱待補';
    n.querySelector('.card-note').textContent=p.note||'';
    n.querySelector('.price').textContent='價格：待定（MOP）';
    grid.appendChild(n);
  });
}
window.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('themeToggle')?.addEventListener('click',()=>document.documentElement.classList.toggle('dark'));
  load();
  ['input','change'].forEach(ev=>['q','category','sort'].forEach(id=>document.getElementById(id)?.addEventListener(ev,render)));
});
