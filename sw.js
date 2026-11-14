/* Culture G : fonctionnement hors connexion.
   La page est prise sur le réseau quand il répond (les mises à jour arrivent toutes seules), sinon dans le cache. */
const C='culture-g-v1',CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!=C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET'||!/^https?:/.test(r.url))return;
 const same=new URL(r.url).origin==location.origin,page=r.mode=='navigate'||(same&&/(\/|index\.html)$/.test(new URL(r.url).pathname));
 if(page){e.respondWith(fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put('index.html',y))}return x}).catch(()=>caches.match('index.html')));return}
 if(!same&&!/fonts\.(googleapis|gstatic)\.com/.test(r.url))return;
 e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x.ok||x.type=='opaque'){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x});return h?(n.catch(()=>{}),h):n}))});
