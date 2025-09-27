"use server";
import { headers } from "next/headers";

export async function useProfile() {
  const headersList = await headers();

  const userType = headersList.get("userType");
  let profile = headersList.get("profile");

  profile = profile ? JSON.parse(profile) : null;

  if (profile) {
    profile.userType = userType;
  }

  return profile;
}
