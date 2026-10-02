"use client";

import { useState } from "react";
import { Container, Section, SectionHeader, Pill, Footnote } from "@/components/ui";

/* ------------------------------------------------------------------���--------
   How to use DeathClock, without the cryptography

   Everything else on this site explains how the protocol works. This section
   answers the question a non-developer actually arrives with: what do I click,
   and what happens to my money if I stop.

   Deliberately no jargon. "Zero-knowledge proof" appears once, explained as a
   receipt the chain checks for itself. Where something is not finished yet --
   the proof still takes minutes on ordinary hardware -- it says so rather than
   hiding it.
--------------------------------------------------------------------------- */

type StepId = "connect" | "name" | "fund" | "pulse" | "safe";

const STEPS: {
  id: StepId;
  n: string;
  title: string;
  time: string;
  body: string;
  detail: string;
  warning?: boolean;
}[] = [
  {
    id: "connect",
    n: "01",
    title: "Connect your wallet",
    time: "10 seconds",
    body: "Click Connect in the top right and pick Phantom. That is all this step is: it proves you hold the keys, and nobody can move your money through this site.",
    detail:
      "This page never sees your private key. Signing happens inside your wallet, and you will see a confirmation prompt for anything that costs money.",
  },
  {
    id: "name",
    n: "02",
    title: "Say who inherits",
    time: "2 minutes",
    body: "Add up to five people, and give each one a share. The shares must add up to exactly 100%. You can change this later, but not after the estate starts paying out.",
    detail:
      "Get these right the first time. The vault is created once and the split cannot be edited afterwards, so a typo here sends the money somewhere you cannot undo.",
    warning: true,
  },
  {
    id: "fund",
    n: "03",
    title: "Put the money in",
    time: "1 minute",
    body: "Deposit SOL into the vault. The balance updates as soon as the transaction confirms, and the vault address is yours alone -- nobody can move it except by the rules below.",
    detail:
      "You can add to the vault, but you cannot take money back out \u2014 there is no withdrawal instruction in the program yet. It is the biggest gap in the product, and it is first on the roadmap.",
    warning: true,
  },
  {
    id: "pulse",
    n: "04",
    title: "Send a pulse every 30 days",
    time: "Several minutes",
    body: "This is the part people ask about. Once a month you send a receipt that says \"the owner is alive.\" The blockchain checks the receipt for itself. Nobody has to trust you, and nobody has to trust a company.",
    detail:
      "Being honest about this: on a normal laptop the receipt takes between four and eight minutes to produce, so this step is not yet quick enough to do comfortably every month. We are working on it. Everything else in the product works today.",
    warning: true,
  },
  {
    id: "safe",
    n: "05",
    title: "If you stop sending pulses",
    time: "48 hours",
    body: "After 30 days without one, anyone can report it. Your money does not move. A 48-hour window opens instead, and if you send a pulse in that time, everything resets as if nothing happened.",
    detail:
      "That delay is the whole point. It means a dropped connection, a flat battery, or a full phone cannot hand your estate to someone else. The money only moves after 48 hours of genuine silence.",
  },
];

const FAQ = [
  {
    q: "Can I take the money back out?",
    a: "Not right now. Deposits work, but the program has no withdrawal instruction \u2014 what you put in stays until the estate is released. It is the biggest gap in the product. On devnet this costs nothing, since the coins are worthless.",
    warning: true,
  },
  {
    q: "What if I get an address wrong?",
    a: "The heirs cannot be edited after the vault exists. Check every address carefully before depositing \u2014 a typo sends the money somewhere you cannot undo.",
    warning: true,
  },
  {
    q: "Does this replace a will?",
    a: "No, and it should not be treated as one. This decides who gets the crypto, and only the crypto. Property, dependents, tax, and anything contested still belong with a lawyer.",
  },
  {
    q: "Who can see my estate?",
    a: "Anyone can see that a vault exists, who the heirs are, and roughly how much is in it. That is the honest answer, and it is written up in the repository rather than hidden.",
  },
  {
    q: "What does it cost?",
    a: "Nothing while you are alive. A 0.5% fee is charged once, only at the moment money actually moves to your heirs, and it comes out before the split -- so it does not reduce anyone's share.",
  },
  {
    q: "Is this safe to use with real money?",
    a: "Not yet. This runs on Solana devnet, where the coins are test coins with no value. There has been no outside security review. Use it to see how it works, not to protect anything you would miss.",
    warning: true,
  },
];

export function HowToUse() {
  const [open, setOpen] = useState<StepId | null>("connect");

  return (
    <Section id="how-to-use">
      <Container>
        <SectionHeader
          eyebrow="Start here"
          title="What you would actually do."
          lede="Five steps. None of them require you to understand cryptography, run a terminal, or trust anybody. If you can send money from a wallet, you can use this."
        />

        {/* Steps */}
        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line/12 bg-line/12 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step) => {
            const isOpen = open === step.id;
            return (
              <li key={step.id} className="bg-canvas">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : step.id)}
                  aria-expanded={isOpen}
                  className="flex h-full w-full flex-col items-start gap-2 px-4 py-5 text-left transition-colors duration-150 ease-standard hover:bg-ink/[0.03]"
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="font-mono text-xs text-faint">{step.n}</span>
                    {step.warning ? (
                      <span className="text-[0.625rem] font-semibold uppercase tracking-wide text-ember">
                        note
                      </span>
                    ) : (
                      <span className="text-[0.625rem] uppercase tracking-wide text-faint">
                        {step.time}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-medium leading-snug text-ink">{step.title}</span>
                  <span
                    aria-hidden
                    className={`mt-auto text-faint transition-transform duration-200 ease-standard ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen ? (
                  <div className="border-t border-line/10 px-4 py-4">
                    <p className="pretty text-sm leading-relaxed text-ink">{step.body}</p>
                    <p className="pretty mt-3 text-sm leading-relaxed text-muted">
                      {step.detail}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>

        {/* FAQ */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="label">Questions people actually ask</p>
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              The parts nobody demos
            </h3>
            <p className="pretty mt-3 text-sm leading-relaxed text-muted">
              Every answer below is also true in the source, because the repository documents the
              same limits.
            </p>
            <div className="mt-5">
              <Pill tone="warn">devnet · not audited</Pill>
            </div>
          </div>

          <dl className="divide-y divide-line/10 border-y border-line/10">
            {FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="flex items-start gap-2.5 text-sm font-medium text-ink">
                  {item.q}
                  {item.warning ? (
                    <span className="mt-0.5 shrink-0 text-[0.625rem] font-semibold uppercase tracking-wide text-ember">
                      read
                    </span>
                  ) : null}
                </dt>
                <dd className="pretty mt-2 text-sm leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12">
          <Footnote>
            Two things this section will not pretend: sending a monthly pulse currently takes four
            to eight minutes on ordinary hardware, and this runs on devnet with test coins only.
            Both are tracked in the roadmap.
          </Footnote>
        </div>
      </Container>
    </Section>
  );
}