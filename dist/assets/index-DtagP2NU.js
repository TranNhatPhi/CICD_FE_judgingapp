import{t as N,z as E,r as h,a as W,A as D,j as e,T as c,e as H,P as J,F as y,S as V,s as Q,B as p,V as U,y as j}from"./index-CMJNtPD3.js";import{G as R}from"./index-CPduSaOx.js";import{P as Y}from"./index-_f9fnm1K.js";import{G as b,a as u}from"./Grid-C2y4XYnc.js";import{C}from"./Card-BRTnqwQN.js";import{I as _}from"./IconCheck-BZA9jSp7.js";import"./IconChevronUp-D8c7NHdB.js";const ee=()=>{var I;const{userId:i}=N(),{data:a,isSuccess:M,refetch:F}=E(i,{skip:!i,refetchOnMountOrArgChange:!0}),[f,m]=h.useState([!1,!1]),[s,S]=h.useState([]),[P,w]=h.useState(""),[x,k]=h.useState(!1),{round2Closed:g,description:G}=W(),[O,{isLoading:A}]=D();h.useEffect(()=>{var r;M&&(S((a==null?void 0:a.map(n=>{var t,o;return{id:((t=n==null?void 0:n.project)==null?void 0:t.id)??0,name:((o=n.project)==null?void 0:o.groupName)??"",isSelected:((n==null?void 0:n.totalMark)??0)>0?Math.abs(5-n.totalMark):null}}))||[]),k(a==null?void 0:a.some(n=>!!(n!=null&&n.markedBỵJudge))),w(((r=a==null?void 0:a.find(n=>!!(n!=null&&n.comment)))==null?void 0:r.comment)??""))},[M,a]);const B=async()=>{if(s.find(n=>n.isSelected===null)){j.open({centered:!0,size:"xs",title:"Marking Warning",children:e.jsxs(e.Fragment,{children:[e.jsx(c,{c:"red",fw:600,children:"Please select all 5 winners!"}),e.jsx(p,{fullWidth:!0,onClick:()=>j.closeAll(),mt:"md",variant:"default",children:"Ok"})]})});return}const r=s.reduce((n,t)=>(t.isSelected!==null&&(n[t.id]=Math.abs(5-t.isSelected)),n),{});await O({judgeId:Number(i),projectMarks:r,comment:P}).unwrap(),j.open({centered:!0,size:"xs",title:"Marking Success",children:e.jsxs(e.Fragment,{children:[e.jsx(c,{c:"green",children:"Your marking is successfully updated!"}),e.jsx(p,{fullWidth:!0,onClick:()=>j.closeAll(),mt:"md",bg:"green",children:"Ok"})]})}),k(!0),m([!1,!1]),F()};return e.jsxs(b,{gutter:"lg",py:"lg",children:[e.jsx(u,{span:12,children:e.jsxs(C,{radius:"lg",children:[e.jsx(C.Section,{p:"lg",children:e.jsx(c,{size:"xl",fw:700,variant:"gradient",gradient:{from:"#0036D0",to:"#B31010",deg:45},children:"Judging Principle"})}),e.jsx(C.Section,{px:"lg",pb:"lg",children:e.jsx(c,{c:"gray.8",children:G})})]})}),e.jsx(u,{span:12,children:e.jsx(R,{title:"Shortlisted Teams (5 Teams)",opened:f[0],toggle:()=>m([!f[0],f[1]]),children:a==null?void 0:a.map(r=>{var n;return e.jsx(H,{mb:"md",children:e.jsx(Y,{title:(r==null?void 0:r.project.groupName)??"",abstract:(n=r.project)==null?void 0:n.description,groupName:r.project.title})},r.project.id)})})}),e.jsx(u,{span:12,children:e.jsx(R,{title:"Ranking",opened:f[1],toggle:()=>m(r=>[r[0],!r[1]]),isGradient:!0,children:e.jsx(b,{children:e.jsx(u,{span:12,children:e.jsx("form",{children:e.jsx(J,{radius:"lg",p:"lg",children:e.jsxs(y,{direction:"column",gap:"md",children:[...Array(5).fill(0).map((r,n)=>{var o;const t=((o=s==null?void 0:s.find(l=>l.isSelected===n))==null?void 0:o.id.toString())??null;return e.jsxs(y,{direction:"column",gap:"xs",children:[e.jsxs(y,{gap:"xs",align:"center",children:[e.jsx(c,{size:"xl",style:{fontSize:32,minWidth:40},c:n<3?"auto":"gray.6",ta:"center",children:z(n)}),e.jsx(c,{size:"xl",style:{fontSize:28},variant:n<3?"gradient":"text",gradient:{from:"#0036D0",to:"#B31010",deg:45},children:v(n)})]}),e.jsx(V,{checkIconPosition:"left",data:s==null?void 0:s.map(l=>({value:l==null?void 0:l.id.toString(),label:l.name,disabled:l.isSelected!==null&&l.isSelected!==n})),placeholder:"Pick winners",size:"lg",readOnly:x||g,...x?{rightSection:e.jsx(_,{}),variant:"unstyled"}:{},value:t,onChange:l=>{if(console.log("_value",l),l===null){S(s==null?void 0:s.map(d=>d.isSelected===n?(console.log("item.isSelected === idx",d.isSelected===n,n,d.isSelected),{...d,isSelected:null}):d));return}S((s==null?void 0:s.map(d=>d.isSelected===n?{...d,isSelected:null}:d.id===Number(l)?{...d,isSelected:n}:d))??[])},clearable:!0})]},v(n))}),e.jsx(u,{span:12,children:e.jsx(Q,{label:"Note",readOnly:x||g,autosize:!0,placeholder:"Leave your comments here",value:P,onChange:r=>w(r.currentTarget.value),minRows:4})}),e.jsxs(b,{children:[e.jsx(u,{span:12,ta:"center",children:e.jsxs(c,{size:"xl",children:[z(0)," ",((I=s==null?void 0:s.find(r=>r.isSelected===0))==null?void 0:I.name)??""]})}),...Array(4).fill(0).map((r,n)=>{var t;return e.jsx(u,{span:6,ta:"center",children:e.jsxs(c,{size:"xl",children:[e.jsxs(c,{component:"span",c:n>1?"gray.7":"auto",children:[n>1?"NO. ":"",z(n+1)]})," ",((t=s==null?void 0:s.find(o=>o.isSelected===n+1))==null?void 0:t.name)??""]})},n)})]}),x?e.jsxs(e.Fragment,{children:[e.jsx(p,{mt:"md",size:"compact-lg",onClick:()=>k(!1),type:"button",variant:"outline",disabled:g,children:"Edit"}),e.jsx(U,{children:e.jsx(p,{type:"submit",disabled:g,children:"Hidden"})})]}):e.jsx(p,{mt:"md",size:"compact-lg",onClick:B,loading:A,disabled:g,children:"Submit"})]})})})})})})})]})},v=i=>{switch(i){case 0:return"First place";case 1:return"Second place";case 2:return"Third place";case 3:return"Fourth place";default:return"Fifth place"}},z=i=>{switch(i){case 0:return"🥇";case 1:return"🥈";case 2:return"🥉";case 3:return"4";default:return"5"}};export{ee as default};
