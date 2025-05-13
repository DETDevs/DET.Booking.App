import { Footer } from "./shared/ui/Footer";

export const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>

      <Footer />
    </div>
  );
};
