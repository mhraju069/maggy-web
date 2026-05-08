"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";

const Service = () => {
  const { t } = useLanguage();
  const services = t.service.items.map((item, i) => ({
    ...item,
    image: `/images/home/service/service${i + 1}.png`,
  }));
  return (
    <section className="bg-white w-full min-h-screen flex flex-col justify-center py-20 container mx-auto">
      <div className="w-full mx-auto px-6">
        <div className="text-center">
          <p className="text-kicker text-center">{t.service.kicker}</p>
          <h2 className="section-title">{t.service.title}</h2>
        </div>
        <div className="mt-14 flex flex-col items-center gap-14 lg:flex-row lg:justify-between lg:items-start">
          {services.map((service) => (
            <article key={service.title} className="text-center">
              <div className="mx-auto w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full bg-[#E9DED1] p-4">
                <div className="relative w-full h-full overflow-hidden rounded-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className="service-card-title mt-[48px]">{service.title}</h3>
              <p className="service-card-desc mt-3 px-3">
                {service.description}
              </p>
              <button className="service-card-link mt-4">
                {t.service.learnMore}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
