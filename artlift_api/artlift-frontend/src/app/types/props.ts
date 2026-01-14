export interface Artist {
  id: number;                
  user__username: string;       
  first_name: string;
  last_name: string;
  address?: string;
  about?: string;
  img?: string;                
  bg?: string;                
  accept_commisions: boolean;
  website_URL?: string;
  social_links?: string;
  is_verified: boolean;
  joined_date?: string;     
}

export interface Artwork {
  id: number;
  title: string;
  size?: string;
  description?: string;
  img: string;               
  is_popular: boolean;
  is_active: boolean;
  artist__user__username: string;  
  artist__id?: number;           
}
