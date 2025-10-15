"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";

export default function useProfileClient() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const profileCookie = getCookie("remote-ui-profile");
      const userType = getCookie("userType");

      if (profileCookie) {
        const parsedProfile = JSON.parse(profileCookie);
        if (userType) parsedProfile.userType = userType;
        setProfile(parsedProfile);
      }
    } catch (err) {
      console.error("Failed to parse profile cookie", err);
    }
  }, []);

  return profile;
}
