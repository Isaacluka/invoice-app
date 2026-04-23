import { useState, useEffect, useRef } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const generateId = () => {
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return L[Math.floor(Math.random()*26)] + L[Math.floor(Math.random()*26)] + String(Math.floor(Math.random()*9000)+1000);
};
const formatDate = (d) => { if (!d) return ""; return new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x.toISOString().split("T")[0]; };
const TERMS = { "Net 1 Day":1, "Net 7 Days":7, "Net 14 Days":14, "Net 30 Days":30 };
const calcTotal = (items) => items.reduce((s,i) => s+(parseFloat(i.price)||0)*(parseInt(i.qty)||0), 0);
const fmtMoney = (n) => n.toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2});

const useBreakpoint = () => {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    return window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
  });
  useEffect(() => {
    const h = () => setBp(window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop");
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return bp;
};

const SAMPLE = [
  { id:"RT3080", status:"paid",    invoiceDate:"2021-08-01", paymentTerms:"Net 30 Days", description:"Graphic Design",   billFrom:{street:"19 Union Terrace",city:"London",   postCode:"E1 3EZ",  country:"United Kingdom"}, billTo:{name:"Jensen Huang",   email:"jensenh@mail.com",           street:"106 Kendell Street",city:"Sharrington",postCode:"NR24 5WQ",country:"United Kingdom"}, items:[{name:"Banner Design",qty:1,price:156},{name:"Email Design",qty:2,price:200}] },
  { id:"XM9141", status:"pending", invoiceDate:"2021-08-21", paymentTerms:"Net 30 Days", description:"Graphic Design",   billFrom:{street:"19 Union Terrace",city:"London",   postCode:"E1 3EZ",  country:"United Kingdom"}, billTo:{name:"Alex Grim",      email:"alexgrim@mail.com",           street:"84 Church Way",    city:"Bradford",  postCode:"BD1 9PB", country:"United Kingdom"}, items:[{name:"Banner Design",qty:1,price:156},{name:"Email Design",qty:2,price:200}] },
  { id:"RG0314", status:"paid",    invoiceDate:"2021-09-01", paymentTerms:"Net 30 Days", description:"Website Redesign", billFrom:{street:"19 Union Terrace",city:"London",   postCode:"E1 3EZ",  country:"United Kingdom"}, billTo:{name:"John Morrison",  email:"jm@myco.com",                 street:"79 Park Lane",     city:"Manchester",postCode:"M1 7LT",  country:"United Kingdom"}, items:[{name:"Website Redesign",qty:1,price:14002.33}] },
  { id:"RT2080", status:"pending", invoiceDate:"2021-09-12", paymentTerms:"Net 30 Days", description:"Logo Redesign",    billFrom:{street:"19 Union Terrace",city:"London",   postCode:"E1 3EZ",  country:"United Kingdom"}, billTo:{name:"Alysa Werner",   email:"alysa@email.co.uk",           street:"63 Warwick Road",  city:"Carlisle",  postCode:"CA20 2TU",country:"United Kingdom"}, items:[{name:"Logo Redesign",qty:1,price:102.04}] },
  { id:"AA1449", status:"pending", invoiceDate:"2021-09-14", paymentTerms:"Net 30 Days", description:"Re-branding",      billFrom:{street:"19 Union Terrace",city:"London",   postCode:"E1 3EZ",  country:"United Kingdom"}, billTo:{name:"Mellisa Clarke", email:"mellisa.clarke@exampleco.com",street:"46 Abbey Row",     city:"Cambridge", postCode:"CB5 6EG", country:"United Kingdom"}, items:[{name:"Brand Guidelines",qty:1,price:1666},{name:"Logo Design",qty:1,price:1500},{name:"Business Cards",qty:1,price:866.33}] },
  { id:"TY9141", status:"pending", invoiceDate:"2021-10-01", paymentTerms:"Net 30 Days", description:"UI/UX Design",     billFrom:{street:"19 Union Terrace",city:"London",   postCode:"E1 3EZ",  country:"United Kingdom"}, billTo:{name:"Thomas Wayne",   email:"thomas@dc.com",               street:"3964 Queens Lane", city:"Gotham",    postCode:"60457",   country:"United States"}, items:[{name:"Design System",qty:1,price:3155.91},{name:"Prototype",qty:1,price:3000}] },
  { id:"FV2353", status:"draft",   invoiceDate:"2021-11-12", paymentTerms:"Net 30 Days", description:"Logo Re-design",   billFrom:{street:"19 Union Terrace",city:"London",   postCode:"E1 3EZ",  country:"United Kingdom"}, billTo:{name:"Anita Wainwright",email:"",street:"",city:"",postCode:"",country:""}, items:[{name:"Logo Redesign",qty:1,price:3102.04}] },
];

const C = { purple:"#7C5DFA", purpleL:"#9277FF", danger:"#EC5757", dangerH:"#FF9797", paid:"#33D69F", pending:"#FF8F00" };

// ─── Global CSS ───────────────────────────────────────────────────────────────
const GStyle = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'League Spartan',sans-serif;background:${dark?"#141625":"#F8F8FB"};color:${dark?"#fff":"#0C0E16"};min-height:100vh;transition:background .3s,color .3s;}
    input,select,textarea{font-family:'League Spartan',sans-serif;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-thumb{background:${dark?"#252945":"#DFE3FA"};border-radius:3px;}
    *{transition:background-color .2s,color .2s,border-color .2s;}
  `}</style>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const Badge = ({ status, dark }) => {
  const m = { paid:{c:C.paid,bg:"rgba(51,214,159,.07)"}, pending:{c:C.pending,bg:"rgba(255,143,0,.07)"}, draft:{c:dark?"#DFE3FA":"#373B53",bg:dark?"rgba(223,227,250,.06)":"rgba(55,59,83,.06)"} };
  const { c, bg } = m[status]||m.draft;
  return <span style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:6,background:bg,color:c,fontWeight:700,fontSize:12,minWidth:100,justifyContent:"center"}}>
    <span style={{width:8,height:8,borderRadius:"50%",background:c,flexShrink:0}}/>{status.charAt(0).toUpperCase()+status.slice(1)}
  </span>;
};

// ─── Button ───────────────────────────────────────────────────────────────────
const Btn = ({ variant="primary", onClick, children, dark, disabled }) => {
  const [h, setH] = useState(false);
  const s = { primary:{bg:h?C.purpleL:C.purple,c:"#fff"}, secondary:{bg:h?(dark?"#252945":"#DFE3FA"):(dark?"#252945":"#F9FAFE"),c:h?(dark?"#fff":C.purple):(dark?"#DFE3FA":"#7E88C3")}, draft:{bg:h?"#0C0E16":"#373B53",c:"#888EB0"}, danger:{bg:h?C.dangerH:C.danger,c:"#fff"} }[variant]||{};
  return <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{padding:"14px 22px",borderRadius:24,background:s.bg,color:s.c,border:"none",cursor:disabled?"not-allowed":"pointer",fontSize:12,fontWeight:700,letterSpacing:.25,opacity:disabled?.5:1,whiteSpace:"nowrap"}}>
    {children}
  </button>;
};

// ─── Form Input ───────────────────────────────────────────────────────────────
const FInput = ({ label, id, error, dark, ...props }) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <label htmlFor={id} style={{fontSize:12,fontWeight:500,color:error?C.danger:(dark?"#888EB0":"#7E88C3")}}>{label}</label>
      {error && <span style={{fontSize:10,color:C.danger,fontWeight:500}}>{error}</span>}
    </div>
    <input id={id} {...props}
      style={{background:dark?"#1E2139":"#fff",border:`1px solid ${error?C.danger:(dark?"#252945":"#DFE3FA")}`,borderRadius:4,padding:"14px 16px",fontSize:12,fontWeight:700,color:dark?"#fff":"#0C0E16",outline:"none",width:"100%"}}
      onFocus={e=>e.target.style.borderColor=C.purple}
      onBlur={e=>e.target.style.borderColor=error?C.danger:(dark?"#252945":"#DFE3FA")}/>
  </div>
);

// ─── Form Select ──────────────────────────────────────────────────────────────
const FSelect = ({ label, id, value, onChange, options, dark }) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    <label htmlFor={id} style={{fontSize:12,fontWeight:500,color:dark?"#888EB0":"#7E88C3"}}>{label}</label>
    <div style={{position:"relative"}}>
      <select id={id} value={value} onChange={onChange}
        style={{background:dark?"#1E2139":"#fff",border:`1px solid ${dark?"#252945":"#DFE3FA"}`,borderRadius:4,padding:"14px 16px",fontSize:12,fontWeight:700,color:dark?"#fff":"#0C0E16",width:"100%",appearance:"none",cursor:"pointer",outline:"none"}}
        onFocus={e=>e.target.style.borderColor=C.purple} onBlur={e=>e.target.style.borderColor=dark?"#252945":"#DFE3FA"}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
      <svg style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} width="11" height="7" viewBox="0 0 11 7" fill="none">
        <path d="M1 1l4.5 4.5L10 1" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ id, dark, onCancel, onConfirm }) => {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if(e.key==="Escape") onCancel(); };
    document.addEventListener("keydown", h);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);
  return (
    <div onClick={onCancel} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:24}}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}
        style={{background:dark?"#252945":"#fff",borderRadius:8,padding:48,maxWidth:480,width:"100%",boxShadow:"0 10px 20px rgba(0,0,0,.25)"}}>
        <h2 style={{fontSize:24,fontWeight:700,marginBottom:12,color:dark?"#fff":"#0C0E16"}}>Confirm Deletion</h2>
        <p style={{fontSize:13,color:dark?"#DFE3FA":"#888EB0",marginBottom:24,lineHeight:1.7}}>
          Are you sure you want to delete invoice #{id}? This action cannot be undone.
        </p>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn variant="secondary" dark={dark} onClick={onCancel}>Cancel</Btn>
          <Btn variant="danger" dark={dark} onClick={onConfirm}>Delete</Btn>
        </div>
      </div>
    </div>
  );
};

// ─── Filter ───────────────────────────────────────────────────────────────────
const FilterBtn = ({ dark, selected, onChange, mobile }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = o => onChange(selected.includes(o)?selected.filter(s=>s!==o):[...selected,o]);
  return (
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:700,color:dark?"#fff":"#0C0E16"}}>
        {mobile?"Filter":"Filter by status"}
        <svg style={{transform:open?"rotate(180deg)":"none",transition:"transform .2s"}} width="11" height="7" viewBox="0 0 11 7" fill="none">
          <path d="M1 1l4.5 4.5L10 1" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{position:"absolute",top:"calc(100% + 16px)",left:"50%",transform:"translateX(-50%)",background:dark?"#252945":"#fff",borderRadius:8,padding:24,boxShadow:"0 10px 20px rgba(0,0,0,.25)",zIndex:50,minWidth:192}}>
          {["draft","pending","paid"].map((o,i)=>(
            <label key={o} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:i<2?16:0,fontSize:12,fontWeight:700,color:dark?"#fff":"#0C0E16"}}>
              <input type="checkbox" checked={selected.includes(o)} onChange={()=>toggle(o)} style={{width:16,height:16,accentColor:C.purple,cursor:"pointer"}}/>
              {o.charAt(0).toUpperCase()+o.slice(1)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Invoice Form ─────────────────────────────────────────────────────────────
const InvoiceForm = ({ dark, onClose, onSave, editInvoice, bp }) => {
  const isEdit = !!editInvoice;
  const empty = {billFrom:{street:"",city:"",postCode:"",country:""},billTo:{name:"",email:"",street:"",city:"",postCode:"",country:""},invoiceDate:new Date().toISOString().split("T")[0],paymentTerms:"Net 30 Days",description:"",items:[]};
  const [form, setForm] = useState(isEdit?{billFrom:{...editInvoice.billFrom},billTo:{...editInvoice.billTo},invoiceDate:editInvoice.invoiceDate,paymentTerms:editInvoice.paymentTerms,description:editInvoice.description,items:editInvoice.items.map(i=>({...i}))}:empty);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const isMobile = bp==="mobile";
  const isDesktop = bp==="desktop";

  useEffect(()=>{ requestAnimationFrame(()=>setVisible(true)); },[]);

  const handleClose = () => { setVisible(false); setTimeout(onClose,300); };
  const sf = (sec,k,v) => setForm(f=>({...f,[sec]:{...f[sec],[k]:v}}));

  const validate = () => {
    const e = {};
    if(!form.billTo.name) e["billTo.name"]="can't be empty";
    if(!form.billTo.email) e["billTo.email"]="can't be empty";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.billTo.email)) e["billTo.email"]="invalid";
    if(!form.billFrom.street) e["billFrom.street"]="can't be empty";
    if(!form.description) e["description"]="can't be empty";
    if(form.items.length===0) e["items"]="Add at least one item";
    form.items.forEach((item,i)=>{
      if(!item.name) e[`i${i}n`]="can't be empty";
      if(!item.qty||item.qty<=0) e[`i${i}q`]="!";
      if(item.price<0) e[`i${i}p`]="!";
    });
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleSend = () => { if(!validate()) return; onSave({...form,status:isEdit?editInvoice.status:"pending"}); };
  const handleDraft = () => onSave({...form,status:"draft"});

  // Mobile: full-page; Tablet/Desktop: drawer
  const containerStyle = isMobile ? {
    position:"fixed",inset:0,background:dark?"#141625":"#F8F8FB",zIndex:300,display:"flex",flexDirection:"column",overflowY:"auto"
  } : {
    position:"fixed",
    left:isDesktop?80:0,
    top:isDesktop?0:72,
    bottom:0,
    width:isDesktop?"min(616px,calc(100vw - 80px))":"min(616px,80vw)",
    background:dark?"#141625":"#F8F8FB",
    boxShadow:"10px 0 60px rgba(0,0,0,.3)",
    transform:visible?"translateX(0)":"translateX(-100%)",
    transition:"transform .3s ease",
    display:"flex",flexDirection:"column",zIndex:300,
    borderRadius:"0 20px 20px 0",
  };

  const hPad = isMobile?"24px 24px 0":isDesktop?"56px 56px 0":"32px 56px 0";
  const bPad = isMobile?"24px":"32px 56px";

  const itemRows = form.items.map((item,i)=>{
    const tot=(parseFloat(item.price)||0)*(parseInt(item.qty)||0);
    return (
      <div key={i} style={{marginBottom:20}}>
        <FInput label="Item Name" id={`iname${i}`} dark={dark} value={item.name} error={errors[`i${i}n`]}
          onChange={e=>setForm(f=>({...f,items:f.items.map((x,j)=>j===i?{...x,name:e.target.value}:x)}))}/>
        <div style={{display:"grid",gridTemplateColumns:"72px 1fr 80px 24px",gap:12,marginTop:12,alignItems:"end"}}>
          <FInput label="Qty." id={`qty${i}`} type="number" dark={dark} value={item.qty} min="1" error={errors[`i${i}q`]}
            onChange={e=>setForm(f=>({...f,items:f.items.map((x,j)=>j===i?{...x,qty:e.target.value}:x)}))}/>
          <FInput label="Price" id={`pr${i}`} type="number" dark={dark} value={item.price} min="0" step="0.01" error={errors[`i${i}p`]}
            onChange={e=>setForm(f=>({...f,items:f.items.map((x,j)=>j===i?{...x,price:e.target.value}:x)}))}/>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <span style={{fontSize:12,color:dark?"#888EB0":"#7E88C3",fontWeight:500}}>Total</span>
            <span style={{fontSize:12,fontWeight:700,color:"#888EB0",paddingTop:14}}>{tot.toFixed(2)}</span>
          </div>
          <button onClick={()=>setForm(f=>({...f,items:f.items.filter((_,j)=>j!==i)}))} aria-label="Remove item"
            style={{background:"none",border:"none",cursor:"pointer",padding:"0 0 14px",display:"flex",alignItems:"flex-end"}}>
            <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
              <path d="M11.583 3.556h-2.334V2.667C9.25 1.194 8.284 0 7 0H6C4.716 0 3.75 1.194 3.75 2.667v.889H1.417C.634 3.556 0 4.19 0 4.972v.695c0 .35.284.639.633.639h11.734c.35 0 .633-.288.633-.64v-.694c0-.782-.634-1.416-1.417-1.416zM4.917 2.667C4.917 1.894 5.402 1.111 6 1.111h1c.598 0 1.083.783 1.083 1.556v.889H4.917v-.889zM1.917 6.667l.917 7.555c.1.878.783 1.556 1.583 1.556H8.75c.8 0 1.483-.678 1.583-1.556l.917-7.555H1.917z" fill="#888EB0"/>
            </svg>
          </button>
        </div>
      </div>
    );
  });

  const footerBtns = !isEdit ? (
    <><Btn variant="secondary" dark={dark} onClick={handleClose}>Discard</Btn><div style={{flex:1}}/><Btn variant="draft" dark={dark} onClick={handleDraft}>Save as Draft</Btn><Btn variant="primary" dark={dark} onClick={handleSend}>Save &amp; Send</Btn></>
  ) : (
    <><div style={{flex:1}}/><Btn variant="secondary" dark={dark} onClick={handleClose}>Cancel</Btn><Btn variant="primary" dark={dark} onClick={handleSend}>Save Changes</Btn></>
  );

  return (
    <>
      {!isMobile && <div onClick={handleClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",opacity:visible?1:0,transition:"opacity .3s",zIndex:299}} aria-hidden="true"/>}
      <div style={containerStyle} role="dialog" aria-modal="true">
        <div style={{padding:hPad,flexShrink:0}}>
          <button onClick={handleClose} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:24,color:dark?"#fff":"#0C0E16",fontWeight:700,fontSize:12}}>
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M6 1L2 5l4 4" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Go back
          </button>
          <h1 style={{fontSize:24,fontWeight:700}}>{isEdit?<><span style={{color:"#7E88C3"}}>#</span>{editInvoice.id}</>:"New Invoice"}</h1>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:bPad}}>
          <p style={{fontSize:12,fontWeight:700,color:C.purple,marginBottom:20}}>Bill From</p>
          <div style={{display:"grid",gap:18,marginBottom:32}}>
            <FInput label="Street Address" id="fs" dark={dark} value={form.billFrom.street} error={errors["billFrom.street"]} onChange={e=>sf("billFrom","street",e.target.value)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <FInput label="City" id="fc" dark={dark} value={form.billFrom.city} onChange={e=>sf("billFrom","city",e.target.value)}/>
              <FInput label="Post Code" id="fp" dark={dark} value={form.billFrom.postCode} onChange={e=>sf("billFrom","postCode",e.target.value)}/>
            </div>
            <FInput label="Country" id="fcountry" dark={dark} value={form.billFrom.country} onChange={e=>sf("billFrom","country",e.target.value)}/>
          </div>

          <p style={{fontSize:12,fontWeight:700,color:C.purple,marginBottom:20}}>Bill To</p>
          <div style={{display:"grid",gap:18,marginBottom:32}}>
            <FInput label="Client's Name" id="tn" dark={dark} value={form.billTo.name} error={errors["billTo.name"]} onChange={e=>sf("billTo","name",e.target.value)}/>
            <FInput label="Client's Email" id="te" type="email" placeholder="e.g. email@example.com" dark={dark} value={form.billTo.email} error={errors["billTo.email"]} onChange={e=>sf("billTo","email",e.target.value)}/>
            <FInput label="Street Address" id="ts" dark={dark} value={form.billTo.street} onChange={e=>sf("billTo","street",e.target.value)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <FInput label="City" id="tcc" dark={dark} value={form.billTo.city} onChange={e=>sf("billTo","city",e.target.value)}/>
              <FInput label="Post Code" id="tpc" dark={dark} value={form.billTo.postCode} onChange={e=>sf("billTo","postCode",e.target.value)}/>
            </div>
            <FInput label="Country" id="tcountry" dark={dark} value={form.billTo.country} onChange={e=>sf("billTo","country",e.target.value)}/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
            <FInput label="Invoice Date" id="date" type="date" dark={dark} value={form.invoiceDate} disabled={isEdit} onChange={e=>setForm(f=>({...f,invoiceDate:e.target.value}))}/>
            <FSelect label="Payment Terms" id="terms" dark={dark} value={form.paymentTerms} onChange={e=>setForm(f=>({...f,paymentTerms:e.target.value}))} options={Object.keys(TERMS)}/>
          </div>
          <div style={{marginBottom:32}}>
            <FInput label="Project Description" id="desc" placeholder="e.g. Graphic Design Service" dark={dark} value={form.description} error={errors["description"]} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
          </div>

          <p style={{fontSize:18,fontWeight:700,color:"#777F98",marginBottom:16}}>Item List</p>
          {errors["items"] && <p style={{color:C.danger,fontSize:12,marginBottom:12}}>{errors["items"]}</p>}
          {itemRows}
          <button onClick={()=>setForm(f=>({...f,items:[...f.items,{name:"",qty:1,price:0}]}))}
            style={{width:"100%",padding:14,background:dark?"#252945":"#F9FAFE",border:"none",borderRadius:24,cursor:"pointer",fontSize:12,fontWeight:700,color:dark?"#888EB0":"#7E88C3",marginBottom:8}}>
            + Add New Item
          </button>
          {Object.keys(errors).length>0 && <p style={{color:C.danger,fontSize:11,marginTop:12,fontWeight:500}}>- All fields must be added</p>}

          {isMobile && (
            <div style={{display:"flex",gap:8,marginTop:24,paddingBottom:32}}>
              {footerBtns}
            </div>
          )}
        </div>

        {!isMobile && (
          <div style={{padding:"20px 56px",background:dark?"#141625":"#F8F8FB",boxShadow:"0 -8px 24px rgba(0,0,0,.08)",display:"flex",gap:8,flexShrink:0}}>
            {footerBtns}
          </div>
        )}
      </div>
    </>
  );
};

// ─── Invoice List Item ────────────────────────────────────────────────────────
const ListItem = ({ invoice, dark, onClick, isMobile }) => {
  const [h, setH] = useState(false);
  const total = calcTotal(invoice.items);
  const due = addDays(invoice.invoiceDate, TERMS[invoice.paymentTerms]||30);

  if (isMobile) {
    return (
      <div onClick={onClick} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onClick()}
        onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{background:dark?"#1E2139":"#fff",borderRadius:8,padding:24,marginBottom:16,cursor:"pointer",border:`1px solid ${h?C.purple:"transparent"}`,boxShadow:dark?"none":"0 10px 10px -10px rgba(72,84,159,.1)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <span style={{fontWeight:700,fontSize:12,color:dark?"#fff":"#0C0E16"}}><span style={{color:"#7E88C3"}}>#</span>{invoice.id}</span>
          <span style={{fontSize:12,color:dark?"#DFE3FA":"#858BB2"}}>{invoice.billTo.name||"—"}</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <div style={{fontSize:11,color:dark?"#DFE3FA":"#888EB0",marginBottom:6}}>Due {formatDate(due)}</div>
            <div style={{fontSize:16,fontWeight:700,color:dark?"#fff":"#0C0E16"}}>£ {fmtMoney(total)}</div>
          </div>
          <Badge status={invoice.status} dark={dark}/>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onClick()}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:dark?"#1E2139":"#fff",borderRadius:8,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",marginBottom:16,border:`1px solid ${h?C.purple:"transparent"}`,boxShadow:dark?"none":"0 10px 10px -10px rgba(72,84,159,.1)"}}>
      <div style={{display:"flex",alignItems:"center",gap:32,flex:1}}>
        <span style={{fontWeight:700,fontSize:12,color:dark?"#fff":"#0C0E16",minWidth:72}}><span style={{color:"#7E88C3"}}>#</span>{invoice.id}</span>
        <span style={{fontSize:12,color:dark?"#DFE3FA":"#888EB0",minWidth:100}}>Due {formatDate(due)}</span>
        <span style={{fontSize:12,color:dark?"#DFE3FA":"#858BB2"}}>{invoice.billTo.name||"—"}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:32}}>
        <span style={{fontWeight:700,fontSize:16,color:dark?"#fff":"#0C0E16",minWidth:100,textAlign:"right"}}>£ {fmtMoney(total)}</span>
        <Badge status={invoice.status} dark={dark}/>
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M1 1l4 4-4 4" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const Empty = ({ dark }) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:60}}>
    <svg width="196" height="160" viewBox="0 0 196 160" fill="none" style={{marginBottom:32}}>
      <ellipse cx="98" cy="88" rx="98" ry="72" fill={dark?"#252945":"#F0F0F8"}/>
      <rect x="53" y="78" width="90" height="55" rx="4" fill={dark?"#1E2139":"#fff"} stroke={dark?"#252945":"#DFE3FA"} strokeWidth="1.5"/>
      <path d="M53 82l45 28 45-28" stroke={dark?"#252945":"#DFE3FA"} strokeWidth="1.5" fill="none"/>
      <circle cx="98" cy="66" r="14" fill={C.purple} opacity=".9"/>
      <path d="M106 60l12-6v20l-12-6z" fill="white" opacity=".9"/>
      <rect x="100" y="59" width="7" height="14" rx="2" fill="white" opacity=".9"/>
      <rect x="28" y="48" width="20" height="14" rx="2" fill="none" stroke={dark?"#494E6E":"#DFE3FA"} strokeWidth="1.2"/>
      <path d="M28 50l10 7 10-7" stroke={dark?"#494E6E":"#DFE3FA"} strokeWidth="1.2" fill="none"/>
      <rect x="148" y="53" width="18" height="13" rx="2" fill="none" stroke={dark?"#494E6E":"#DFE3FA"} strokeWidth="1.2"/>
      <path d="M148 55l9 6 9-6" stroke={dark?"#494E6E":"#DFE3FA"} strokeWidth="1.2" fill="none"/>
    </svg>
    <h2 style={{fontSize:20,fontWeight:700,marginBottom:12,color:dark?"#fff":"#0C0E16"}}>There is nothing here</h2>
    <p style={{fontSize:13,color:dark?"#DFE3FA":"#888EB0",textAlign:"center",maxWidth:220,lineHeight:1.7}}>
      Create an invoice by clicking the <strong style={{color:dark?"#fff":"#0C0E16"}}>New Invoice</strong> button and get started
    </p>
  </div>
);

// ─── Invoice Detail ───────────────────────────────────────────────────────────
const Detail = ({ invoice, dark, onBack, onEdit, onDelete, onMarkPaid, bp }) => {
  const [showDel, setShowDel] = useState(false);
  const total = calcTotal(invoice.items);
  const due = addDays(invoice.invoiceDate, TERMS[invoice.paymentTerms]||30);
  const isMobile = bp==="mobile";

  const card = {background:dark?"#1E2139":"#fff",borderRadius:8,padding:isMobile?24:40,marginBottom:24,boxShadow:dark?"none":"0 10px 10px -10px rgba(72,84,159,.1)"};
  const lbl = {fontSize:12,color:dark?"#DFE3FA":"#7E88C3",marginBottom:8};
  const val = {fontSize:14,fontWeight:700,color:dark?"#fff":"#0C0E16"};

  const actions = <>
    <Btn variant="secondary" dark={dark} onClick={onEdit}>Edit</Btn>
    <Btn variant="danger" dark={dark} onClick={()=>setShowDel(true)}>Delete</Btn>
    {invoice.status!=="paid" && <Btn variant="primary" dark={dark} onClick={onMarkPaid}>Mark as Paid</Btn>}
  </>;

  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:isMobile?"24px 24px 120px":"48px 24px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:12,marginBottom:32,color:dark?"#fff":"#0C0E16",fontWeight:700,fontSize:12}}>
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none"><path d="M6 1L2 5l4 4" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Go back
      </button>

      <div style={{...card,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <span style={{fontSize:12,color:dark?"#DFE3FA":"#858BB2"}}>Status</span>
          <Badge status={invoice.status} dark={dark}/>
        </div>
        {!isMobile && <div style={{display:"flex",gap:8}}>{actions}</div>}
      </div>

      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:dark?"#fff":"#0C0E16",marginBottom:4}}><span style={{color:"#7E88C3"}}>#</span>{invoice.id}</div>
            <div style={{fontSize:12,color:dark?"#DFE3FA":"#7E88C3"}}>{invoice.description}</div>
          </div>
          <div style={{textAlign:isMobile?"left":"right",fontSize:11,color:dark?"#DFE3FA":"#7E88C3",lineHeight:1.8}}>
            <div>{invoice.billFrom.street}</div><div>{invoice.billFrom.city}</div><div>{invoice.billFrom.postCode}</div><div>{invoice.billFrom.country}</div>
          </div>
        </div>

        {isMobile ? (
          <div style={{marginBottom:32}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
              <div>
                <div style={lbl}>Invoice Date</div><div style={val}>{formatDate(invoice.invoiceDate)}</div>
                <div style={{...lbl,marginTop:24}}>Payment Due</div><div style={val}>{formatDate(due)}</div>
              </div>
              <div>
                <div style={lbl}>Bill To</div><div style={val}>{invoice.billTo.name}</div>
                <div style={{fontSize:11,color:dark?"#DFE3FA":"#7E88C3",lineHeight:1.8,marginTop:8}}>
                  <div>{invoice.billTo.street}</div><div>{invoice.billTo.city}</div><div>{invoice.billTo.postCode}</div><div>{invoice.billTo.country}</div>
                </div>
              </div>
            </div>
            <div><div style={lbl}>Sent to</div><div style={val}>{invoice.billTo.email}</div></div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:32,marginBottom:40}}>
            <div>
              <div style={lbl}>Invoice Date</div><div style={val}>{formatDate(invoice.invoiceDate)}</div>
              <div style={{...lbl,marginTop:24}}>Payment Due</div><div style={val}>{formatDate(due)}</div>
            </div>
            <div>
              <div style={lbl}>Bill To</div><div style={val}>{invoice.billTo.name}</div>
              <div style={{fontSize:11,color:dark?"#DFE3FA":"#7E88C3",lineHeight:1.8,marginTop:8}}>
                <div>{invoice.billTo.street}</div><div>{invoice.billTo.city}</div><div>{invoice.billTo.postCode}</div><div>{invoice.billTo.country}</div>
              </div>
            </div>
            <div><div style={lbl}>Sent to</div><div style={val}>{invoice.billTo.email}</div></div>
          </div>
        )}

        <div style={{background:dark?"#252945":"#F9FAFE",borderRadius:"8px 8px 0 0",padding:isMobile?"16px 20px":"24px 32px"}}>
          {isMobile ? invoice.items.map((item,i)=>{
            const t=(parseFloat(item.price)||0)*(parseInt(item.qty)||0);
            return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:i<invoice.items.length-1?16:0}}>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:dark?"#fff":"#0C0E16"}}>{item.name}</div>
                <div style={{fontSize:12,color:dark?"#888EB0":"#7E88C3",marginTop:4}}>{item.qty} x £ {parseFloat(item.price).toFixed(2)}</div>
              </div>
              <span style={{fontWeight:700,fontSize:13,color:dark?"#fff":"#0C0E16"}}>£ {t.toFixed(2)}</span>
            </div>;
          }) : (<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 80px 100px 100px",marginBottom:24}}>
              {["Item Name","QTY.","Price","Total"].map((h,i)=>(
                <span key={h} style={{fontSize:11,color:dark?"#DFE3FA":"#7E88C3",textAlign:i>0?"right":"left"}}>{h}</span>
              ))}
            </div>
            {invoice.items.map((item,i)=>{
              const t=(parseFloat(item.price)||0)*(parseInt(item.qty)||0);
              return <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px 100px 100px",marginBottom:i<invoice.items.length-1?16:0}}>
                <span style={{fontWeight:700,fontSize:13,color:dark?"#fff":"#0C0E16"}}>{item.name}</span>
                <span style={{textAlign:"right",fontSize:13,fontWeight:700,color:dark?"#DFE3FA":"#7E88C3"}}>{item.qty}</span>
                <span style={{textAlign:"right",fontSize:13,fontWeight:700,color:dark?"#DFE3FA":"#7E88C3"}}>£ {parseFloat(item.price).toFixed(2)}</span>
                <span style={{textAlign:"right",fontSize:13,fontWeight:700,color:dark?"#fff":"#0C0E16"}}>£ {t.toFixed(2)}</span>
              </div>;
            })}
          </>)}
        </div>
        <div style={{background:dark?"#0C0E16":"#373B53",borderRadius:"0 0 8px 8px",padding:isMobile?"20px":"24px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:"#fff"}}>Amount Due</span>
          <span style={{fontSize:isMobile?20:24,fontWeight:700,color:"#fff"}}>£ {fmtMoney(total)}</span>
        </div>
      </div>

      {isMobile && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:dark?"#1E2139":"#fff",padding:"16px 24px",display:"flex",gap:8,justifyContent:"flex-end",boxShadow:"0 -8px 24px rgba(0,0,0,.1)",zIndex:50}}>
          {actions}
        </div>
      )}

      {showDel && <DeleteModal id={invoice.id} dark={dark} onCancel={()=>setShowDel(false)} onConfirm={onDelete}/>}
    </div>
  );
};

// ─── Navbar (mobile/tablet) ───────────────────────────────────────────────────
const Navbar = ({ dark, onToggle }) => (
  <nav style={{position:"fixed",top:0,left:0,right:0,height:72,background:"#1E2139",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:100}}>
    <div style={{width:72,height:72,background:C.purple,borderRadius:"0 20px 20px 0",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0}}>
      <div style={{position:"absolute",bottom:0,left:0,width:"100%",height:"50%",background:C.purpleL,borderRadius:"20px 0 0 0"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <svg width="22" height="20" viewBox="0 0 28 26" fill="none">
          <path d="M20.513 0H7.487C6.5 0 5.598.603 5.234 1.522L0 13l5.234 11.478C5.598 25.397 6.5 26 7.487 26h13.026c.987 0 1.889-.603 2.253-1.522L28 13 22.766 1.522C22.402.603 21.5 0 20.513 0z" fill="#7C5DFA"/>
          <path d="M14 5.5C10.686 5.5 8 8.186 8 11.5s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 9a3 3 0 110-6 3 3 0 010 6z" fill="white"/>
        </svg>
      </div>
    </div>
    <div style={{display:"flex",alignItems:"center",height:"100%"}}>
      <button onClick={onToggle} aria-label="Toggle dark mode" style={{background:"none",border:"none",cursor:"pointer",padding:"0 24px",height:"100%",display:"flex",alignItems:"center"}}>
        {dark?(<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke="#858BB2" strokeWidth="1.5"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round"/></svg>)
        :(<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M19 10.79A9 9 0 1 1 9.21 1a7 7 0 0 0 9.79 9.79z" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
      </button>
      <div style={{width:1,height:"100%",background:"#494E6E"}}/>
      <div style={{padding:"0 24px",display:"flex",alignItems:"center"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#7C5DFA,#9277FF)",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #858BB2",cursor:"pointer"}}>
          <span style={{fontSize:12,fontWeight:700,color:"white"}}>JD</span>
        </div>
      </div>
    </div>
  </nav>
);

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
const Sidebar = ({ dark, onToggle }) => (
  <nav style={{width:80,height:"100vh",background:"#1E2139",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",position:"fixed",left:0,top:0,zIndex:100,borderRadius:"0 20px 20px 0"}}>
    <div style={{width:80,height:80,background:C.purple,borderRadius:"0 20px 20px 0",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0}}>
      <div style={{position:"absolute",bottom:0,left:0,width:"100%",height:"50%",background:C.purpleL,borderRadius:"20px 0 0 0"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <svg width="28" height="26" viewBox="0 0 28 26" fill="none">
          <path d="M20.513 0H7.487C6.5 0 5.598.603 5.234 1.522L0 13l5.234 11.478C5.598 25.397 6.5 26 7.487 26h13.026c.987 0 1.889-.603 2.253-1.522L28 13 22.766 1.522C22.402.603 21.5 0 20.513 0z" fill="#7C5DFA"/>
          <path d="M14 5.5C10.686 5.5 8 8.186 8 11.5s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 9a3 3 0 110-6 3 3 0 010 6z" fill="white"/>
        </svg>
      </div>
    </div>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,paddingBottom:24}}>
      <button onClick={onToggle} aria-label="Toggle dark mode" style={{background:"none",border:"none",cursor:"pointer",padding:8,borderRadius:8}}>
        {dark?(<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke="#858BB2" strokeWidth="1.5"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round"/></svg>)
        :(<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M19 10.79A9 9 0 1 1 9.21 1a7 7 0 0 0 9.79 9.79z" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
      </button>
      <div style={{width:64,height:1,background:"#494E6E"}}/>
      <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#7C5DFA,#9277FF)",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #858BB2",cursor:"pointer"}}>
        <span style={{fontSize:14,fontWeight:700,color:"white"}}>JD</span>
      </div>
    </div>
  </nav>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const bp = useBreakpoint();
  const isMobile = bp==="mobile";
  const isDesktop = bp==="desktop";

  const [dark, setDark] = useState(()=>{ try{return localStorage.getItem("theme")==="dark";}catch{return false;} });
  const [invoices, setInvoices] = useState(()=>{ try{const s=localStorage.getItem("invoices");return s?JSON.parse(s):SAMPLE;}catch{return SAMPLE;} });
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [filter, setFilter] = useState([]);

  useEffect(()=>{ try{localStorage.setItem("invoices",JSON.stringify(invoices));}catch{} },[invoices]);
  useEffect(()=>{ try{localStorage.setItem("theme",dark?"dark":"light");}catch{} },[dark]);

  const selected = invoices.find(i=>i.id===selectedId);
  const filtered = filter.length===0?invoices:invoices.filter(i=>filter.includes(i.status));

  const handleSave = (data) => {
    if(editInvoice){ setInvoices(p=>p.map(inv=>inv.id===editInvoice.id?{...inv,...data}:inv)); }
    else { setInvoices(p=>[...p,{id:generateId(),...data}]); }
    setShowForm(false); setEditInvoice(null);
  };
  const handleDelete = () => { setInvoices(p=>p.filter(i=>i.id!==selectedId)); setView("list"); setSelectedId(null); };
  const handleMarkPaid = () => setInvoices(p=>p.map(i=>i.id===selectedId?{...i,status:"paid"}:i));
  const handleEdit = () => { setEditInvoice(selected); setShowForm(true); };

  const navH = isDesktop?0:72;
  const leftW = isDesktop?80:0;

  return (
    <>
      <GStyle dark={dark}/>
      {isDesktop ? <Sidebar dark={dark} onToggle={()=>setDark(d=>!d)}/> : <Navbar dark={dark} onToggle={()=>setDark(d=>!d)}/>}

      <main style={{marginLeft:leftW,marginTop:navH,minHeight:`calc(100vh - ${navH}px)`,padding:isMobile?"32px 24px":isDesktop?"48px 40px":"40px 48px",maxWidth:`calc(100vw - ${leftW}px)`}}>
        {view==="list" ? (
          <div style={{maxWidth:720,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:isMobile?32:48}}>
              <div>
                <h1 style={{fontSize:isMobile?24:32,fontWeight:800,color:dark?"#fff":"#0C0E16",letterSpacing:-.5}}>Invoices</h1>
                <p style={{fontSize:12,color:dark?"#DFE3FA":"#888EB0",marginTop:4}}>{filtered.length===0?"No invoices":`There are ${filtered.length} total invoice${filtered.length!==1?"s":""}`}</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:isMobile?16:32}}>
                <FilterBtn dark={dark} selected={filter} onChange={setFilter} mobile={isMobile}/>
                <button onClick={()=>{setEditInvoice(null);setShowForm(true);}}
                  style={{background:C.purple,border:"none",borderRadius:24,padding:isMobile?"8px 12px 8px 8px":"8px 16px 8px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,color:"#fff",fontWeight:700,fontSize:12,fontFamily:"League Spartan,sans-serif"}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.purpleL}
                  onMouseLeave={e=>e.currentTarget.style.background=C.purple}>
                  <span style={{width:32,height:32,background:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 0v11M0 5.5h11" stroke={C.purple} strokeWidth="2" strokeLinecap="round"/></svg>
                  </span>
                  {isMobile?"New":"New Invoice"}
                </button>
              </div>
            </div>
            {filtered.length===0?<Empty dark={dark}/>:filtered.map(inv=>(
              <ListItem key={inv.id} invoice={inv} dark={dark} isMobile={isMobile} onClick={()=>{setSelectedId(inv.id);setView("detail");}}/>
            ))}
          </div>
        ) : (
          selected && <Detail invoice={selected} dark={dark} bp={bp}
            onBack={()=>{setView("list");setSelectedId(null);}}
            onEdit={handleEdit} onDelete={handleDelete} onMarkPaid={handleMarkPaid}/>
        )}
      </main>

      {showForm && <InvoiceForm dark={dark} bp={bp} onClose={()=>{setShowForm(false);setEditInvoice(null);}} onSave={handleSave} editInvoice={editInvoice}/>}
    </>
  );
}
