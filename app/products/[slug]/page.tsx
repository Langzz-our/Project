"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShoppingBag, Heart, Star, ArrowLeft, Shield, Truck, Zap, ChevronLeft, ChevronRight } from "lucide-react";

const fmt = (p) => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(p));

// Cart (sama seperti di page.tsx)
let _cart=[], _listeners=[];
const cart = {
  total:()=>_cart.reduce((s,i)=>s+i.qty,0),
  add:(item)=>{const idx=_cart.findIndex(i=>i.id===item.id);_cart=idx>-1?_cart.map((i,n)=>n===idx?{...i,qty:i.qty+1}:i):[..._cart,{...item,qty:1}];_listeners.forEach(fn=>fn([..._cart]));},
  sub:(fn)=>{_listeners.push(fn);return()=>{_listeners=_listeners.filter(f=>f!==fn);};}
};
function useCart(){const[items,setItems]=useState([]);useEffect(()=>cart.sub(setItems),[]);return{items,add:cart.add,total:cart.total};}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const { add } = useCart();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(d => { setProduct(d.data); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#060606",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:40,height:40,border:"2px solid rgba(251,191,36,0.3)",borderTop:"2px solid #fbbf24",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!product) return (
    <div style={{minHeight:"100vh",background:"#060606",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:16}}>Produk tidak ditemukan</p>
      <a href="/" style={{color:"#fbbf24",textDecoration:"none",fontSize:14}}>← Kembali ke Beranda</a>
    </div>
  );

  const disc = product.comparePrice ? Math.round((1-Number(product.price)/Number(product.comparePrice))*100) : 0;
  const images = product.imageUrls?.length ? product.imageUrls : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"];

  const handleAdd = () => {
    for(let i=0;i<qty;i++) add({id:product.id,name:product.name,price:product.price,image:images[0]});
    setAdded(true);
    setTimeout(()=>setAdded(false),2000);
  };

  return (
    <div style={{minHeight:"100vh",background:"#060606",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",color:"#fff"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Navbar */}
      <nav style={{position:"sticky",top:0,zIndex:50,padding:"14px 20px",background:"rgba(6,6,6,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:8,color:"rgba(255,255,255,0.6)",textDecoration:"none",fontSize:13}}>
          <ArrowLeft size={16}/> Kembali
        </a>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,background:"linear-gradient(135deg,#fbbf24,#d97706)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#000",fontWeight:900,fontSize:13}}>L</span>
          </div>
          <span style={{color:"#fff",fontWeight:700,letterSpacing:"0.15em",fontSize:12,textTransform:"uppercase"}}>LUXE</span>
        </div>
        <button style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",position:"relative"}}>
          <ShoppingBag size={20}/>
        </button>
      </nav>

      {/* Image Gallery */}
      <div style={{position:"relative",aspectRatio:"1/1",background:"#111",overflow:"hidden"}}>
        <img src={images[imgIdx]} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(6,6,6,0.8) 0%,transparent 50%)"}}/>

        {/* Badges */}
        <div style={{position:"absolute",top:16,left:16,display:"flex",gap:8}}>
          {disc>0&&<span style={{padding:"5px 12px",background:"rgba(239,68,68,0.85)",backdropFilter:"blur(8px)",color:"#fff",fontSize:10,fontWeight:700,borderRadius:99}}>-{disc}% OFF</span>}
          {product.stock<10&&product.stock>0&&<span style={{padding:"5px 12px",background:"rgba(251,191,36,0.85)",color:"#000",fontSize:10,fontWeight:700,borderRadius:99}}>Stok Terbatas!</span>}
        </div>

        {/* Wishlist */}
        <button onClick={()=>setLiked(!liked)} style={{position:"absolute",top:16,right:16,width:38,height:38,borderRadius:"50%",background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Heart size={16} fill={liked?"#ef4444":"none"} color={liked?"#ef4444":"#fff"}/>
        </button>

        {/* Arrow navigasi gambar */}
        {images.length>1&&(<>
          <button onClick={()=>setImgIdx(i=>Math.max(0,i-1))} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
            <ChevronLeft size={18}/>
          </button>
          <button onClick={()=>setImgIdx(i=>Math.min(images.length-1,i+1))} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
            <ChevronRight size={18}/>
          </button>
        </>)}

        {/* Dot indicator */}
        {images.length>1&&(
          <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
            {images.map((_,i)=>(
              <div key={i} onClick={()=>setImgIdx(i)} style={{width:i===imgIdx?20:6,height:6,borderRadius:99,background:i===imgIdx?"#fbbf24":"rgba(255,255,255,0.3)",transition:"all 0.3s",cursor:"pointer"}}/>
            ))}
          </div>
        )}
      </div>

      {/* Detail Content */}
      <div style={{padding:"24px 20px",maxWidth:600,margin:"0 auto"}}>

        {/* Category & Rating */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <span style={{color:"rgba(251,191,36,0.7)",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:600}}>{product.category?.name}</span>
          <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(251,191,36,0.08)",padding:"4px 10px",borderRadius:99}}>
            {[1,2,3,4,5].map(i=><Star key={i} size={10} fill="#fbbf24" color="#fbbf24"/>)}
            <span style={{color:"#fbbf24",fontSize:11,fontWeight:600,marginLeft:2}}>4.8</span>
            <span style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>(128)</span>
          </div>
        </div>

        {/* Name */}
        <h1 style={{fontSize:24,fontWeight:800,color:"#fff",lineHeight:1.2,letterSpacing:"-0.02em",marginBottom:16}}>{product.name}</h1>

        {/* Price */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <span style={{fontSize:28,fontWeight:900,color:"#fff"}}>{fmt(product.price)}</span>
          {product.comparePrice&&(
            <span style={{fontSize:16,color:"rgba(255,255,255,0.25)",textDecoration:"line-through"}}>{fmt(product.comparePrice)}</span>
          )}
          {disc>0&&<span style={{fontSize:12,color:"#22c55e",fontWeight:700,background:"rgba(34,197,94,0.1)",padding:"3px 8px",borderRadius:99}}>Hemat {disc}%</span>}
        </div>

        {/* Stock */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,padding:"10px 14px",background:"rgba(255,255,255,0.03)",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:product.stock>0?"#22c55e":"#ef4444"}}/>
          <span style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>
            {product.stock>0 ? `Stok tersedia: ${product.stock} pcs` : "Stok habis"}
          </span>
        </div>

        {/* Description */}
        {product.description&&(
          <div style={{marginBottom:24}}>
            <h3 style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Deskripsi</h3>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.8}}>{product.description}</p>
          </div>
        )}

        {/* Tags */}
        {product.tags?.length>0&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
            {product.tags.map(tag=>(
              <span key={tag} style={{padding:"5px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:99,fontSize:11,color:"rgba(255,255,255,0.4)"}}>#{tag}</span>
            ))}
          </div>
        )}

        {/* Value props */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:28}}>
          {[{Icon:Truck,text:"Free Ongkir"},{Icon:Shield,text:"Garansi Resmi"},{Icon:Zap,text:"24 Jam Kirim"}].map(({Icon,text})=>(
            <div key={text} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"12px 8px",background:"rgba(251,191,36,0.04)",border:"1px solid rgba(251,191,36,0.1)",borderRadius:12}}>
              <Icon size={16} color="#fbbf24"/>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",textAlign:"center",lineHeight:1.4}}>{text}</span>
            </div>
          ))}
        </div>

        {/* Qty & Add to Cart */}
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          {/* Qty selector */}
          <div style={{display:"flex",alignItems:"center",gap:0,border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,overflow:"hidden"}}>
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:40,height:52,background:"rgba(255,255,255,0.04)",border:"none",color:"#fff",fontSize:18,cursor:"pointer"}}>−</button>
            <span style={{width:40,textAlign:"center",fontSize:15,fontWeight:700,color:"#fff"}}>{qty}</span>
            <button onClick={()=>setQty(q=>Math.min(product.stock,q+1))} style={{width:40,height:52,background:"rgba(255,255,255,0.04)",border:"none",color:"#fff",fontSize:18,cursor:"pointer"}}>+</button>
          </div>

          {/* Add to cart button */}
          <button onClick={handleAdd} disabled={product.stock===0}
            style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:added?"linear-gradient(135deg,#22c55e,#16a34a)":product.stock===0?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#fbbf24,#f59e0b)",color:added||product.stock===0?"rgba(255,255,255,0.5)":"#000",fontWeight:700,fontSize:14,cursor:product.stock===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.3s"}}>
            <ShoppingBag size={16}/>
            {added?"✓ Ditambahkan!":product.stock===0?"Stok Habis":"Tambah ke Keranjang"}
          </button>
        </div>

        {/* Buy now */}
        <button style={{width:"100%",padding:"14px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.7)",fontWeight:600,fontSize:14,cursor:"pointer",transition:"all 0.3s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(251,191,36,0.4)";e.currentTarget.style.color="#fbbf24"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.7)"}}>
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}