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
    <section className="bg-white w-full min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center">
          <p className="text-kicker text-center">{t.service.kicker}</p>
          <h2 className="section-title">{t.service.title}</h2>
        </div>
        <div className="mt-14 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12">
          {services.map((service) => (
            <article key={service.title} className="flex-1 flex flex-col items-center text-center max-w-[350px]">
              <div className="mx-auto w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] lg:w-[320px] lg:h-[320px] rounded-full bg-[#E9DED1] p-3.5">
                <div className="relative w-full h-full overflow-hidden rounded-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className="service-card-title mt-8">{service.title}</h3>
              <p className="service-card-desc mt-3 px-2">
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
