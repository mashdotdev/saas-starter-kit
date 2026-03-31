export type Plan = "free" | "pro" | "enterprise";
export type MemberRole = "admin" | "member" | "viewer";

export interface OrgContext {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
}
