import { cookies } from "next/headers";

export const ACTIVE_ORG_COOKIE = "active-org-id";

export async function getActiveOrgId(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ACTIVE_ORG_COOKIE)?.value;
}
