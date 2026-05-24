import { DocsSidebar } from "@/components/docs-sidebar";
import { getDocsTree } from "@/lib/sources";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sections = getDocsTree();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
      <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <aside>
          <DocsSidebar sections={sections} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
