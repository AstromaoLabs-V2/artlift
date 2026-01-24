import { Artist } from "@/app/types/props";
  
export const createArtist = async (token:string, body:Partial<Artist>) => {
    try {
      const res = await fetch(`http://localhost:8000/artist/create/`, {
        method:"POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify(body),
       
      });
      if (res.status === 401) {
        throw new Error("UNAUTHORIZED");
       
      }
      if (!res.ok) {
       throw new Error(`Failed to update artist: ${res.status}`);
      }
      const data = await res.json();
      return data;
    }

    catch(error){
      throw error;
    }
  }
