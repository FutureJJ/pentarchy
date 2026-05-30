import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Nations from "@/components/Nations";
import CableFeed from "@/components/CableFeed";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="flex-1 relative">
      <Nav />
      <Hero />
      <Ticker />
      <Nations />
      <CableFeed />
      <Footer />
    </main>
  );
}
