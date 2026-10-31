// Startup owns its loading/retry UI; gameplay becomes ready only after warm-up succeeds.
export function makeStartup(parent:HTMLElement,prepare:()=>Promise<unknown>,entered:()=>void){
 const root=document.createElement('div');root.className='loading';
 const panel=document.createElement('div'),status=document.createElement('p'),retry=document.createElement('button');
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 retry.textContent='Try again';retry.hidden=true;panel.append(status,retry);root.append(panel);parent.append(root);
 let pending=false;
 return new Promise<void>(resolve=>{
  async function attempt(){
   if(pending)return;pending=true;retry.hidden=true;status.textContent='Entering the Foundry…';
   try{await prepare();entered();root.remove();resolve();}
   catch{status.textContent='The Foundry couldn’t start. Please try again.';retry.hidden=false;retry.focus();}
   finally{pending=false;}
  }
  retry.addEventListener('click',()=>{void attempt();});void attempt();
 });
}
