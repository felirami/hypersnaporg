import { DocsSidebar } from "@/components/docs-sidebar";
import { getDocsTree } from "@/lib/sources";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sections = getDocsTree();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-12">
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
        <aside>
          <DocsSidebar sections={sections} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
