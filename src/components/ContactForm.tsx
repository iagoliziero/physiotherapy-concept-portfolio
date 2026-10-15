"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { whatsappLink } from "@/config/site";
import { treatments } from "@/data/content";

type Field = "name" | "phone" | "treatment";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

/** Regras de validação inline de cada campo. */
const rules: Record<Field, { test: (v: string) => boolean; message: string }> = {
  name: { test: (v) => v.trim().length >= 3, message: "Digite seu nome completo." },
  phone: { test: (v) => v.replace(/\D/g, "").length >= 10, message: "Informe um WhatsApp válido com DDD." },
  treatment: { test: (v) => v.length > 0, message: "Escolha um tratamento." },
};

const fields = Object.keys(rules) as Field[];

/** Formulário de agendamento com validação inline e acessível. */
export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", phone: "", treatment: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const update = (field: Field) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
    setSent(false);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found: Errors = {};
    for (const field of fields) {
      if (!rules[field].test(values[field])) found[field] = rules[field].message;
    }
    setErrors(found);

    const firstInvalid = fields.find((f) => found[f]);
    if (firstInvalid) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      setSent(false);
      return;
    }
    // O pedido chega ao Luis pelo WhatsApp: o formulário só valida e monta a mensagem
    setSent(true);
  };

  const fieldProps = (field: Field) => ({
    id: `contato-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": `contato-${field}-erro`,
  });

  const message = `Olá, Luis! Sou ${values.name.trim()} e quero agendar uma avaliação (${values.treatment}). Meu WhatsApp é ${values.phone.trim()}.`;

  return (
    <form className="glass contact__form reveal" noValidate onSubmit={onSubmit} aria-label="Agendamento">
      <label className="sr-only" htmlFor="contato-name">
        Nome
      </label>
      <input {...fieldProps("name")} placeholder="Seu nome" autoComplete="name" />
      <div className="field-error" id="contato-name-erro">
        {errors.name}
      </div>

      <label className="sr-only" htmlFor="contato-phone">
        WhatsApp com DDD
      </label>
      <input {...fieldProps("phone")} type="tel" placeholder="(11) 99999-0000" inputMode="tel" autoComplete="tel" />
      <div className="field-error" id="contato-phone-erro">
        {errors.phone}
      </div>

      <label className="sr-only" htmlFor="contato-treatment">
        Tratamento
      </label>
      <select {...fieldProps("treatment")}>
        <option value="">Qual tratamento?</option>
        {treatments.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <div className="field-error" id="contato-treatment-erro">
        {errors.treatment}
      </div>

      <button className="btn btn-primary btn--block mag" type="submit">
        Agendar avaliação
      </button>

      <div className="form-status" role="status">
        {sent ? (
          <>
            <p>Seu pedido está pronto. Envie pelo WhatsApp para eu confirmar o horário.</p>
            <a
              className="btn btn-ghost btn--block form-status__send"
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enviar pelo WhatsApp
            </a>
          </>
        ) : null}
      </div>
    </form>
  );
}
