const Map = () => {
  return (
    <section id="map" aria-label="Campus Location Map" className="relative w-full overflow-hidden">
      {/* Top Gradient Blend */}
      <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#091822] to-transparent z-10 pointer-events-none" />

      {/* Floating Venue Pill Badge */}
      <div className="absolute top-5 left-4 sm:left-8 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c1e28]/90 border border-white/15 backdrop-blur-md shadow-lg text-xs font-semibold text-white">
          <span className="w-2 h-2 rounded-full bg-[#fe9c02] inline-block" />
          <span>MANIT Bhopal &bull; LRC (Learning Resource Centre)</span>
        </div>
      </div>

      <div className="w-full h-[45vh] sm:h-[55vh] relative">
        <iframe
          title="Map — MANIT Bhopal (LRC), Quizzers' Club location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.7262770360508!2d77.4093298!3d23.216644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43accb2f81f9%3A0x603cfa000db72484!2sLRC%20MANIT!5e0!3m2!1sen!2sin!4v1719604203172!5m2!1sen!2sin"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full border-0 grayscale-[20%] contrast-[1.05] opacity-90 hover:grayscale-0 transition-all duration-300"
        />
      </div>

      {/* Bottom Gradient Blend */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#0a1922] to-transparent z-10 pointer-events-none" />
    </section>
  )
}

export default Map
