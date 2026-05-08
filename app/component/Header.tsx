"use client";
import BookNow from "@/components/shared/BookNow";
import Navbar from "@/components/shared/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Header = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-6">
      <Navbar></Navbar>
      <section className="flex flex-col-reverse lg:flex-row justify-between items-center mt-20 pt-10 lg:pt-20 gap-10 lg:gap-0">
        <div className="left w-full lg:w-auto text-center lg:text-left">
          <h4 className="text-kicker">{t.header.kicker}</h4>
          <h2 className="text-hero max-w-2xl text-4xl sm:text-5xl lg:text-7xl my-6">
            {t.header.title[0]} <br /> {t.header.title[1]} <br />{" "}
            {t.header.title[2]}
          </h2>
          <h6 className="text-subtitle font-cambria text-base lg:text-lg leading-6 mb-11">
            {t.header.subtitle}
          </h6>
          <div className="flex justify-center lg:justify-start">
            <BookNow href="/booking" className="mt-10" />
          </div>
        </div>
        <div className="right w-full lg:max-h-[690px] lg:w-auto">
          <img
            src="/images/home/homepageimage1.png"
            alt="Header Image"
            className="w-full h-auto max-h-[400px] lg:max-h-[690px] object-contain"
          />
        </div>
      </section>
    </div>
  );
};

export default Header;
