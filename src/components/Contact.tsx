"use client";

import { Mail } from "lucide-react";
import { track } from "@/lib/track";
import ButtonArrow, { arrowLink } from "@/components/ButtonArrow";
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { contact, site } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "/api/contact";

type Status = "idle" | "sending" | "success" | "error";

/** Dark-form field. Focus: Klein Blue border + soft glow. Error: Chilli Red border. */
const fieldBase =
  "w-full rounded-2xl bg-white/[0.06] px-4 py-3.5 text-base font-normal text-white outline-none ring-1 transition-[box-shadow,background-color] duration-200 placeholder:font-normal placeholder:text-white/40 focus:bg-white/[0.08] focus:ring-2 focus:ring-accent focus:shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent-bright)_28%,transparent)]";
const fieldClass = (invalid: boolean) => `${fieldBase} ${invalid ? "ring-brand-red focus:ring-brand-red" : "ring-white/15"}`;
const labelClass = "mb-2 block text-sm text-white/75";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(name: FieldName, value: string): string {
  const v = value.trim();
  if (name === "name") return v ? "" : "Please enter your name.";
  if (name === "email") {
    if (!v) return "Please enter your email.";
    return EMAIL_RE.test(v) ? "" : "Please enter a valid email, e.g. john@company.com.";
  }
  return v ? "" : "Please add a short message.";
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className="mt-1.5 min-h-[1.25rem] text-[13px] text-brand-red" aria-live="polite">
      {message}
    </p>
  );
}

