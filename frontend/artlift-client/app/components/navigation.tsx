
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, ChangeEvent } from 'react';



const Navigation = () => {
  const pathname = usePathname();
  const [input, setInput]= useState<string>("");
  const [ searchVisible, setSearchVisible] =useState<boolean>(false);

  const handleInputEvent = (e:ChangeEvent<HTMLInputElement>):void=>{
    setInput(e.target.value);
  }

  const handleSearchClick = (): void => {
    setSearchVisible(!searchVisible);
  }

  return (
   
       
        
    <div className="navigation-container">
       <div className="navigation-search">
      <nav className="nav-bar">
         <button className="search-button" type="button" onClick={handleSearchClick}>
          <img src="./img/search.png" width={30} height={30} alt="search button"></img>
         </button>
        <Link href="/" className={pathname === "/" ? "nav-link active-glass" : "nav-link"}>Home</Link>
        <Link href="/about" className={pathname === "/about" ? "nav-link active-glass" : "nav-link"}>About</Link>
        <Link href="/account" className={pathname === "/account" ? "nav-link active-glass" : "nav-link"}>Account</Link>
        <Link href="/upload" className={pathname === "/upload" ? "nav-link active-glass" : "nav-link"}>Upload your Art</Link>
      </nav>
        <input type="text" value= {input} onChange = {handleInputEvent} className={searchVisible?"display-input":"hidden-input"}></input>
    </div>
    </div>
   
 
   
  );
//  <input type="text" value= {input} onChange = {handleEvent}></input>
}

export default Navigation;
