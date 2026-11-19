import Color from "colorjs.io";
const enc=c=>c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055, lin=c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4;
const hx=v=>"#"+Math.round(255*v).toString(16).padStart(2,"0").repeat(3);
for (const h of ["#0000ff","#ffff00","#ff0000","#00ff00","#3ea6ff","#d32f2f","#388e3c"]) {
  const c=new Color(h); const [r,g,b]=c.to("srgb").coords;
  const filt=0.2126*r+0.7152*g+0.0722*b;                    // CSS filter: grayscale(1), sRGB-encoded values
  const Y=0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);        // WCAG relative luminance
  const ok=new Color("oklch",[c.to("oklch").coords[0],0,0]).to("srgb").toString({format:"hex",collapse:false}); // oklch(from x l 0 h)
  console.log(h,"filter:grayscale(1)",hx(filt)," luminance-gray",hx(enc(Y))," oklch(from c l 0 h)",ok);
}
