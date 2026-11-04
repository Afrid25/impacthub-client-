import Navbar from "@/components/navbar";
import Banner from "@/components/banner";
import RecentEvents from "@/components/recent-events";

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh">
      <main className="flex-1">
        <Banner />
        <RecentEvents />
      </main>
    </div>
  );
}
