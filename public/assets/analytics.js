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
 const box=document.createElement('section');box.className='page analytics-choice';box.setAttribute('aria-label','アクセス解析の設定');
 const text=document.createElement('p');text.textContent='Google Analyticsで利用状況を計測します。許可するとCookieを利用します。拒否しても全機能を利用できます。';box.append(text);
 for(const [label,value] of [['解析を許可','granted'],['解析を拒否','denied']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>save(value);box.append(b);}
 const policy=document.createElement('a');policy.href='/privacy/';policy.textContent='プライバシー';box.append(policy);
 const control=document.createElement('button');control.type='button';control.textContent='アクセス解析の設定';control.onclick=()=>{box.hidden=false;box.scrollIntoView({block:'center'});};
 document.querySelector('.site-footer')?.append(control);
 document.querySelector('.site-footer')?.before(box);box.hidden=!!choice;
 if(choice==='granted') start();
})();
