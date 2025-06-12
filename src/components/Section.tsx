import Link from 'next/link';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  viewAllLink?: string;
}

export default function Section({ title, children, viewAllLink }: SectionProps) {
  return (
    <section className="mb-16 md:mb-20">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
            {title}
          </h2>
          <div className="hidden sm:block w-16 h-0.5 bg-gradient-to-r from-amber-500 to-transparent"></div>
        </div>
        {viewAllLink && (
          <Link href={viewAllLink} className="group flex items-center text-amber-400 hover:text-amber-300 transition-all duration-300 text-sm font-semibold hover:scale-105">
            <span>View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
        {children}
      </div>
    </section>
  );
}
