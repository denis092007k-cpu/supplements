const V="pik-v1",CORE=["/","/manifest.webmanifest","/icon-192.png","/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET")return;
  if(u.origin===location.origin){
    if(u.pathname.startsWith("/__/")||u.pathname.endsWith(".apk"))return; // Google-вхід і APK завжди напряму
    if(r.mode==="navigate"){ // сторінка: спершу мережа, без інтернету — збережена копія
      e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put("/",c));return res}).catch(()=>caches.match("/")));return}
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res});return hit||net}));return}
  if(u.host==="fonts.googleapis.com"||u.host==="fonts.gstatic.com"||(u.host==="www.gstatic.com"&&u.pathname.startsWith("/firebasejs/"))){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res})))}
});
