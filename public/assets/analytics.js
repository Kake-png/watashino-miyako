(() => {
 const id = document.querySelector('meta[name="atlas-ga-id"]')?.content;
 if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
 const key='atlas-analytics-consent-v1';
 let choice; try {choice=localStorage.getItem(key);} catch {}
 const excluded=location.hostname==='localhost' || location.hostname==='127.0.0.1';
 function start(){
  if(excluded) return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('js',new Date());
  gtag('config',id,{allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+id;document.head.append(script);
 }
 function save(value){try{localStorage.setItem(key,value);}catch{} location.reload();}
 const controls=document.querySelector('[data-analytics-controls]');
 if(controls){
  const status=document.createElement('p');status.textContent=choice==='denied'?'このブラウザの解析は無効です。':'このブラウザの解析は有効です。';controls.append(status);
  for(const [label,value] of [['このブラウザの解析を無効にする','denied'],['解析を有効に戻す','granted']]){
   const button=document.createElement('button');button.type='button';button.textContent=label;button.onclick=()=>save(value);controls.append(button);
  }
 }
 if(choice!=='denied') start();
})();
