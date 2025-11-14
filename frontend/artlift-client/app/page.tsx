import Image from "next/image";
import Navigation from "./components/navigation";
import ArtworkDetails from './artist-detail/page';

export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <ArtworkDetails/>  
    </div>
  );
}
