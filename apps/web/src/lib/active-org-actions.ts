"use server";

import { cookies } from "next/headers";
import { ACTIVE_ORG_COOKIE } from "@/lib/active-org";

export async function setActiveOrg(orgId: string): Promise<void> {
  const jar = await cookies();
  jar.set(ACTIVE_ORG_COOKIE, orgId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}
