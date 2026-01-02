import Navigation from "../components/nav/navigation";
import { ArtworkSlide } from "../components/features/ArtworkSlide";
import SnsSystem from "../components/features/SnsSystem";
import FollowSubscribe from "../components/features/FollowSubscribe";
export default function ArtworkDetails() {
  return (
    <>
      <Navigation />
      <div className="artwork-detail-sns grid grid-cols-3 gap-2">
        <div className="artwork-details col-span-2">
          <ArtworkSlide />
        </div>
        <aside className="sns-system col-span-1">
          <SnsSystem />
          <div className="follow-subscribe col-span-1">
            <FollowSubscribe />
          </div>
        </aside>
      </div>
    </>
  );
}
