import PublicHeader from '@/components/public/PublicHeader';
import PublicFooter from '@/components/public/PublicFooter';

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen">{children}</main>
      <PublicFooter />
    </>
  );
}
