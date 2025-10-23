import { type Metadata } from "next";
import SidebarWrapper from "./_components/sidebar-wrapper";

export const metadata: Metadata = {
  title: "Review | Parallel",
  description: "Reviewer dashboard for Parallel",
  // Since this is a reviewer dashboard, we don't want it to be indexed or followed
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarWrapper>{children}</SidebarWrapper>;
}
