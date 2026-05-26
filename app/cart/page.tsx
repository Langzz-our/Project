"use client";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, Star, ArrowRight, Zap, Shield, Truck, Heart, Menu, X, ChevronDown, Sparkles } from "lucide-react";

const PRODUCTS = [
  { id:"1", name:"Obsidian Chronograph", slug:"obsidian-chronograph", price:"4250000", comparePrice:"5500000", image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", featured:true, category:"Fashion" },
  { id:"2", name:"Noir Leather Tote", slug:"noir-leather-tote", price:"1890000", comparePrice:null, image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", featured:true, category:"Fashion" },
  { id:"3", name:"Phantom ANC Pro", slug:"phantom-anc-pro", price:"3200000", comparePrice:"3800000", image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", featured:true, category:"Elektronik" },
  { id:"4", name:"Studio Desk Lamp", slug:"studio-desk-lamp", price:"890000", comparePrice:null, image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", featured:false, category:"Home" },
  { id:"5", name:"Glacier Skincare Set", slug:"glacier-skincare-set", price:"1450000", comparePrice:"1750000", image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80", featured:true, category:"Beauty" },
  { id:"6", name:"Merino Cashmere Coat", slug:"merino-cashmere-coat", price:"6750000", comparePrice:"8200000", image:"https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80", featured:true, category:"Fashion" },
];

const CATEGORIES = ["Semua","Fashion","Elektronik","Beauty","Home"];
const fmt = (p) => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(p));
const disc = (p,c) => Math.round((1-Number(p)/Number(c))*100);

// ── Global Cart State ─────────────────────────────────────────
let _cart=[], _listeners=[];
const cart = {
  get:()=>_cart,
  total:()=>_cart.reduce((s,i)=>s+i.qty,0),
  add:(item)=>{
    const idx=_cart.findIndex(i=>i.id===item.id);
    _cart=idx>-1?_cart.map((i,n)=>n===idx?{...i,qty:i.qty+1}:i):[..._cart,{...item,qty:1}];
    _listeners.forEach(fn=>fn([..._cart]));
  },
  sub:(fn)=>{_listeners.push(fn);return()=>{_listeners=_listeners.filter(f=>f!==fn);};}
};
function useCart(){
  const[items,setItems]=useState([]);
  useEffect(()=>cart.sub(setItems),[]);
  return{items,add:cart.add,total:cart.total};
}

// ── useInView ─────────────────────────────────────────────────
function useInView(t=0.15){
  const ref=useRef(null);
  const[v,setV]=useState(false);
  useEffect(()=>{
    const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);o.disconnect();}},{threshold:t});
    if(ref.current)o.observe(ref.current);
    return()=>o.disconnect();
  },[]);
  return{ref,visible:v};
}