export default function Contact({
  defaultService = "",
  asPage = false,
  aside,
}: {
  /** Pre-selects this service title in the dropdown. */
  defaultService?: string;
  /** Use as the top of a page: renders an h1 and leaves room for the navbar. */
  asPage?: boolean;
  /** Extra content under the phone and address (hours, socials, map). */
  aside?: ReactNode;
}) {
  const H = asPage ? "h1" : "h2";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [budget, setBudget] = useState(contact.budgets[1]);
  const [service, setService] = useState(defaultService);
  const [errors, setErrors] = useState<Errors>({});
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    setErrors((prev) => ({ ...prev, [name]: validate(name, e.target.value) }));
  };
  // Clear an error as soon as the field becomes valid while typing.
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validate(name, e.target.value) }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const next: Errors = {};
    for (const n of ["name", "email", "message"] as FieldName[]) {
      const msg = validate(n, String(data[n] ?? ""));
      if (msg) next[n] = msg;
    }
    setErrors(next);
    const firstInvalid = (Object.keys(next) as FieldName[])[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      track("generate_lead", { form: "contact" });
      form.reset();
      setService(defaultService);
      setErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className={`relative isolate overflow-clip bg-brand-black text-white ${asPage ? "contact-page-end pt-36 sm:pt-44" : "section-y"}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]">
        <div className="absolute -left-[300px] -top-[140px] h-[780px] w-[780px] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_50%,transparent)_35%,transparent)]" />
        <div className="absolute -right-[300px] -bottom-[140px] h-[700px] w-[700px] bg-[radial-gradient(closest-side,rgb(255_112_1/0.3)_35%,transparent)]" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-[1fr_1.15fr]">
        {/* Pin the shorter column: the left one normally; the form when an `aside` makes the left column taller (/contact). */}
        <div className={aside ? "" : "contact-pin"}>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/75">{contact.eyebrow}</p>
          <H className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.92]">
            <span className="block">{contact.lines[0]}</span>
            <span className="block text-brand-orange">{contact.lines[1]}</span>
            <span className="block">{contact.lines[2]}</span>
          </H>
          <p className="mt-6 max-w-md text-lg text-white/75">{contact.intro}</p>
          <div className="mt-10 space-y-3">
            <a href={site.phoneHref} className="block font-display text-3xl font-semibold tracking-tight hover:text-brand-orange">
              {site.phone}
            </a>
            <a href={site.emailHref} className="inline-flex items-center gap-2.5 text-lg font-semibold text-white hover:text-brand-orange">
              <Mail size={20} strokeWidth={1.9} aria-hidden="true" className="text-brand-orange" />
              {site.email}
            </a>
            {/* /contact shows the address in its location card instead. */}
            {!aside && (
              <a href={site.address.mapsHref} target="_blank" rel="noopener noreferrer" className="block text-white/75 hover:text-white">
                {site.address.full}
              </a>
            )}
          </div>
          {aside}
        </div>

        {/* Right cell stretches to the row height; on /contact the card inside it is sticky, so both columns end on the same line. */}
        <div className="self-stretch">
        <div className={`relative rounded-[28px] bg-white/[0.04] p-6 ring-1 ring-white/10 sm:p-8 ${aside ? "contact-pin-form" : ""}`}>
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <m.div
                key="ok"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease }}
                className="flex min-h-[520px] flex-col items-center justify-center text-center"
                role="status"
              >
                <m.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.1 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange"
                >
                  <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true">
                    <m.path
                      d="M5 12.5 10 17.5 19 7"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.35, duration: 0.5, ease }}
                    />
                  </svg>
                </m.span>
                <h3 className="mt-6 text-3xl font-semibold">{contact.success.title}</h3>
                <p className="mt-2 text-white/75">{contact.success.body}</p>
                <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-sm font-semibold text-brand-orange">
                  Send another message
                </button>
              </m.div>
            ) : (
              <m.form key="form" onSubmit={onSubmit} exit={{ opacity: 0, y: -10 }} className="grid gap-x-4 gap-y-2 sm:grid-cols-2" noValidate>
                <div>
                  <label htmlFor={id("name")} className={labelClass}>
                    Name *
                  </label>
                  <input
                    id={id("name")}
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder="e.g. John Smith"
                    aria-invalid={!!errors.name}
                    aria-describedby={id("name-error")}
                    onBlur={onBlur}
                    onChange={onChange}
                    className={fieldClass(!!errors.name)}
                  />
                  <FieldError id={id("name-error")} message={errors.name} />
                </div>
                <div>
                  <label htmlFor={id("email")} className={labelClass}>
                    Email *
                  </label>
                  <input
                    id={id("email")}
                    name="email"
                    type="email"
                    inputMode="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    placeholder="e.g. john@company.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={id("email-error")}
                    onBlur={onBlur}
                    onChange={onChange}
                    className={fieldClass(!!errors.email)}
                  />
                  <FieldError id={id("email-error")} message={errors.email} />
                </div>
                <div>
                  <label htmlFor={id("phone")} className={labelClass}>
                    Phone
                  </label>
                  <input
                    id={id("phone")}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    maxLength={40}
                    autoComplete="tel"
                    placeholder="e.g. (647) 555-0123"
                    className={fieldClass(false)}
                  />
                  <FieldError id={id("phone-error")} />
                </div>
                <div>
                  <label htmlFor={id("company")} className={labelClass}>
                    Company / website
                  </label>
                  <input
                    id={id("company")}
                    name="company"
                    type="text"
                    inputMode="url"
                    maxLength={200}
                    autoComplete="organization"
                    placeholder="e.g. yourcompany.ca"
                    className={fieldClass(false)}
                  />
                  <FieldError id={id("company-error")} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={id("service")} className={labelClass}>
                    Service
                  </label>
                  <div className="relative">
                    <select
                      id={id("service")}
                      name="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className={`${fieldClass(false)} appearance-none pr-11 ${service ? "text-white" : "text-white/40"}`}
                    >
                      <option value="" disabled className="text-brand-black">
                        Select a service
                      </option>
                      {contact.services.map((sv) => (
                        <option key={sv} value={sv} className="text-brand-black">
                          {sv}
                        </option>
                      ))}
                    </select>
                    <svg viewBox="0 0 12 12" className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-white/60" aria-hidden="true">
                      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <FieldError id={id("service-error")} />
                </div>
                <fieldset className="sm:col-span-2">
                  <legend className="mb-2 text-sm text-white/75">Monthly budget</legend>
                  <div className="flex flex-wrap gap-2">
                    {contact.budgets.map((b) => (
                      <label key={b} className="cursor-pointer">
                        <input
                          type="radio"
                          name="budget"
                          value={b}
                          checked={budget === b}
                          onChange={() => setBudget(b)}
                          className="peer sr-only"
                        />
                        <span className="block rounded-full px-4 py-2 text-sm ring-1 ring-white/20 transition-colors peer-checked:bg-white peer-checked:text-brand-black peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                          {b}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="mt-4 sm:col-span-2">
                  <label htmlFor={id("message")} className={labelClass}>
                    Message *
                  </label>
                  <textarea
                    id={id("message")}
                    name="message"
                    required
                    rows={4}
                    maxLength={5000}
                    placeholder="Tell us about your business, your goals and what's not working right now…"
                    aria-invalid={!!errors.message}
                    aria-describedby={id("message-error")}
                    onBlur={onBlur}
                    onChange={onChange}
                    className={`${fieldClass(!!errors.message)} resize-none`}
                  />
                  <FieldError id={id("message-error")} message={errors.message} />
                </div>
                {/* Honeypot: hidden from people, bots fill it in */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-brand-red" role="alert">
                    {status === "error" ? error : ""}
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className={`${arrowLink} justify-center rounded-full bg-brand-orange px-7 py-4 font-semibold text-white transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 disabled:opacity-60`}
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                    {status !== "sending" && <ButtonArrow />}
                  </button>
                </div>
              </m.form>
            )}
          </AnimatePresence>
        </div>
        </div>
      </div>
    </section>
  );
}
