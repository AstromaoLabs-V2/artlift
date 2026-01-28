import { Comments } from "@/app/types/props";
  
export const createComments = async (id:string,token:string, body:Partial<Comments>) => {
    try {
      const res = await fetch(`http://localhost:8000/artwork/${id}/comments/create/`, {
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
       throw new Error(`Failed to create comment: ${res.status}`);
      }
      const data = await res.json();
      return data;
    }

    catch(error){
      throw error;
    }
};