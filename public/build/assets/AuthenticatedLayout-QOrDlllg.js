import{j as i,r as d,L as O,e as Q}from"./app-C_cz8bv4.js";import{z as J}from"./transition-Bf3tepnj.js";function X(e){return i.jsx("svg",{...e,viewBox:"0 0 316 316",xmlns:"http://www.w3.org/2000/svg",children:i.jsx("path",{d:"M305.8 81.125C305.77 80.995 305.69 80.885 305.65 80.755C305.56 80.525 305.49 80.285 305.37 80.075C305.29 79.935 305.17 79.815 305.07 79.685C304.94 79.515 304.83 79.325 304.68 79.175C304.55 79.045 304.39 78.955 304.25 78.845C304.09 78.715 303.95 78.575 303.77 78.475L251.32 48.275C249.97 47.495 248.31 47.495 246.96 48.275L194.51 78.475C194.33 78.575 194.19 78.725 194.03 78.845C193.89 78.955 193.73 79.045 193.6 79.175C193.45 79.325 193.34 79.515 193.21 79.685C193.11 79.815 192.99 79.935 192.91 80.075C192.79 80.285 192.71 80.525 192.63 80.755C192.58 80.875 192.51 80.995 192.48 81.125C192.38 81.495 192.33 81.875 192.33 82.265V139.625L148.62 164.795V52.575C148.62 52.185 148.57 51.805 148.47 51.435C148.44 51.305 148.36 51.195 148.32 51.065C148.23 50.835 148.16 50.595 148.04 50.385C147.96 50.245 147.84 50.125 147.74 49.995C147.61 49.825 147.5 49.635 147.35 49.485C147.22 49.355 147.06 49.265 146.92 49.155C146.76 49.025 146.62 48.885 146.44 48.785L93.99 18.585C92.64 17.805 90.98 17.805 89.63 18.585L37.18 48.785C37 48.885 36.86 49.035 36.7 49.155C36.56 49.265 36.4 49.355 36.27 49.485C36.12 49.635 36.01 49.825 35.88 49.995C35.78 50.125 35.66 50.245 35.58 50.385C35.46 50.595 35.38 50.835 35.3 51.065C35.25 51.185 35.18 51.305 35.15 51.435C35.05 51.805 35 52.185 35 52.575V232.235C35 233.795 35.84 235.245 37.19 236.025L142.1 296.425C142.33 296.555 142.58 296.635 142.82 296.725C142.93 296.765 143.04 296.835 143.16 296.865C143.53 296.965 143.9 297.015 144.28 297.015C144.66 297.015 145.03 296.965 145.4 296.865C145.5 296.835 145.59 296.775 145.69 296.745C145.95 296.655 146.21 296.565 146.45 296.435L251.36 236.035C252.72 235.255 253.55 233.815 253.55 232.245V174.885L303.81 145.945C305.17 145.165 306 143.725 306 142.155V82.265C305.95 81.875 305.89 81.495 305.8 81.125ZM144.2 227.205L100.57 202.515L146.39 176.135L196.66 147.195L240.33 172.335L208.29 190.625L144.2 227.205ZM244.75 114.995V164.795L226.39 154.225L201.03 139.625V89.825L219.39 100.395L244.75 114.995ZM249.12 57.105L292.81 82.265L249.12 107.425L205.43 82.265L249.12 57.105ZM114.49 184.425L96.13 194.995V85.305L121.49 70.705L139.85 60.135V169.815L114.49 184.425ZM91.76 27.425L135.45 52.585L91.76 77.745L48.07 52.585L91.76 27.425ZM43.67 60.135L62.03 70.705L87.39 85.305V202.545V202.555V202.565C87.39 202.735 87.44 202.895 87.46 203.055C87.49 203.265 87.49 203.485 87.55 203.695V203.705C87.6 203.875 87.69 204.035 87.76 204.195C87.84 204.375 87.89 204.575 87.99 204.745C87.99 204.745 87.99 204.755 88 204.755C88.09 204.905 88.22 205.035 88.33 205.175C88.45 205.335 88.55 205.495 88.69 205.635L88.7 205.645C88.82 205.765 88.98 205.855 89.12 205.965C89.28 206.085 89.42 206.225 89.59 206.325C89.6 206.325 89.6 206.325 89.61 206.335C89.62 206.335 89.62 206.345 89.63 206.345L139.87 234.775V285.065L43.67 229.705V60.135ZM244.75 229.705L148.58 285.075V234.775L219.8 194.115L244.75 179.875V229.705ZM297.2 139.625L253.49 164.795V114.995L278.85 100.395L297.21 89.825V139.625H297.2Z"})})}const F=d.createContext(),C=({children:e})=>{const[t,r]=d.useState(!1),a=()=>{r(o=>!o)};return i.jsx(F.Provider,{value:{open:t,setOpen:r,toggleOpen:a},children:i.jsx("div",{className:"relative",children:e})})},ee=({children:e})=>{const{open:t,setOpen:r,toggleOpen:a}=d.useContext(F);return i.jsxs(i.Fragment,{children:[i.jsx("div",{onClick:a,children:e}),t&&i.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>r(!1)})]})},te=({align:e="right",width:t="48",contentClasses:r="py-1 bg-white",children:a})=>{const{open:o,setOpen:n}=d.useContext(F);let s="origin-top";e==="left"?s="ltr:origin-top-left rtl:origin-top-right start-0":e==="right"&&(s="ltr:origin-top-right rtl:origin-top-left end-0");let l="";return t==="48"&&(l="w-48"),i.jsx(i.Fragment,{children:i.jsx(J,{show:o,enter:"transition ease-out duration-200",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:i.jsx("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${s} ${l}`,onClick:()=>n(!1),children:i.jsx("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+r,children:a})})})})},re=({className:e="",children:t,...r})=>i.jsx(O,{...r,className:"block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none "+e,children:t});C.Trigger=ee;C.Content=te;C.Link=re;function T({active:e=!1,className:t="",children:r,...a}){return i.jsx(O,{...a,className:"inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none "+(e?"border-indigo-400 text-gray-900 focus:border-indigo-700":"border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700")+t,children:r})}function L({active:e=!1,className:t="",children:r,...a}){return i.jsx(O,{...a,className:`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${e?"border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800":"border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800"} text-base font-medium transition duration-150 ease-in-out focus:outline-none ${t}`,children:r})}let se={data:""},ae=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||se,ie=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,oe=/\/\*[^]*?\*\/|  +/g,B=/\n+/g,j=(e,t)=>{let r="",a="",o="";for(let n in e){let s=e[n];n[0]=="@"?n[1]=="i"?r=n+" "+s+";":a+=n[1]=="f"?j(s,n):n+"{"+j(s,n[1]=="k"?"":t)+"}":typeof s=="object"?a+=j(s,t?t.replace(/([^,])+/g,l=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,c=>/&/.test(c)?c.replace(/&/g,l):l?l+" "+c:c)):n):s!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=j.p?j.p(n,s):n+":"+s+";")}return r+(t&&o?t+"{"+o+"}":o)+a},y={},H=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+H(e[r]);return t}return e},ne=(e,t,r,a,o)=>{let n=H(e),s=y[n]||(y[n]=(c=>{let m=0,p=11;for(;m<c.length;)p=101*p+c.charCodeAt(m++)>>>0;return"go"+p})(n));if(!y[s]){let c=n!==e?e:(m=>{let p,u,f=[{}];for(;p=ie.exec(m.replace(oe,""));)p[4]?f.shift():p[3]?(u=p[3].replace(B," ").trim(),f.unshift(f[0][u]=f[0][u]||{})):f[0][p[1]]=p[2].replace(B," ").trim();return f[0]})(e);y[s]=j(o?{["@keyframes "+s]:c}:c,r?"":"."+s)}let l=r&&y.g?y.g:null;return r&&(y.g=y[s]),((c,m,p,u)=>{u?m.data=m.data.replace(u,c):m.data.indexOf(c)===-1&&(m.data=p?c+m.data:m.data+c)})(y[s],t,a,l),s},le=(e,t,r)=>e.reduce((a,o,n)=>{let s=t[n];if(s&&s.call){let l=s(r),c=l&&l.props&&l.props.className||/^go/.test(l)&&l;s=c?"."+c:l&&typeof l=="object"?l.props?"":j(l,""):l===!1?"":l}return a+o+(s??"")},"");function M(e){let t=this||{},r=e.call?e(t.p):e;return ne(r.unshift?r.raw?le(r,[].slice.call(arguments,1),t.p):r.reduce((a,o)=>Object.assign(a,o&&o.call?o(t.p):o),{}):r,ae(t.target),t.g,t.o,t.k)}let W,P,I;M.bind({g:1});let v=M.bind({k:1});function de(e,t,r,a){j.p=t,W=e,P=r,I=a}function w(e,t){let r=this||{};return function(){let a=arguments;function o(n,s){let l=Object.assign({},n),c=l.className||o.className;r.p=Object.assign({theme:P&&P()},l),r.o=/ *go\d+/.test(c),l.className=M.apply(r,a)+(c?" "+c:"");let m=e;return e[0]&&(m=l.as||e,delete l.as),I&&m[0]&&I(l),W(m,l)}return t?t(o):o}}var ce=e=>typeof e=="function",D=(e,t)=>ce(e)?e(t):e,ue=(()=>{let e=0;return()=>(++e).toString()})(),_=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),me=20,Z="default",G=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(s=>s.id===t.toast.id?{...s,...t.toast}:s)};case 2:let{toast:a}=t;return G(e,{type:e.toasts.find(s=>s.id===a.id)?1:0,toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(s=>s.id===o||o===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(s=>s.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+n}))}}},$=[],U={toasts:[],pausedAt:void 0,settings:{toastLimit:me}},b={},Y=(e,t=Z)=>{b[t]=G(b[t]||U,e),$.forEach(([r,a])=>{r===t&&a(b[t])})},q=e=>Object.keys(b).forEach(t=>Y(e,t)),pe=e=>Object.keys(b).find(t=>b[t].toasts.some(r=>r.id===e)),V=(e=Z)=>t=>{Y(t,e)},fe={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},ge=(e={},t=Z)=>{let[r,a]=d.useState(b[t]||U),o=d.useRef(b[t]);d.useEffect(()=>(o.current!==b[t]&&a(b[t]),$.push([t,a]),()=>{let s=$.findIndex(([l])=>l===t);s>-1&&$.splice(s,1)}),[t]);let n=r.toasts.map(s=>{var l,c,m;return{...e,...e[s.type],...s,removeDelay:s.removeDelay||((l=e[s.type])==null?void 0:l.removeDelay)||e?.removeDelay,duration:s.duration||((c=e[s.type])==null?void 0:c.duration)||e?.duration||fe[s.type],style:{...e.style,...(m=e[s.type])==null?void 0:m.style,...s.style}}});return{...r,toasts:n}},he=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:r?.id||ue()}),k=e=>(t,r)=>{let a=he(t,e,r);return V(a.toasterId||pe(a.id))({type:2,toast:a}),a.id},g=(e,t)=>k("blank")(e,t);g.error=k("error");g.success=k("success");g.loading=k("loading");g.custom=k("custom");g.dismiss=(e,t)=>{let r={type:3,toastId:e};t?V(t)(r):q(r)};g.dismissAll=e=>g.dismiss(void 0,e);g.remove=(e,t)=>{let r={type:4,toastId:e};t?V(t)(r):q(r)};g.removeAll=e=>g.remove(void 0,e);g.promise=(e,t,r)=>{let a=g.loading(t.loading,{...r,...r?.loading});return typeof e=="function"&&(e=e()),e.then(o=>{let n=t.success?D(t.success,o):void 0;return n?g.success(n,{id:a,...r,...r?.success}):g.dismiss(a),o}).catch(o=>{let n=t.error?D(t.error,o):void 0;n?g.error(n,{id:a,...r,...r?.error}):g.dismiss(a)}),e};var xe=1e3,be=(e,t="default")=>{let{toasts:r,pausedAt:a}=ge(e,t),o=d.useRef(new Map).current,n=d.useCallback((u,f=xe)=>{if(o.has(u))return;let h=setTimeout(()=>{o.delete(u),s({type:4,toastId:u})},f);o.set(u,h)},[]);d.useEffect(()=>{if(a)return;let u=Date.now(),f=r.map(h=>{if(h.duration===1/0)return;let N=(h.duration||0)+h.pauseDuration-(u-h.createdAt);if(N<0){h.visible&&g.dismiss(h.id);return}return setTimeout(()=>g.dismiss(h.id,t),N)});return()=>{f.forEach(h=>h&&clearTimeout(h))}},[r,a,t]);let s=d.useCallback(V(t),[t]),l=d.useCallback(()=>{s({type:5,time:Date.now()})},[s]),c=d.useCallback((u,f)=>{s({type:1,toast:{id:u,height:f}})},[s]),m=d.useCallback(()=>{a&&s({type:6,time:Date.now()})},[a,s]),p=d.useCallback((u,f)=>{let{reverseOrder:h=!1,gutter:N=8,defaultPosition:R}=f||{},z=r.filter(x=>(x.position||R)===(u.position||R)&&x.height),K=z.findIndex(x=>x.id===u.id),S=z.filter((x,A)=>A<K&&x.visible).length;return z.filter(x=>x.visible).slice(...h?[S+1]:[0,S]).reduce((x,A)=>x+(A.height||0)+N,0)},[r]);return d.useEffect(()=>{r.forEach(u=>{if(u.dismissed)n(u.id,u.removeDelay);else{let f=o.get(u.id);f&&(clearTimeout(f),o.delete(u.id))}})},[r,n]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:m,calculateOffset:p}}},ye=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ve=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ce=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,je=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ye} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ve} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Ce} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,we=v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Le=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${we} 1s linear infinite;
`,ke=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Ne=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Ee=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ke} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Ne} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,$e=w("div")`
  position: absolute;
