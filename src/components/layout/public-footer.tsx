import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Logo className="h-10 w-auto" />
            </Link>
            <p className="mt-2 text-muted-foreground">AI-powered food wastage reduction.</p>
          </div>
        </div>
        <hr className="my-6 border-border sm:mx-auto lg:my-8" />
        <div className="text-center text-sm text-muted-foreground">
          © {currentYear} <Link href="/" className="hover:underline">Food Wastage Detection™</Link>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
