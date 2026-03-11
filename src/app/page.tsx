"use client";

export default function HomePage() {
  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center text-[#4a4a4a] font-montserrat antialiased relative text-center px-6"
      style={{ 
        backgroundImage: 'url(/fondo_papel.jpeg)', 
        backgroundSize: '500px', 
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center'
      }}
    >
      <div className="animate-fade-in-portada flex flex-col items-center">
        <img 
          src="/Proyecto_nuevo.png" 
          alt="Ori & Tomi" 
          className="w-full max-w-[300px] md:max-w-[450px] h-auto mb-10" 
        />
        
        <div className="space-y-6">
          <h1 className="text-[20px] md:text-[24px] tracking-[0.3em] uppercase font-light text-stone-700">
            ¡Nos Casamos!
          </h1>
          
          <p className="italic text-stone-500 font-light text-sm md:text-base max-w-xs mx-auto leading-relaxed border-t border-stone-200/50 pt-6">
            "Bienvenidos a nuestra invitación digital. <br/> Por favor, ingresá con el link personalizado que te enviamos."
          </p>
        </div>
      </div>

      {/* Un footer sutil */}
      <footer className="absolute bottom-10 opacity-30 text-[10px] tracking-widest uppercase">
        02.05.2026 • Tandil
      </footer>
    </main>
  );
}