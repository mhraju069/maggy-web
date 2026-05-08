import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

type BookNowProps = {
  href?: string;
  className?: string;
};

const baseClasses =
  "group inline-flex items-center justify-center gap-6 rounded-sm bg-[#CFB9A3] px-10 py-4 text-base font-bold text-[#0F172A] shadow-[0_0_20px_rgba(202,117,33,0.30)] transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CFB9A3]/60";

const BookNow = ({ href, className }: BookNowProps) => {
  const classes = className ? `${baseClasses} ${className}` : baseClasses;
  const content = (
    <>
      Book Now
      <FaArrowRightLong className="h-5 w-5 text-[#0F172A]" aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type="button">
      {content}
    </button>
  );
};

export default BookNow;
