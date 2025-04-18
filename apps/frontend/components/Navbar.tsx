import Link from 'next/link';
import Image from 'next/image';

type NavLink = {
  href: string;
  label: string;
}

type NavbarProps = {
  links: NavLink[];
}

const Navbar: React.FC<NavbarProps> = ({links}) => (
  <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white fixed w-full z-10">
    {/* Logo & Brand Name */}
    <Link href="/" className="flex items-center space-x-3">
      <Image src="/logo.svg" alt="CodePulse Logo" width={32} height={32} priority />
      <h1 className="text-2xl font-bold text-[#364FC7]">CodePulse</h1>
    </Link>

    {/* Navigation Links */}
    {/* <div className="space-x-6">
      <Link href="#features" className="hover:text-[#0EA5E9] transition">Features</Link>
      <Link href="#categories" className="hover:text-[#0EA5E9] transition">Categories</Link>
      <Link href="#testimonials" className="hover:text-[#0EA5E9] transition">Testimonials</Link>
    </div> */}
        {/* Dynamic Navigation Links */}
        <div className="space-x-6">
      {links.map((link, index) => (
        <Link key={index} href={link.href} className="hover:text-[#0EA5E9] transition">
          {link.label}
        </Link>
      ))}
    </div>
  </nav>
);

export default Navbar;
