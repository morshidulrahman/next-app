import { NextResponse } from "next/server";

export const privateRoutes = [
  "/dashboard",
  "/work-hours",
  "/profile",
  "/tickets",
];

const redirectUrl = (req, pathname) => {
  let target = pathname;

  if (target.startsWith("/")) {
    target = target.slice(1);
  }

  // always send to /login with redirect info
  return new URL(`/login?redirect=true&target=${target}`, req.url);
};

export async function middleware(req) {
  const token = req.cookies.get("remote-ui-jwt")?.value;
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();

  const accessingPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // always set current pathname in response headers
  response.headers.set("pathname", pathname);

  if (!token) {
    if (!accessingPrivateRoute) {
      return response;
    }
    return NextResponse.redirect(redirectUrl(req, pathname));
  }

  // fallback helper
  const fallback = () => {
    const res = NextResponse.redirect(redirectUrl(req, pathname));
    res.cookies.delete("remote-ui-jwt");
    res.cookies.delete("remote-ui-profile");
    return res;
  };

  try {
    const apiResponse = await fetch(
      `http://localhost:4000/api/v1/employees/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      const profile = data?.data;

      if (!profile) {
        return fallback();
      }

      // attach profile in headers for server components
      response.headers.set("profile", JSON.stringify(profile));

      if (pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return response;
    }

    if (apiResponse.status === 401) {
      return fallback();
    }

    if (!accessingPrivateRoute) {
      return response;
    }

    return fallback();
  } catch (error) {
    console.error("Middleware error:", error);

    if (accessingPrivateRoute) {
      return fallback();
    }

    return response;
  }
}

export const config = {
  matcher: ["/:path*"],
};
