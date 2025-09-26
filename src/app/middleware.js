// import { NextResponse } from "next/server";

// export const privateRoutes = ["/dashboard"];

// const redirectUrl = (req, pathname) => {
//   let target = pathname;

//   if (target.startsWith("/")) {
//     target = target.slice(1);
//   }

//   return new URL(`/auth/?redirect=true&target=${target}`, req.url);
// };

// export async function middleware(req) {
//   const token = req.cookies.get("jext-ui-jwt")?.value;
//   const { pathname } = req.nextUrl;
//   const response = NextResponse.next();

//   let accessingPrivateRoute = false;

//   if (privateRoutes.some((route) => pathname.startsWith(route))) {
//     accessingPrivateRoute = true;
//   }

//   // set pathname to response
//   response.headers.set("pathname", pathname);

//   if (!token) {
//     if (!accessingPrivateRoute) {
//       return NextResponse.next();
//     }

//     return NextResponse.redirect(redirectUrl(req, pathname));
//   }

//   const fallback = (response) => {
//     response.cookies.delete("jext-ui-jwt");
//     response.cookies.delete("jext-ui-profile");
//     response.cookies.delete("jext-ui-userType");

//     if (!accessingPrivateRoute) {
//       return NextResponse.next();
//     }

//     return NextResponse.redirect(redirectUrl(req, pathname));
//   };

//   try {
//     // Validate token with backend
//     const apiResponse = await fetch(`${process.env.API_URL}/profile/client`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (apiResponse.ok) {
//       const data = await apiResponse.json();

//       let profile;
//       let userType;

//       if (data?.data) {
//         profile = data?.data?.profile;
//         userType = data?.data?.userType;

//         if (profile) {
//           await response.headers.set("profile", JSON.stringify(profile));
//         }

//         if (userType) {
//           await response.headers.set("userType", userType);
//         }
//       } else {
//         return fallback(response);
//       }

//       if (accessingGuideRoute && userType !== "Guide") {
//         return NextResponse.redirect(
//           new URL(`/my-account/tourist/account-settings/`, req.url)
//         );
//       } else if (accessingTouristRoute && userType !== "Tourist") {
//         return NextResponse.redirect(
//           new URL(`/my-account/guide/account-settings/`, req.url)
//         );
//       } else if (pathname.startsWith("/auth")) {
//         return NextResponse.redirect(new URL(`/`, req.url));
//       }

//       if (accessingGuideRoute && userType === "Guide") {
//         if (guideUnverifiedRoutes.some((route) => pathname.startsWith(route))) {
//           return response;
//         } else {
//           if (!profile?.isVerified) {
//             return NextResponse.redirect(new URL(`/`, req.url));
//           }
//         }
//       }

//       if (
//         guideApprovedRoutes.some((route) => pathname.startsWith(route)) &&
//         userType === "Guide" &&
//         profile?.GuideSubmission?.status !== "approved"
//       ) {
//         return NextResponse.redirect(new URL(`/`, req.url));
//       }

//       return response;
//     }

//     if (apiResponse.status === 401) {
//       return fallback(NextResponse.redirect(redirectUrl(req, pathname)));
//     }

//     if (accessingPrivateRoute) {
//       return fallback(NextResponse.redirect(redirectUrl(req, pathname)));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/:path*"],
// };
