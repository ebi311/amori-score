if(!self.define){let e,i={};const t=(t,s)=>(t=new URL(t+".js",s).href,i[t]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=i,document.head.appendChild(e)}else e=t,importScripts(t),i()})).then((()=>{let e=i[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(s,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const f=e=>t(e,r),c={module:{uri:r},exports:o,require:f};i[r]=Promise.all(s.map((e=>c[e]||f(e)))).then((e=>(n(...e),o)))}}define(["./workbox-f683aea5"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"cd225b88604dabfeb20d4f33f10c00c0"},{url:"main.js",revision:"6507f89fad66baa715741f87dcc20e38"},{url:"main.js.LICENSE.txt",revision:"33b048080e1ad7417808d3a22f7155bb"}],{})}));