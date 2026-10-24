import { MapPin, Navigation, ExternalLink } from "lucide-react"

const Map = () => {
  return (
    <section id="map" aria-label="Campus Location Map" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        
        {/* Map Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 xs:p-5 sm:p-6 rounded-2xl bg-[#0c1e28]/90 border border-white/15 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#fe9c02]/15 text-[#fe9c02] border border-[#fe9c02]/30 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm xs:text-base sm:text-lg font-bold text-white">Learning Resource Centre (LRC)</span>
                <span className="hidden xs:inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-semibold text-slate-300">
                  Campus Venue
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5">
                MANIT Bhopal &bull; 23.2166&deg; N, 77.4093&deg; E
              </span>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=LRC+MANIT+Bhopal"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LRC MANIT Bhopal location in Google Maps"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-[#fe9c02] text-white hover:text-[#0c1e28] border border-white/15 hover:border-[#fe9c02] shadow-md text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Map Frame Card */}
        <div className="w-full h-[280px] xs:h-[340px] sm:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group">
          <iframe
            title="Map — MANIT Bhopal (LRC), Quizzers' Club location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.7262770360508!2d77.4093298!3d23.216644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43accb2f81f9%3A0x603cfa000db72484!2sLRC%20MANIT!5e0!3m2!1sen!2sin!4v1719604203172!5m2!1sen!2sin"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0 grayscale-[25%] contrast-[1.08] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
          />
        </div>

      </div>
    </section>
  )
}

export default Map
