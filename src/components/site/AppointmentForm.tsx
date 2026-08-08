import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { serviceOptions, timeSlots } from "@/lib/site";

type FieldErrors = Record<string, string>;

const initial = {
  full_name: "",
  phone: "",
  whatsapp: "",
  email: "",
  service: "",
  preferred_date: "",
  preferred_time: "",
  people_count: "1",
  message: "",
};

function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

const fieldClass =
  "mt-2 w-full rounded-sm border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent";

export function AppointmentForm({ defaultService }: { defaultService?: string }) {
  const [values, setValues] = useState({
    ...initial,
    service: defaultService && serviceOptions.includes(defaultService as never) ? defaultService : "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (key: keyof typeof initial) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  function validate() {
    const next: FieldErrors = {};
    const name = values.full_name.trim();
    if (name.length < 2) next['full_name'] = "Please enter your full name.";
    if (name.length > 100) next['full_name'] = "Name must be under 100 characters.";

    const phone = values.phone.replace(/[\s-]/g, "");
    if (!/^(\+91)?[6-9]\d{9}$/.test(phone)) next['phone'] = "Enter a valid 10-digit mobile number.";

    if (values.whatsapp.trim()) {
      const wa = values.whatsapp.replace(/[\s-]/g, "");
      if (!/^(\+91)?[6-9]\d{9}$/.test(wa)) next['whatsapp'] = "Enter a valid 10-digit number.";
    }

    if (values.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
        next['email'] = "Enter a valid email address.";
    }

    if (!values.service) next['service'] = "Please choose a service.";
    if (!values.preferred_date) next['preferred_date'] = "Please choose a date.";
    else if (values.preferred_date < todayISO()) next['preferred_date'] = "Please choose today or a later date.";

    if (!values.preferred_time) next['preferred_time'] = "Please choose a time slot.";
    else if (!timeSlots.includes(values.preferred_time))
      next['preferred_time'] = "Please choose a slot between 9:00 AM and 7:00 PM.";

    const people = Number(values.people_count || "1");
    if (!Number.isInteger(people) || people < 1 || people > 50)
      next['people_count'] = "Enter a number between 1 and 50.";

    if (values.message.length > 1000) next['message'] = "Please keep it under 1000 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    setStatus("sending");
    setErrorMessage("");

    const { error } = await supabase.from("appointments").insert({
      full_name: values.full_name.trim(),
      phone: values.phone.trim(),
      whatsapp: values.whatsapp.trim() || null,
      email: values.email.trim() || null,
      service: values.service,
      preferred_date: values.preferred_date,
      preferred_time: values.preferred_time,
      people_count: Number(values.people_count || "1"),
      message: values.message.trim() || null,
    });

    if (error) {
      setStatus("error");
      setErrorMessage("We couldn't send your request just now. Please try again or call us directly.");
      return;
    }

    setStatus("sent");
    setValues(initial);
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-accent/40 bg-secondary/60 p-10 text-center">
        <p className="eyebrow text-accent-foreground/70">Request received</p>
        <h3 className="mt-4 text-2xl text-primary sm:text-3xl">
          Thank you for choosing Queen Clozet.
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Your appointment request has been received. We will contact you shortly to confirm your
          appointment.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 rounded-sm border border-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <Field label="Full Name" required error={errors['full_name']}>
        <input
          className={fieldClass}
          value={values.full_name}
          onChange={(e) => set("full_name")(e.target.value)}
          autoComplete="name"
          maxLength={100}
        />
      </Field>

      <Field label="Mobile Number" required error={errors['phone']}>
        <input
          className={fieldClass}
          value={values.phone}
          onChange={(e) => set("phone")(e.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
        />
      </Field>

      <Field label="WhatsApp Number" error={errors['whatsapp']}>
        <input
          className={fieldClass}
          value={values.whatsapp}
          onChange={(e) => set("whatsapp")(e.target.value)}
          inputMode="tel"
          placeholder="Optional"
        />
      </Field>

      <Field label="Email Address" error={errors['email']}>
        <input
          className={fieldClass}
          value={values.email}
          onChange={(e) => set("email")(e.target.value)}
          type="email"
          autoComplete="email"
          placeholder="Optional"
        />
      </Field>

      <Field label="Service Required" required error={errors['service']}>
        <select
          className={fieldClass}
          value={values.service}
          onChange={(e) => set("service")(e.target.value)}
        >
          <option value="">Select a service</option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Number of People" error={errors['people_count']}>
        <input
          className={fieldClass}
          value={values.people_count}
          onChange={(e) => set("people_count")(e.target.value)}
          type="number"
          min={1}
          max={50}
        />
      </Field>

      <Field label="Preferred Date" required error={errors['preferred_date']}>
        <input
          className={fieldClass}
          value={values.preferred_date}
          onChange={(e) => set("preferred_date")(e.target.value)}
          type="date"
          min={todayISO()}
        />
      </Field>

      <Field label="Preferred Time" required error={errors['preferred_time']}>
        <select
          className={fieldClass}
          value={values.preferred_time}
          onChange={(e) => set("preferred_time")(e.target.value)}
        >
          <option value="">Select a slot (9:00 AM – 7:00 PM)</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message / Requirements" error={errors['message']} className="sm:col-span-2">
        <textarea
          className={`${fieldClass} min-h-32 resize-y`}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          maxLength={1000}
          placeholder="Tell us what you have in mind — design ideas, occasion, or the craft you'd like to learn."
        />
      </Field>

      <div className="sm:col-span-2">
        {status === "error" ? (
          <p className="mb-4 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-sm bg-primary px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? "Sending request…" : "Request Appointment"}
        </button>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          This is an appointment request, not an instant confirmation. We will contact you to confirm
          the date and time. No payment is collected online.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
        {required ? <span className="text-accent-foreground"> *</span> : null}
      </span>
      {children}
      {error ? <span className="mt-2 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
