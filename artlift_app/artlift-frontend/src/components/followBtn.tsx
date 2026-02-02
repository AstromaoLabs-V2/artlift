"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";

type FollowButtonProps = {
  artistId: string;
  initialFollowing?: boolean;
  className?: string;
};

export default function FollowButton({
  artistId,
  initialFollowing = false,
  className = "",
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch follow status on mount
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/artist/${artistId}/follow-status/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setFollowing(data.is_following);
        }
      } catch (err) {
        console.error("Failed to fetch follow status:", err);
      }
    };

    fetchFollowStatus();
  }, [artistId]);

  const handleFollow = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please log in first");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/artist/${artistId}/follow/`,
        {
          method: following ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.error || "Failed to update follow"
        );
      }

      setFollowing(!following);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "...";
    if (following) {
      return isHovered ? "Unfollow" : "Following";
    }
    return "Follow";
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
        following
          ? "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } ${className}`}
    >
      {getButtonText()}
    </Button>
  );
}