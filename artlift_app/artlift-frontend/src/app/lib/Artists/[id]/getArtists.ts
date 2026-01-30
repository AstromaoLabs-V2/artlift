  export const getArtist = async (id:string, token:string) => {
      try {
        const res = await fetch(`http://localhost:8000/artist/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401) {
          throw new Error("UNAUTHORIZED");
         
        }
        if (!res.ok) {
          console.error("Failed to fetch artist", res.status);
          return;
        }
        const data = await res.json();
        return data;
      }

      catch(error){
        throw error;
      }
    }

    