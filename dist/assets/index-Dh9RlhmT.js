import{C as g,r as c,a as f,j as e,T as l,F as m}from"./index-CMJNtPD3.js";import{G as j}from"./index-CPduSaOx.js";import{P as h}from"./index-_f9fnm1K.js";import{G as C,a as u}from"./Grid-C2y4XYnc.js";import{C as o}from"./Card-BRTnqwQN.js";import"./IconChevronUp-D8c7NHdB.js";const O=()=>{const{data:s,isSuccess:n}=g({},{refetchOnMountOrArgChange:!0}),[a,i]=c.useState([]),{description:x}=f();return c.useEffect(()=>{n&&i((s==null?void 0:s.map(r=>({id:r.id,opened:!1})))||[])},[n]),e.jsxs(C,{gutter:"lg",py:"lg",children:[e.jsx(u,{span:12,children:e.jsxs(o,{radius:"lg",children:[e.jsx(o.Section,{p:"lg",children:e.jsx(l,{size:"xl",fw:700,children:"Introduction"})}),e.jsx(o.Section,{px:"lg",pb:"lg",children:e.jsx(l,{c:"gray.8",children:x})})]})}),e.jsx(u,{span:12,children:e.jsx(m,{gap:"lg",direction:"column",w:"100%",children:s==null?void 0:s.map((r,d)=>{var p;return e.jsx(j,{title:`${r.groupName}`,opened:(p=a[d])==null?void 0:p.opened,toggle:()=>{i(a.map(t=>t.id===r.id?{...t,opened:!t.opened}:t))},children:e.jsx(h,{title:r.title,abstract:r.description,groupName:r.groupName||""})},d)})})})]})};export{O as default};
