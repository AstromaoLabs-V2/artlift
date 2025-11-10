import Navigation from "../components/navigation";
import { ArtworkSlide } from "../components/ArtworkSlide";
export default function ArtworkDetails() {

  return(
    <>
     <Navigation />
    <div className="artwork-detail-sns grid grid-cols-3 gap-2">
   <div className="artwork-details col-span-2"><ArtworkSlide /></div>
    </div>
    </>
    
  )
}