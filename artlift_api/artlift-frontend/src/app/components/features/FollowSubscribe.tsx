import "../ui/subscribe_button.css";
import Image from "next/image";

type Props ={
  artistIcon:string;
  artistName:string;
}

export default function FollowSubscribe({artistIcon, artistName}:Props){
  return(
    <>
    <div className="icon-name">
      <Image src={artistIcon} width={60} height={60} alt="follow icon" />
      <h3>{artistName}</h3>
    </div>

    <div className="follow-subscribe-buttons mt-4">
      <button className="follow-button" type="button">Follow</button>
      <button className="subscribe-button" type="button">Subscribe</button>
    </div>
      
    </>
  )
}