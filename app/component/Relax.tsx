"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";

const Relax = () => {
  const { t } = useLanguage();
  return (
    <section
      className="w-full min-h-screen flex items-center"
      style={{ background: "var(--color-relax-bg)" }}
    >
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between w-full gap-10 py-16 lg:py-24">
        <div className="flex flex-col gap-[10px] w-full lg:max-w-[576px] text-center lg:text-left">
          <p className="text-kicker">{t.relax.kicker}</p>
          <h2 className="relax-title mt-2">{t.relax.title}</h2>
          <div className="flex flex-col gap-3 mt-4">
            <p className="relax-body">{t.relax.body1}</p>
            <p className="relax-body">{t.relax.body2}</p>
            <p className="relax-body">{t.relax.body3}</p>
          </div>
        </div>
        <div className="relative w-full lg:flex-shrink-0 lg:w-[824px] h-[300px] sm:h-[400px] lg:h-[632px]">
          <Image
            src="/images/home/relax/relax.png"
            alt="Relax and enjoy"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Relax;
