import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-canvas w-full border-t border-hairline">
      <div className="flex flex-col md:flex-row justify-between items-center py-xl px-lg gap-md max-w-[1440px] mx-auto">

        {/* Brand */}
        <div className="font-sans font-bold text-headline text-primary">
          VeilFi
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-md">
          {['Documentation', 'Privacy Policy', 'Terms of Service', 'Security Audit'].map((label) => (
            <a
              key={label}
              href="#"
              className="font-eyebrow text-caption text-secondary hover:text-primary transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="font-eyebrow text-caption text-secondary">
          © {new Date().getFullYear()} VeilFi. Technical Precision. Human Expression.
        </div>
      </div>
    </footer>
  )
}
