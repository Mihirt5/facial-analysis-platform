import { LandingPageV2 } from "../../newdesktoplanding/src/LandingPageV2/LandingPageV2";
import { auth } from "~/server/utils/auth";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await getSanitizedHeaders(),
  });

  return <LandingPageV2 />;
}
