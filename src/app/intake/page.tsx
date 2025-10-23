import { DesktopIntakeClient } from "./_components/desktop-intake-client";

export const dynamic = "force-dynamic";

/**
 * Desktop onboarding page - collects intake data from users before authentication
 * Users fill out the form, data is stored in localStorage, then they authenticate
 * before being redirected to payment
 */
export default function IntakePage() {
  return <DesktopIntakeClient />;
}
