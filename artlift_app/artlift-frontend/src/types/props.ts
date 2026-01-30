import { Metadata } from "next";

type MetadataProps = {
  title?: string;
  description?: string;
  canonical?: string;
};

export function constructMetadata({
  title,
  description,
  canonical,
}: MetadataProps): Metadata {
  return {
    title,
    description,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  img: string;
  artist?: Artist | null; 
}

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
  email?: string; 
  followers_count?: string;
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

export interface Errors {
  username?: string[];
  email?: string[];
  password?: string[];
  password_confirm?: string[];
  error?: string;
  non_field_errors?: string[];
}

export interface Error {
  [key: string]: string;
}

export interface Comments {
  id: number;
  user: string;              // username
  user_img: string;          // artist profile image URL
  text: string;
  created_at: string;
  parent: number | null;     // parent comment id for threaded replies
  replies: Comments[];       // nested replies
}

export interface CurrentUser{
  username: string;
  is_staff: boolean;
};
