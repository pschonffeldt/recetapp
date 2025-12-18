import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function HelpMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:scroll-mt-24">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children }) {
            const url = href ?? "#";
            const isExternal = /^https?:\/\//.test(url);

            if (isExternal) {
              return (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {children}
                </a>
              );
            }

            return (
              <Link href={url} className="text-blue-600 hover:underline">
                {children}
              </Link>
            );
          },
          h2({ children }) {
            return <h2 className="mt-6 text-xl font-semibold">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mt-5 text-lg font-semibold">{children}</h3>;
          },
          p({ children }) {
            return (
              <p className="text-sm leading-6 text-gray-800">{children}</p>
            );
          },
          li({ children }) {
            return (
              <li className="text-sm leading-6 text-gray-800">{children}</li>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
