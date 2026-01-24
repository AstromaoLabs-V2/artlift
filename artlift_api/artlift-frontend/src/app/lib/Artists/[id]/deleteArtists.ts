import { Artist } from "@/app/types/props";
  
export const deleteArtist = async (id:number, token:string) => {
    try {
      const res = await fetch(`http://localhost:8000/artist/${id}/`, {
        method:"Delete",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
       
      });
      if (res.status === 401) {
        throw new Error("UNAUTHORIZED");
       
      }
      if (!res.ok) {
       throw new Error(`Failed to update artist: ${res.status}`);
      }
   
      return;
    }

    catch(error){
      throw error;
    }
  }
