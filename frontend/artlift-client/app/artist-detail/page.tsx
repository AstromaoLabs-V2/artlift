import Navigation from "../components/navigation";
import { ArtworkSlide } from "../components/ArtworkSlide";
import "../globals.css";
import SnsSystem from "../components/Sns-system";
export default function ArtworkDetails() {

  return(
    <>
     <Navigation />
    <div className="artwork-detail-sns grid grid-cols-3 gap-2">
   <div className="artwork-details col-span-2"><ArtworkSlide /></div>
   <aside className="sns-system col-span-1"><SnsSystem /></aside>
    </div>
    </>
    
  )
}