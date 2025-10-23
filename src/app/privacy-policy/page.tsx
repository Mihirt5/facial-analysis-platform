import { readFileSync } from "fs";
import { type Metadata } from "next";
import { join } from "path";
import ReactMarkdown from "react-markdown";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { auth } from "~/server/utils/auth";
import { getSanitizedHeaders } from "~/lib/sanitize-headers";

export const metadata: Metadata = {
  title: "Privacy Policy | Parallel",
  description: "Privacy Policy for Parallel",
};

export default async function PrivacyPolicy() {
  const session = await auth.api.getSession({
    headers: await getSanitizedHeaders(),
  });

  // Read the markdown file at build time
  const markdownPath = join(
    process.cwd(),
    "public",
    "legal",
    "privacy-policy.md",
  );
  const policy = readFileSync(markdownPath, "utf8");

  return (
    <>
      <Header session={session} />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 ml-6 list-disc text-gray-700 dark:text-gray-300">
                  {children}
                </ul>
              ),
              li: ({ children }) => <li className="mb-2">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900 dark:text-white">
                  {children}
                </strong>
              ),
              hr: () => (
                <hr className="my-8 border-gray-300 dark:border-gray-600" />
              ),
            }}
          >
            {policy}
          </ReactMarkdown>
        </div>
      </div>
      <Footer />
    </>
  );
}
