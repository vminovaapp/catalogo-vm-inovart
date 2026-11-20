(() => {
  'use strict';
  const fallback = { whatsapp:'5521996093767',categorias:[],produtos:[] };
  const db = window.VM_CATALOG_DATA || fallback;
  const all = Array.isArray(db.produtos) ? db.produtos.filter(p=>p && p.codigo && p.nome && p.publicar!==false) : [];
  const $ = sel => document.querySelector(sel);
  const els = { categories:$('#categories'),search:$('#search'),sub:$('#subcategory'),sort:$('#sort'),grid:$('#product-grid'),empty:$('#empty-state'),results:$('#results-label'),crumb:$('#breadcrumb'),total:$('#catalog-total'),dialog:$('#product-dialog') };
  let selectedCategory = 'Todos'; let activeSub = ''; let currentProduct = null;
  const collator = new Intl.Collator('pt-BR', {sensitivity:'base'});
  const normalize = s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const money = v => v===null || v===undefined || v==='' || !Number.isFinite(Number(v)) ? null : new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v));
  const iconPhoto = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" stroke-width="1.5"/><circle cx="8.5" cy="9" r="1.5" stroke-width="1.5"/><path d="m4 17 6-5 4 3 3-2 4 4" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  function el(tag, css, value){const n=document.createElement(tag);if(css)n.className=css;if(value!==undefined)n.textContent=value;return n;}
  const photoUrl = p => p.foto ? new URL(p.foto, document.baseURI).href : '';
  function productUrl(p){const u = new URL(location.href);u.hash='';u.searchParams.set('produto',p.codigo);return u.href;}
  function whatsAppURL(p){
    const message = [`Olá! Tenho interesse em um produto do catálogo VM INOVART.`,``,`Código: ${p.codigo}`,`Produto: ${p.nome}`,`Categoria: ${p.categoria}${p.subcategoria ? ' | '+p.subcategoria : ''}`,`Preço: ${money(p.preco) || 'a consultar'}`];
    if(p.foto && location.protocol.startsWith('http')) message.push(`Foto do produto: ${photoUrl(p)}`);
    if(location.protocol.startsWith('http')) message.push(`Ver produto no catálogo: ${productUrl(p)}`);
    message.push('','Gostaria de saber como comprar.');
    return `https://wa.me/${db.whatsapp || '5521996093767'}?text=${encodeURIComponent(message.join('\n'))}`;
  }
  function photoElement(p){
    if(!p.foto){const n=el('div','photo-fallback');n.innerHTML=iconPhoto; n.append(el('span','', 'Foto em preparação'));return n;}
    const n=el('img');n.src=p.foto;n.alt=`Arte original do produto ${p.nome}, código ${p.codigo}`;n.loading='lazy';n.decoding='async';
    n.addEventListener('error',()=>{const fall=el('div','photo-fallback');fall.innerHTML=iconPhoto;fall.append(el('span','','Foto em preparação'));n.replaceWith(fall);},{once:true});
    return n;
  }
  const categories = [...new Set(['Todos', ...(db.categorias || []), ...all.map(p=>p.categoria)].filter(Boolean))];
  function buildCategories(){
    els.categories.replaceChildren();
    for (const c of categories){const b=el('button','category-pill',c);b.type='button';b.dataset.category=c;b.setAttribute('aria-pressed', String(c===selectedCategory));b.addEventListener('click',()=>{selectedCategory=c;activeSub='';render();});els.categories.append(b);}
  }
  function buildSubcategories(){
    const categoryProducts = selectedCategory==='Todos'?all:all.filter(p=>p.categoria===selectedCategory);
    const subs = [...new Set(categoryProducts.map(p=>p.subcategoria).filter(Boolean))].sort(collator.compare);
    els.sub.replaceChildren();const any=new Option('Todas as subcategorias','');els.sub.add(any);
    for(const sub of subs)els.sub.add(new Option(sub,sub));
    if(!subs.includes(activeSub))activeSub='';els.sub.value=activeSub;els.sub.hidden=subs.length===0;
  }
  function filtered(){
    const query=normalize(els.search.value.trim());
    const products=all.filter(p => (selectedCategory==='Todos'||p.categoria===selectedCategory) && (!activeSub||p.subcategoria===activeSub) && (!query||normalize([p.codigo,p.nome,p.categoria,p.subcategoria,p.descricao].join(' ')).includes(query)));
    if(els.sort.value==='az')products.sort((a,b)=>collator.compare(a.nome,b.nome));
    if(els.sort.value==='za')products.sort((a,b)=>collator.compare(b.nome,a.nome));
    return products;
  }
  function card(p){
    const outer=el('article','product-card');outer.dataset.code=p.codigo;
    const imageBtn=el('button','photo-button');imageBtn.type='button';imageBtn.setAttribute('aria-label',`Ver detalhes do produto ${p.nome}`);imageBtn.append(photoElement(p));
    imageBtn.addEventListener('click',()=>showProduct(p));
    const body=el('div','product-body');
    const top=el('div','card-meta');
    const name=el('div','product-identity');name.append(el('span','product-code',p.codigo),el('h3','product-title',p.nome));
    const price=money(p.preco);const amt=el('div',`product-price${price?'':' consult'}`,price||'Valor sob consulta');
    top.append(name,amt);body.append(top);
    const action=el('a','order-button');action.href=whatsAppURL(p);action.target='_blank';action.rel='noopener noreferrer';action.setAttribute('aria-label',`Pedir ${p.nome}, código ${p.codigo}, pelo WhatsApp`);action.innerHTML='<span class="wa-circle" aria-hidden="true">✆</span><span>Pedir no WhatsApp</span>';
    if(p.disponivel===false){action.classList.add('product-unavailable');action.setAttribute('aria-disabled','true');action.removeAttribute('href');action.textContent='Indisponível';}
    body.append(action);outer.append(imageBtn,body);return outer;
  }
  function render(){
    buildCategories();buildSubcategories();
    const products=filtered();
    els.crumb.replaceChildren(el('strong','',selectedCategory==='Todos'?'Todos os produtos':selectedCategory));
    if(activeSub)els.crumb.append(el('span','',`/ ${activeSub}`));
    els.total.textContent=`${all.length} ${all.length===1?'produto cadastrado':'produtos cadastrados'}`;
    els.results.textContent=`Exibindo ${products.length} ${products.length===1?'produto':'produtos'}`;
    const frag=document.createDocumentFragment();for(const p of products)frag.append(card(p));els.grid.replaceChildren(frag);
    els.empty.hidden=products.length!==0;
  }
  function showProduct(p, updateUrl=true){
    currentProduct=p;
    $('#dialog-category').textContent=`${p.categoria}${p.subcategoria?' · '+p.subcategoria:''}`;
    $('#dialog-title').textContent=p.nome;$('#dialog-code').textContent=`Código ${p.codigo}`;
    $('#dialog-description').textContent='Confira a arte original ao lado. Código e preço estão disponíveis abaixo.';
    $('#dialog-price').textContent=money(p.preco)||'Preço sob consulta';
    const imgWrap=$('.dialog-image-wrap');imgWrap.replaceChildren(photoElement(p));
    const img=imgWrap.querySelector('img');if(img)img.loading='eager';
    const action=$('#dialog-order');action.href=whatsAppURL(p);
    if(!els.dialog.open)els.dialog.showModal();
    if(updateUrl && location.protocol.startsWith('http')){const url=new URL(location.href);url.searchParams.set('produto',p.codigo);history.replaceState({},'',url);}
  }
  function closeProduct(){if(els.dialog.open)els.dialog.close();currentProduct=null;if(location.protocol.startsWith('http')){const u=new URL(location.href);u.searchParams.delete('produto');history.replaceState({},'',u);}}
  els.search.addEventListener('input',render);els.sub.addEventListener('change',()=>{activeSub=els.sub.value;render();});els.sort.addEventListener('change',render);
  $('#reset-filters').addEventListener('click',()=>{selectedCategory='Todos';activeSub='';els.search.value='';render();});
  $('#dialog-close').addEventListener('click',closeProduct);els.dialog.addEventListener('click',e=>{if(e.target===els.dialog)closeProduct();});
  els.dialog.addEventListener('close',()=>{if(currentProduct){currentProduct=null;if(location.protocol.startsWith('http')){const u=new URL(location.href);u.searchParams.delete('produto');history.replaceState({},'',u);}}});
  $('#dialog-share').addEventListener('click',async ()=>{
    if(!currentProduct)return;
    if(!location.protocol.startsWith('http')){alert('O link de compartilhamento estará disponível após a publicação do catálogo na internet.');return;}
    const p=currentProduct;const url=productUrl(p);
    try { if(navigator.share){await navigator.share({title:`${p.nome} | VM INOVART`,text:`Confira ${p.codigo} - ${p.nome}`,url});} else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);$('#dialog-share').textContent='Link copiado ✓';setTimeout(()=>{$('#dialog-share').textContent='Compartilhar este produto ↗';},1700);} else {window.prompt('Copie o link:',url);} }catch(e){if(e.name!=='AbortError')window.prompt('Copie o link:',url);}
  });
  $('#year').textContent=String(new Date().getFullYear());
  render();const code=new URL(location.href).searchParams.get('produto');if(code){const p=all.find(x=>x.codigo.toUpperCase()===code.toUpperCase());if(p)showProduct(p,false);}
})();
