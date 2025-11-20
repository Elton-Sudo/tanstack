import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  href?: string;
}

export function Logo({ width = 150, height = 40, className = '', href = '/' }: LogoProps) {
  const logoElement = (
    <Image
      src="/images/swiif-logo.png"
      alt="SWIIF Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
