import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Announcement from "@/components/Announcement";
import Ticker from "@/components/Ticker";
import Premise from "@/components/Premise";
import Nations from "@/components/Nations";
import Mechanics from "@/components/Mechanics";
import CableFeed from "@/components/CableFeed";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="flex-1 relative">
      <Nav />
      <Hero />
      <Announcement />
      <Ticker />
      <Premise />
      <Nations />
      <Mechanics />
      <CableFeed />
      <Footer />
    </main>
  );
}
