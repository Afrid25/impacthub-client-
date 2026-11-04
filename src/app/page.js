import Navbar from "@/components/navbar";
import Banner from "@/components/banner";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh">
      
      <main className="flex-1">
        <Banner />
      </main>
      <Footer />
    </div>
  );
}
