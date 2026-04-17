'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { allFooterItems, limitedFooterItems, linkMap } from './FooterData';

const Footer = () => {
  const pathname = usePathname();

  const footerItems =
    pathname.startsWith('/SignIn') || pathname.startsWith('/SignUp')
      ? limitedFooterItems
      : allFooterItems;

  const [firstItem, ...otherItems] = footerItems;

  const bgColor =
    pathname === '/SignIn'
      ? 'bg-black/80 text-stone-300'
      : pathname === '/SignUp'
      ? 'bg-gray-100'
      : pathname === '/'
      ? 'bg-black text-stone-300'
      : 'bg-gray-100 dark:bg-black/20 dark:text-stone-300';

  return (
    <div
      className={`xl:py-24 xl:px-44 p-7 ${bgColor} underline flex text-sm sm:text-base flex-col`}
    >
      <div className="mb-2 xl:max-w-[60vw] xl:ml-20">
        <Link href="/">{firstItem}</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 justify-center xl:max-w-[60vw] xl:ml-20">
        {otherItems.map((item, index) => (
          <p key={index} className="mb-2 pt-2">
            <Link href={linkMap[item] || '/'}>{item}</Link>
          </p>
        ))}
      </div>
    </div>
  );
};

export default Footer;
