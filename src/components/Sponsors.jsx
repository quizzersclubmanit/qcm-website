import { sponsors } from "../assets/qcmData.json"
import logoMap from "../generated/sponsor-logos.json"

const Sponsors = () => {
  const renderSponsorCard = (brand, idx) => {
    const brandName = brand.name || brand.brand || brand.company || `Sponsor ${idx + 1}`
    const website = brand.website || "#"
    // Self-hosted mirror (scripts/sponsors.cjs) with remote fallback
    const logo = (brand.logo && logoMap[brand.logo]) || brand.logo

    return (
      <a
        key={`${brandName}-${idx}`}
        href={website}
        target="_blank"
        rel="sponsored noopener"
        className="group flex min-h-[82px] min-w-[120px] items-center justify-center rounded-md px-3 py-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)]"
        aria-label={brandName}
      >
        {logo ? (
          <img
            src={logo}
            alt={`${brandName} logo`}
            loading="lazy"
            decoding="async"
            className="max-h-[52px] w-auto max-w-[180px] object-contain opacity-100 transition duration-300 sm:max-h-[72px]"
          />
        ) : (
          <span className="text-[clamp(1.3rem,2vw,2.4rem)] font-semibold tracking-[-0.04em] text-[#2a2a2a]">
            {brandName}
          </span>
        )}
      </a>
    )
  }

  return (
    <section
      id="sponsors"
      className="w-full bg-[#f2f2ee] px-4 py-10 sm:px-8 lg:px-16"
        style={{ background: 'url("/bg-gradient.webp") no-repeat center center / cover' }}
    >
      <div className="mx-auto max-w-[1200px] rounded-[4px] bg-[#f5f5f2]/90 px-4 pb-10 pt-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] backdrop-blur-[1px] sm:px-8 lg:px-10">
        <div className="flex items-center justify-center">
          <h2 className="text-center leading-[0.9] text-[#1b1b1b]">
            <span className="block text-[clamp(2.7rem,5vw,6rem)] font-black tracking-[-0.06em]">
              Special thanks
            </span>
            <span className="block text-[clamp(2.7rem,5vw,6rem)] font-black tracking-[-0.06em]">
              to our <span className="italic text-[#3ab8b4] poppins-bold">Sponsors</span>
            </span>
          </h2>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          {sponsors.map((sponsor, index) => {
            if (!Array.isArray(sponsor)) {
              return (
                <div key={`${sponsor.category}-${index}`}>
                  <div className="bg-[#5ac3c0] px-4 py-3 text-center">
                    <p className="poppins-bold text-[0.9rem] uppercase tracking-[0.08em] text-white sm:text-[1.7rem]">
                      {sponsor.category}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-evenly gap-x-7 gap-y-6 px-3 py-6 sm:px-6 lg:px-8">
                    {sponsor.brands.map((brand, idx) => renderSponsorCard(brand, idx))}
                  </div>
                </div>
              )
            }

            return (
              <div key={`row-${index}`} className="flex flex-col gap-5">
                <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-3">
                  {sponsor.map((item, idx) => (
                    <div key={`${item.category}-${idx}`}>
                      <div className="bg-[#5ac3c0] px-4 py-3 text-center">
                        <p className="poppins-bold text-[0.9rem] uppercase tracking-[0.08em] text-white sm:text-[1.7rem]">
                          {item.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-center px-3 py-6 sm:px-6 lg:px-8">
                        {renderSponsorCard(
                          {
                            name: item.brand?.name || item.brand || item.category,
                            logo: item.brand?.logo || item.logo,
                            website: item.brand?.website || item.website
                          },
                          idx
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Sponsors
