if(!self.define){let s,e={};const n=(n,i)=>(n=new URL(n+".js",i).href,e[n]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=n,s.onload=e,document.head.appendChild(s)}else s=n,importScripts(n),e()})).then((()=>{let s=e[n];if(!s)throw new Error(`Module ${n} didn’t register its module`);return s})));self.define=(i,l)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const o=s=>n(s,r),t={module:{uri:r},exports:u,require:o};e[r]=Promise.all(i.map((s=>t[s]||o(s)))).then((s=>(l(...s),u)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/ActionIcon-DUWXgDlG.js",revision:null},{url:"assets/AdminProtectedBodyLayout-BNX7hyK0.js",revision:null},{url:"assets/Card-BRTnqwQN.js",revision:null},{url:"assets/Grid-C2y4XYnc.js",revision:null},{url:"assets/IconCheck-BZA9jSp7.js",revision:null},{url:"assets/IconChevronUp-D8c7NHdB.js",revision:null},{url:"assets/IconJoinRound-D7UBqywU.js",revision:null},{url:"assets/IconSearch-Cm5b9_BS.js",revision:null},{url:"assets/index-_f9fnm1K.js",revision:null},{url:"assets/index-99JfqI1w.js",revision:null},{url:"assets/index-CMJNtPD3.js",revision:null},{url:"assets/index-CO6jwLok.js",revision:null},{url:"assets/index-CPduSaOx.js",revision:null},{url:"assets/index-CwjUFtpu.js",revision:null},{url:"assets/index-D-kBn7qi.css",revision:null},{url:"assets/index-Dh9RlhmT.js",revision:null},{url:"assets/index-Ds_WeynH.js",revision:null},{url:"assets/index-DtagP2NU.js",revision:null},{url:"assets/index-DwPB7By6.js",revision:null},{url:"assets/index-DXqQCM1T.js",revision:null},{url:"assets/index-Inmyqn6M.js",revision:null},{url:"assets/index-kccQQTFi.js",revision:null},{url:"assets/index-rSEBd556.js",revision:null},{url:"assets/index-SJbJI0BI.css",revision:null},{url:"assets/index-U08ZlNrp.js",revision:null},{url:"assets/lodash-C7AKTjaF.js",revision:null},{url:"assets/schema-BOU5UX-o.js",revision:null},{url:"index.html",revision:"f09fa94393e001e97a539dea7ebd1b2f"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"manifest.webmanifest",revision:"8ed91a88616f069e76484effe1129b69"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
