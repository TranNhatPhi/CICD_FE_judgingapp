import{r as p,E as C,G as j,j as h,e as I,H as T,B,F as D,T as P,I as W}from"./index-DLdgdxs1.js";import{I as F,a as G}from"./IconChevronUp-B8fDyk06.js";const H=e=>e<.5?2*e*e:-1+(4-2*e)*e,V=({axis:e,target:n,parent:t,alignment:o,offset:r,isList:u})=>{if(!n||!t&&typeof document>"u")return 0;const m=!!t,i=(t||document.body).getBoundingClientRect(),l=n.getBoundingClientRect(),d=s=>l[s]-i[s];if(e==="y"){const s=d("top");if(s===0)return 0;if(o==="start"){const c=s-r;return c<=l.height*(u?0:1)||!u?c:0}const a=m?i.height:window.innerHeight;if(o==="end"){const c=s+r-a+l.height;return c>=-l.height*(u?0:1)||!u?c:0}return o==="center"?s-a/2+l.height/2:0}if(e==="x"){const s=d("left");if(s===0)return 0;if(o==="start"){const c=s-r;return c<=l.width||!u?c:0}const a=m?i.width:window.innerWidth;if(o==="end"){const c=s+r-a+l.width;return c>=-l.width||!u?c:0}return o==="center"?s-a/2+l.width/2:0}return 0},z=({axis:e,parent:n})=>{if(!n&&typeof document>"u")return 0;const t=e==="y"?"scrollTop":"scrollLeft";if(n)return n[t];const{body:o,documentElement:r}=document;return o[t]+r[t]},A=({axis:e,parent:n,distance:t})=>{if(!n&&typeof document>"u")return;const o=e==="y"?"scrollTop":"scrollLeft";if(n)n[o]=t;else{const{body:r,documentElement:u}=document;r[o]=t,u[o]=t}};function q({duration:e=1250,axis:n="y",onScrollFinish:t,easing:o=H,offset:r=0,cancelable:u=!0,isList:m=!1}={}){const f=p.useRef(0),i=p.useRef(0),l=p.useRef(!1),d=p.useRef(null),s=p.useRef(null),a=C(),c=()=>{f.current&&cancelAnimationFrame(f.current)},g=p.useCallback(({alignment:y="start"}={})=>{l.current=!1,f.current&&c();const S=z({parent:d.current,axis:n})??0,b=V({parent:d.current,target:s.current,axis:n,alignment:y,offset:r,isList:m})-(d.current?0:S);function x(){i.current===0&&(i.current=performance.now());const E=performance.now()-i.current,R=a||e===0?1:E/e,v=S+b*o(R);A({parent:d.current,axis:n,distance:v}),!l.current&&R<1?f.current=requestAnimationFrame(x):(typeof t=="function"&&t(),i.current=0,f.current=0,c())}x()},[n,e,o,m,r,t,a]),w=()=>{u&&(l.current=!0)};return j("wheel",w,{passive:!0}),j("touchmove",w,{passive:!0}),p.useEffect(()=>c,[]),{scrollableRef:d,targetRef:s,scrollIntoView:g,cancel:c}}function J({title:e,children:n,opened:t,toggle:o,isMarked:r,isGradient:u,markResult:m}){const{scrollIntoView:f,targetRef:i}=q({offset:60});return h.jsxs(I,{maw:"100%",children:[h.jsx(T,{justify:"center",mb:"sm",children:h.jsx(B,{onClick:()=>{o()},size:"lg",fullWidth:!0,bg:u?void 0:r?"white":"indigo.9",variant:u?"gradient":r?"outline":"filled",leftSection:r?h.jsx(D,{gap:"sm",align:"center",p:"sm",bg:"blue",children:h.jsx(P,{component:"span",fw:700,c:"white",size:"xl",children:m})}):null,justify:"space-between",rightSection:t?h.jsx(F,{}):h.jsx(G,{}),gradient:{from:"#0036D0",to:"#B31010",deg:45},...r?{pl:0}:{},children:e})}),h.jsx(W,{in:t,transitionDuration:300,transitionTimingFunction:"linear",onTransitionEnd:()=>{t&&f({alignment:"start"})},ref:i,children:n})]})}export{J as G};