// ══════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════
function Navbar(){
  const[scrolled,setScrolled]=useState(false);
  const[open,setOpen]=useState(false);
  const{total}=useCart();

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>50);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  return(<>
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:scrolled?"10px 20px":"20px 20px",background:scrolled?"rgba(5,5,5,0.95)":"transparent",backdropFilter:scrolled?"blur(24px)":"none",borderBottom:scrolled?"1px solid rgba(255,255,255,0.06)":"none",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.5s"}}>
      {/* Logo */}
      <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
        <div style={{width:34,height:34,background:"linear-gradient(135deg,#fbbf24,#d97706)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px rgba(251,191,36,0.3)"}}>
          <span style={{color:"#000",fontWeight:900,fontSize:16}}>L</span>
        </div>
        <span style={{color:"#fff",fontWeight:700,letterSpacing:"0.18em",fontSize:13,textTransform:"uppercase"}}>LUXE</span>
      </a>

      {/* Actions */}
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <button style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",display:"flex",padding:4}}>
          <Search size={18}/>
        </button>

        {/* Cart Icon → link ke /cart */}
        <a href="/cart" style={{position:"relative",color:"rgba(255,255,255,0.5)",display:"flex",padding:4,textDecoration:"none"}}>
          <ShoppingBag size={18}/>
          {total()>0&&(
            <span style={{position:"absolute",top:-6,right:-6,width:18,height:18,background:"#fbbf24",color:"#000",fontSize:9,fontWeight:800,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",animation:"cartBounce 0.3s ease"}}>
              {total()}
            </span>
          )}
        </a>

        <button onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.6)",display:"flex",padding:4}}>
          {open?<X size={20}/>:<Menu size={20}/>}
        </button>
      </div>
    </nav>

    {/* Mobile Fullscreen Menu */}
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:90,background:"rgba(5,5,5,0.98)",backdropFilter:"blur(24px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32,transform:open?"translateX(0)":"translateX(100%)",transition:"transform 0.4s cubic-bezier(0.4,0,0.2,1)"}}>
      {["Koleksi","Kategori","Tentang","Blog"].map(item=>(
        <a key={item} href="#" onClick={()=>setOpen(false)} style={{color:"rgba(255,255,255,0.7)",fontSize:28,fontWeight:700,textDecoration:"none"}}>{item}</a>
      ))}
      <a href="/cart" onClick={()=>setOpen(false)} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 28px",background:"linear-gradient(135deg,#fbbf24,#f59e0b)",color:"#000",fontWeight:700,fontSize:15,borderRadius:99,textDecoration:"none",marginTop:8}}>
        <ShoppingBag size={16}/> Keranjang {total()>0&&`(${total()})`}
      </a>
    </div>
  </>);
}

// ══════════════════════════════════════════════════════════════
// HERO
// ══════════════════════════════════════════════════════════════
function Hero(){
  const[v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),200);},[]);
  return(
    <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#060606",position:"relative",overflow:"hidden",padding:"100px 24px 60px"}}>
      <div style={{position:"absolute",top:"10%",right:"-10%",width:300,height:300,borderRadius:"50%",background:"rgba(251,191,36,0.07)",filter:"blur(80px)",animation:"pulse1 6s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"15%",left:"-10%",width:260,height:260,borderRadius:"50%",background:"rgba(99,102,241,0.06)",filter:"blur(80px)",animation:"pulse2 8s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}}/>

      <div style={{position:"relative",textAlign:"center",maxWidth:520,opacity:v?1:0,transform:v?"translateY(0)":"translateY(30px)",transition:"all 1s cubic-bezier(0.4,0,0.2,1)"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:99,border:"1px solid rgba(251,191,36,0.25)",background:"rgba(251,191,36,0.06)",marginBottom:28}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#fbbf24",boxShadow:"0 0 8px #fbbf24",animation:"blink 2s ease-in-out infinite"}}/>
          <span style={{color:"#fbbf24",fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",fontWeight:600}}>New Collection 2026</span>
        </div>

        <h1 style={{fontSize:42,fontWeight:900,color:"#fff",lineHeight:1.08,letterSpacing:"-0.03em",marginBottom:20}}>
          Crafted for<br/>
          <span style={{background:"linear-gradient(135deg,#fde68a,#fbbf24,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Those Who</span><br/>
          Demand More.
        </h1>

        <p style={{color:"rgba(255,255,255,0.4)",fontSize:15,lineHeight:1.75,marginBottom:36}}>
          Koleksi produk premium — fashion, elektronik, beauty. Kualitas tanpa kompromi.
        </p>

        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:48}}>
          <a href="#products" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 26px",background:"linear-gradient(135deg,#fbbf24,#f59e0b)",color:"#000",fontWeight:700,fontSize:14,borderRadius:99,textDecoration:"none",boxShadow:"0 0 30px rgba(251,191,36,0.25)"}}>
            Jelajahi Koleksi <ArrowRight size={15}/>
          </a>
          <a href="/cart" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 26px",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.8)",fontWeight:600,fontSize:14,borderRadius:99,textDecoration:"none"}}>
            <ShoppingBag size={15}/> Keranjang
          </a>
        </div>

        <div style={{display:"flex",gap:0,justifyContent:"center",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:32}}>
          {[["10K+","Produk"],["50K+","Pelanggan"],["4.9★","Rating"]].map(([val,lab],i)=>(
            <div key={lab} style={{flex:1,textAlign:"center",borderRight:i<2?"1px solid rgba(255,255,255,0.06)":"none",padding:"0 16px"}}>
              <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>{val}</div>
              <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,marginTop:3,letterSpacing:"0.1em",textTransform:"uppercase"}}>{lab}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,opacity:0.3}}>
        <span style={{fontSize:9,letterSpacing:"0.3em",color:"#fff",textTransform:"uppercase"}}>Scroll</span>
        <ChevronDown size={14} color="#fff" style={{animation:"bounce 2s ease-in-out infinite"}}/>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// VALUE PROPS
// ══════════════════════════════════════════════════════════════
function ValueProps(){
  const{ref,visible}=useInView();
  const items=[
    {Icon:Truck,title:"Free Shipping",desc:"Gratis ongkir di atas Rp500.000"},
    {Icon:Shield,title:"Garansi Resmi",desc:"Semua produk terverifikasi asli"},
    {Icon:Zap,title:"Fast Processing",desc:"Dikirim dalam 24 jam kerja"},
  ];
  return(
    <div ref={ref} style={{background:"#0a0a0a",borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"32px 20px",display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
        {items.map(({Icon,title,desc},i)=>(
          <div key={title} style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"16px 10px",borderRight:i<2?"1px solid rgba(255,255,255,0.05)":"none",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:`all 0.6s ease ${i*0.15}s`}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
              <Icon size={17} color="#fbbf24"/>
            </div>
            <div style={{color:"#fff",fontWeight:600,fontSize:12,marginBottom:4}}>{title}</div>
            <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,lineHeight:1.6}}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PRODUCT CARD
// ══════════════════════════════════════════════════════════════
function ProductCard({product,delay=0}){
  const[liked,setLiked]=useState(false);
  const[added,setAdded]=useState(false);
  const[pressed,setPressed]=useState(false);
  const{add}=useCart();
  const{ref,visible}=useInView(0.1);

  const handleAdd=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    add({id:product.id,name:product.name,price:product.price,image:product.image});
    setAdded(true);
    setTimeout(()=>setAdded(false),2000);
  };

  const handleLike=(e)=>{
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return(
    <div ref={ref} style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:`all 0.6s ease ${delay}s`}}>
      {/* Link ke halaman detail */}
      <a href={`/products/${product.slug}`} style={{textDecoration:"none",display:"block"}}>
        <article style={{background:"#111",border:"1px solid rgba(255,255,255,0.06)",borderRadius:20,overflow:"hidden",transition:"transform 0.4s cubic-bezier(0.4,0,0.2,1)",cursor:"pointer"}}
          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-6px)"}
          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
        >
          {/* Image */}
          <div style={{position:"relative",aspectRatio:"1/1",overflow:"hidden",background:"#1a1a1a"}}>
            <img src={product.image} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.7s ease"}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
            />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 50%)"}}/>

            {/* Badges */}
            <div style={{position:"absolute",top:12,left:12,display:"flex",flexDirection:"column",gap:5}}>
              {product.featured&&<span style={{padding:"4px 10px",background:"linear-gradient(135deg,#fbbf24,#f59e0b)",color:"#000",fontSize:9,fontWeight:800,borderRadius:99,textTransform:"uppercase"}}>✦ Featured</span>}
              {product.comparePrice&&<span style={{padding:"4px 10px",background:"rgba(239,68,68,0.85)",color:"#fff",fontSize:9,fontWeight:700,borderRadius:99}}>-{disc(product.price,product.comparePrice)}% OFF</span>}
            </div>

            {/* Wishlist */}
            <button onClick={handleLike} style={{position:"absolute",top:12,right:12,width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Heart size={14} fill={liked?"#ef4444":"none"} color={liked?"#ef4444":"#fff"} strokeWidth={1.5}/>
            </button>

            {/* Category chip */}
            <div style={{position:"absolute",bottom:12,left:12}}>
              <span style={{padding:"4px 10px",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",fontSize:9,borderRadius:99,textTransform:"uppercase",letterSpacing:"0.1em"}}>{product.category}</span>
            </div>
          </div>

          {/* Content */}
          <div style={{padding:"14px"}}>
            <h3 style={{color:"#fff",fontSize:13,fontWeight:600,marginBottom:8,lineHeight:1.3}}>{product.name}</h3>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <span style={{color:"#fff",fontWeight:800,fontSize:15}}>{fmt(product.price)}</span>
                {product.comparePrice&&<span style={{color:"rgba(255,255,255,0.2)",fontSize:11,textDecoration:"line-through",marginLeft:6}}>{fmt(product.comparePrice)}</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:3,background:"rgba(251,191,36,0.08)",padding:"3px 8px",borderRadius:99}}>
                <Star size={9} fill="#fbbf24" color="#fbbf24"/>
                <span style={{color:"#fbbf24",fontSize:10,fontWeight:600}}>4.8</span>
              </div>
            </div>

            {/* Add to cart button */}
            <button onClick={handleAdd}
              onMouseDown={()=>setPressed(true)}
              onMouseUp={()=>setPressed(false)}
              onTouchStart={()=>setPressed(true)}
              onTouchEnd={()=>setPressed(false)}
              style={{width:"100%",padding:"11px",borderRadius:12,border:added?"none":"1px solid rgba(251,191,36,0.2)",background:added?"linear-gradient(135deg,#22c55e,#16a34a)":"linear-gradient(135deg,rgba(251,191,36,0.12),rgba(251,191,36,0.06))",color:added?"#fff":"#fbbf24",fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transform:pressed?"scale(0.97)":"scale(1)",transition:"all 0.2s",letterSpacing:"0.03em"}}>
              {added?<><span>✓</span> Ditambahkan!</>:<><ShoppingBag size={12}/> Tambah ke Keranjang</>}
            </button>
          </div>
        </article>
      </a>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS SECTION
// ══════════════════════════════════════════════════════════════
function Products(){
  const[active,setActive]=useState("Semua");
  const[filtered,setFiltered]=useState(PRODUCTS);
  const{ref,visible}=useInView();
  useEffect(()=>{setFiltered(active==="Semua"?PRODUCTS:PRODUCTS.filter(p=>p.category===active));},[active]);
  return(
    <section id="products" style={{background:"#060606",padding:"72px 20px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div ref={ref} style={{marginBottom:32,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:"all 0.6s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:20,height:1,background:"#fbbf24"}}/>
            <span style={{color:"#fbbf24",fontSize:10,letterSpacing:"0.25em",textTransform:"uppercase",fontWeight:600}}>Pilihan Terbaik</span>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
            <h2 style={{color:"#fff",fontSize:30,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1.1}}>Produk<br/>Unggulan</h2>
            <a href="#" style={{color:"rgba(255,255,255,0.35)",fontSize:12,textDecoration:"none",display:"flex",alignItems:"center",gap:6,paddingBottom:4}}>Lihat Semua <ArrowRight size={12}/></a>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:24,scrollbarWidth:"none"}}>
          {CATEGORIES.map(cat=>(
            <button key={cat} onClick={()=>setActive(cat)} style={{padding:"8px 18px",borderRadius:99,border:"none",background:active===cat?"linear-gradient(135deg,#fbbf24,#f59e0b)":"rgba(255,255,255,0.05)",color:active===cat?"#000":"rgba(255,255,255,0.45)",fontWeight:active===cat?700:500,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.25s",boxShadow:active===cat?"0 0 20px rgba(251,191,36,0.2)":"none",transform:active===cat?"scale(1.03)":"scale(1)"}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          {filtered.map((p,i)=><ProductCard key={p.id} product={p} delay={i*0.08}/>)}
        </div>

        <div style={{textAlign:"center",marginTop:32}}>
          <button style={{padding:"12px 32px",borderRadius:99,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.3s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(251,191,36,0.4)";e.currentTarget.style.color="#fbbf24"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.5)"}}>
            Lihat Lebih Banyak
          </button>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// BANNER
// ══════════════════════════════════════════════════════════════
function Banner(){
  const{ref,visible}=useInView();
  return(
    <section ref={ref} style={{padding:"0 20px 72px",background:"#060606"}}>
      <div style={{maxWidth:900,margin:"0 auto",background:"linear-gradient(135deg,rgba(251,191,36,0.08),rgba(251,191,36,0.03))",border:"1px solid rgba(251,191,36,0.15)",borderRadius:24,padding:"40px 24px",textAlign:"center",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:"all 0.7s ease",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-50%",right:"-20%",width:300,height:300,borderRadius:"50%",background:"rgba(251,191,36,0.04)",filter:"blur(60px)",pointerEvents:"none"}}/>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,marginBottom:16,padding:"6px 14px",borderRadius:99,background:"rgba(251,191,36,0.1)"}}>
          <Sparkles size={12} color="#fbbf24"/>
          <span style={{color:"#fbbf24",fontSize:10,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase"}}>Member Eksklusif</span>
        </div>
        <h3 style={{color:"#fff",fontSize:24,fontWeight:800,marginBottom:12,letterSpacing:"-0.02em"}}>Daftar & Dapatkan<br/>Diskon 15% Pertama</h3>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,lineHeight:1.7,marginBottom:24}}>Bergabung dengan 50.000+ member dan nikmati akses eksklusif koleksi terbaru.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <input type="email" placeholder="Email kamu..." style={{padding:"12px 18px",borderRadius:99,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:13,outline:"none",width:200}}/>
          <button style={{padding:"12px 22px",borderRadius:99,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",color:"#000",fontWeight:700,fontSize:13,border:"none",cursor:"pointer"}}>Daftar Sekarang</button>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════
function Footer(){
  return(
    <footer style={{background:"#040404",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"40px 20px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28,flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,background:"linear-gradient(135deg,#fbbf24,#d97706)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#000",fontWeight:900,fontSize:14}}>L</span>
            </div>
            <span style={{color:"#fff",fontWeight:700,letterSpacing:"0.15em",fontSize:12,textTransform:"uppercase"}}>LUXE</span>
          </div>
          <div style={{display:"flex",gap:20}}>
            {["Produk","Tentang","FAQ","Kontak"].map(item=>(
              <a key={item} href="#" style={{color:"rgba(255,255,255,0.25)",fontSize:11,textDecoration:"none"}}>{item}</a>
            ))}
          </div>
        </div>
        <div style={{height:1,background:"rgba(255,255,255,0.04)",marginBottom:20}}/>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <p style={{color:"rgba(255,255,255,0.15)",fontSize:11}}>© 2026 Luxe Commerce. All rights reserved.</p>
          <p style={{color:"rgba(255,255,255,0.1)",fontSize:11}}>Next.js · Prisma · PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function HomePage(){
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#060606;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#060606;}::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}
        input::placeholder{color:rgba(255,255,255,0.2);}
        @keyframes pulse1{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.1);opacity:1}}
        @keyframes pulse2{0%,100%{transform:scale(1.1)}50%{transform:scale(1)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
        @keyframes cartBounce{0%{transform:scale(0.5)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
      `}</style>
      <main style={{minHeight:"100vh",background:"#060606"}}>
        <Navbar/><Hero/><ValueProps/><Products/><Banner/><Footer/>
      </main>
    </>
  );
}