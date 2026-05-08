import Footer from "@/components/shared/Footer";
import Activities from "./component/Activities";
import GetInTouch from "./component/GetInTouch";
import Header from "./component/Header";
import Relax from "./component/Relax";
import Service from "./component/Service";
import VideoSection from "./component/VideoSection";
import WellnessJourney from "./component/WellnessJourney";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Service />
      <Relax />
      <VideoSection />
      <Activities />
      <GetInTouch />
      <WellnessJourney />
      <Footer />
    </div>
  );
}