`,De=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Oe=v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Me=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Oe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Ve=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return t!==void 0?typeof t=="string"?d.createElement(Me,null,t):t:r==="blank"?null:d.createElement(De,null,d.createElement(Le,{...a}),r!=="loading"&&d.createElement($e,null,r==="error"?d.createElement(je,{...a}):d.createElement(Ee,{...a})))},ze=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Ae=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Te="0%{opacity:0;} 100%{opacity:1;}",Pe="0%{opacity:1;} 100%{opacity:0;}",Ie=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Fe=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ze=(e,t)=>{let r=e.includes("top")?1:-1,[a,o]=_()?[Te,Pe]:[ze(r),Ae(r)];return{animation:t?`${v(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Re=d.memo(({toast:e,position:t,style:r,children:a})=>{let o=e.height?Ze(e.position||t||"top-center",e.visible):{opacity:0},n=d.createElement(Ve,{toast:e}),s=d.createElement(Fe,{...e.ariaProps},D(e.message,e));return d.createElement(Ie,{className:e.className,style:{...o,...r,...e.style}},typeof a=="function"?a({icon:n,message:s}):d.createElement(d.Fragment,null,n,s))});de(d.createElement);var Se=({id:e,className:t,style:r,onHeightUpdate:a,children:o})=>{let n=d.useCallback(s=>{if(s){let l=()=>{let c=s.getBoundingClientRect().height;a(e,c)};l(),new MutationObserver(l).observe(s,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return d.createElement("div",{ref:n,className:t,style:r},o)},Be=(e,t)=>{let r=e.includes("top"),a=r?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:_()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...a,...o}},He=M`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,E=16,We=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:o,toasterId:n,containerStyle:s,containerClassName:l})=>{let{toasts:c,handlers:m}=be(r,n);return d.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:E,left:E,right:E,bottom:E,pointerEvents:"none",...s},className:l,onMouseEnter:m.startPause,onMouseLeave:m.endPause},c.map(p=>{let u=p.position||t,f=m.calculateOffset(p,{reverseOrder:e,gutter:a,defaultPosition:t}),h=Be(u,f);return d.createElement(Se,{id:p.id,key:p.id,onHeightUpdate:m.updateHeight,className:p.visible?He:"",style:h},p.type==="custom"?D(p.message,p):o?o(p):d.createElement(Re,{toast:p,position:u}))}))},Ue=g;function Ye({header:e,children:t}){const r=Q().props.auth.user,[a,o]=d.useState(!1);return i.jsxs("div",{className:"min-h-screen bg-gray-100",children:[i.jsxs("nav",{className:"border-b border-gray-100 bg-white",children:[i.jsx("div",{className:"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",children:i.jsxs("div",{className:"flex h-16 justify-between",children:[i.jsxs("div",{className:"flex",children:[i.jsx("div",{className:"flex shrink-0 items-center",children:i.jsx(O,{href:"/",children:i.jsx(X,{className:"block h-9 w-auto fill-current text-gray-800"})})}),i.jsxs("div",{className:"hidden space-x-8 sm:-my-px sm:ms-10 sm:flex",children:[i.jsx(T,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"}),i.jsx(T,{href:route("word-banks.index"),active:route().current("word-banks.*"),children:"Word Banks"}),i.jsx(T,{href:route("games.index"),active:route().current("games.*"),children:"Game"})]})]}),i.jsx("div",{className:"hidden sm:ms-6 sm:flex sm:items-center",children:i.jsx("div",{className:"relative ms-3",children:i.jsxs(C,{children:[i.jsx(C.Trigger,{children:i.jsx("span",{className:"inline-flex rounded-md",children:i.jsxs("button",{type:"button",className:"inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none",children:[r.name,i.jsx("svg",{className:"-me-0.5 ms-2 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:i.jsx("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),i.jsxs(C.Content,{children:[i.jsx(C.Link,{href:route("profile.edit"),children:"Profile"}),i.jsx(C.Link,{href:route("logout"),method:"post",as:"button",children:"Log Out"})]})]})})}),i.jsx("div",{className:"-me-2 flex items-center sm:hidden",children:i.jsx("button",{onClick:()=>o(n=>!n),className:"inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none",children:i.jsxs("svg",{className:"h-6 w-6",stroke:"currentColor",fill:"none",viewBox:"0 0 24 24",children:[i.jsx("path",{className:a?"hidden":"inline-flex",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"}),i.jsx("path",{className:a?"inline-flex":"hidden",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})]})})})]})}),i.jsxs("div",{className:(a?"block":"hidden")+" sm:hidden",children:[i.jsxs("div",{className:"space-y-1 pb-3 pt-2",children:[i.jsx(L,{href:route("dashboard"),active:route().current("dashboard"),children:"Dashboard"}),i.jsx(L,{href:route("word-banks.index"),active:route().current("word-banks.*"),children:"Word Banks"}),i.jsx(L,{href:route("games.index"),active:route().current("games.*"),children:"Game"})]}),i.jsxs("div",{className:"border-t border-gray-200 pb-1 pt-4",children:[i.jsxs("div",{className:"px-4",children:[i.jsx("div",{className:"text-base font-medium text-gray-800",children:r.name}),i.jsx("div",{className:"text-sm font-medium text-gray-500",children:r.email})]}),i.jsxs("div",{className:"mt-3 space-y-1",children:[i.jsx(L,{href:route("profile.edit"),children:"Profile"}),i.jsx(L,{method:"post",href:route("logout"),as:"button",children:"Log Out"})]})]})]})]}),i.jsx(We,{position:"top-right"}),e&&i.jsx("header",{className:"bg-white shadow",children:i.jsx("div",{className:"mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8",children:e})}),i.jsx("main",{children:t})]})}export{Ye as A,Ue as z};
