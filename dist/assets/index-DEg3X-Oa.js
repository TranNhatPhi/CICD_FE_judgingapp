import{u as g,L as p,q as x,aw as h,j as e,F as n,N as j,T as r,Q as w,U as f,B as a,aV as I,y as i}from"./index-04khTJRU.js";import{P as L,I as P,L as v}from"./schema-G2TV0euT.js";import"./ActionIcon-BoeXnWTl.js";import"./index-DXqQCM1T.js";const k=()=>{const l=g(),[c,{isLoading:u}]=p(),s=x({mode:"uncontrolled",initialValues:{username:"",password:""},validate:v}),d=h(),m=async o=>{console.log("values",o);try{const t=await c(o).unwrap();await d(I(t)),l("/admin/projects")}catch(t){console.log("error",t),i.open({centered:!0,size:"xs",title:"Login Error",children:e.jsxs(e.Fragment,{children:[e.jsx(r,{children:"Your username or password is incorrect!"}),e.jsx(a,{fullWidth:!0,onClick:()=>i.closeAll(),mt:"md",children:"I understand"})]})})}};return e.jsx("form",{onSubmit:s.onSubmit(m),children:e.jsxs(n,{direction:"column",gap:"xl",children:[e.jsxs(n,{direction:"column",justify:"center",align:"center",gap:"lg",children:[e.jsx(j,{src:"/assets/uow_logo.svg",alt:"logo"}),e.jsx(r,{size:"xl",fw:700,variant:"gradient",gradient:{from:"#0036D0",to:"#B31010",deg:45},children:"Judging App"})]}),e.jsxs(n,{direction:"column",gap:"md",children:[e.jsx(w,{label:"Username",size:"lg",leftSectionPointerEvents:"none",leftSection:e.jsx(f,{}),withAsterisk:!0,placeholder:"Enter username",...s.getInputProps("username")},s.key("username")),e.jsx(L,{label:"Password",size:"lg",leftSectionPointerEvents:"none",leftSection:e.jsx(P,{}),withAsterisk:!0,placeholder:"Enter password",...s.getInputProps("password")},s.key("password"))]}),e.jsx(a,{size:"lg",fullWidth:!0,m:"auto",type:"submit",loading:u,children:"Login"})]})})};export{k as default};
