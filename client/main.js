let currentBoard='';

function initBoard(){
 currentBoard=location.pathname.replace('/','');
 document.getElementById('boardTitle').innerText='/'+currentBoard;
 loadBoard();
}

async function loadBoard(){
 const res=await fetch('/api/posts/'+currentBoard);
 const data=await res.json();
 const list=document.getElementById('list');
 list.innerHTML='';
 data.forEach(p=>{
  const d=document.createElement('div');
  d.innerHTML=p.content;
  if(p.image) d.innerHTML+=`<img src="${p.image}">`;
  list.appendChild(d);
 });
}

async function loadRecent(){
 const boards=['b','g'];
 const el=document.getElementById('recent');
 for(let b of boards){
  const res=await fetch('/api/posts/'+b);
  const data=await res.json();
  data.slice(0,3).forEach(p=>{
    const d=document.createElement('div');
    d.innerText=`[/${b}] `+p.content;
    el.appendChild(d);
  });
 }
}

async function post(){
 const form=new FormData();
 form.append('content',document.getElementById('content').value);
 const file=document.getElementById('image').files[0];
 if(file) form.append('image',file);
 await fetch('/api/post/'+currentBoard,{method:'POST',body:form});
 loadBoard();
}
