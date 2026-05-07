"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  label: string;
};

type TocGroup = {
  title: string;
  items: TocItem[];
};

const TOC_GROUPS: TocGroup[] = [
  {
    title: "Get oriented",
    items: [
      { id: "why", label: "Why run a node?" },
      { id: "expect", label: "What to expect" },
    ],
  },
  {
    title: "Install",
    items: [
      { id: "provision", label: "Provision" },
      { id: "requirements", label: "Requirements" },
      { id: "install", label: "Three-step install" },
      { id: "confirm", label: "Confirm it's working" },
    ],
  },
  {
    title: "Run it",
    items: [
      { id: "firewall", label: "Firewall & ports" },
      { id: "operations", label: "Day-to-day" },
      { id: "upgrades", label: "Upgrades" },
      { id: "hardening", label: "Server hardening" },
    ],
  },
  {
    title: "When things break",
    items: [
      { id: "diagnostics", label: "Diagnostics" },
      { id: "troubleshoot", label: "Troubleshooting" },
      { id: "helping", label: "Helping a friend" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "glossary", label: "Glossary" },
      { id: "sources", label: "Sources & credit" },
    ],
  },
];

const ALL_IDS = TOC_GROUPS.flatMap((group) => group.items.map((item) => item.id));

export function RunNodeToc() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = ALL_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);

        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0% -65% 0%", threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <aside
      aria-label="On this page"
      className="hidden xl:block xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
        On this page
      </p>
      <nav className="mt-4 space-y-6 text-sm">
        {TOC_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
              {group.title}
            </p>
            <ul className="mt-2 space-y-0.5 border-l border-white/10">
              {group.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      aria-current={isActive ? "true" : undefined}
                      className={`-ml-px block border-l py-1 pl-4 transition ${
                        isActive
                          ? "border-cyan-300 text-white"
                          : "border-transparent text-slate-300 hover:border-white/30 hover:text-white"
                      } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200`}
                      href={`#${item.id}`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
