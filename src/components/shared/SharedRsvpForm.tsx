import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Check, CheckCircle2, Copy, MessageCircle, Minus, Plus, Send, Users, X } from 'lucide-react';
import type { EventConfig } from '../../config/event';
import {
  buildWhatsAppRsvpMessage,
  buildWhatsAppRsvpUrl,
  clearSavedRsvp,
  MAX_ADULTS,
  MAX_CHILDREN,
  MAX_MESSAGE_LENGTH,
  validateRsvpInput,
  type RsvpFormValues,
  type RsvpRecord,
  type RsvpValidationErrors,
} from '../../domain/rsvp';
import { copyToClipboard } from '../../utils/clipboard';
import { fireSafeConfetti } from '../../utils/confetti';
import { playEnvelopeOpenChime, playStampSound } from '../../utils/soundEffects';

export interface SharedRsvpFormProps {
  readonly config: EventConfig;
  readonly isMuted?: boolean;
  readonly confettiColors?: readonly string[];
  readonly onSuccess?: (record: RsvpRecord) => void;
  readonly submitLabel?: string;
  readonly accentClassName?: string;
  readonly headingSlot?: ReactNode;
}

const DEFAULT_FORM_VALUES: RsvpFormValues = {
  guestName: '',
  attending: true,
  adults: 1,
  children: 0,
  message: '',
};

export function SharedRsvpForm({
  config,
  isMuted = false,
  confettiColors = ['#1B4332', '#235B8C', '#E09F24', '#4D8B55'],
  onSuccess,
  submitLabel = 'Confirmar por WhatsApp',
  accentClassName = 'border-[#1E8E3E] bg-[#1E8E3E]',
  headingSlot,
}: SharedRsvpFormProps) {
  const [formValues, setFormValues] = useState<RsvpFormValues>(DEFAULT_FORM_VALUES);
  const [lastSubmitted, setLastSubmitted] = useState<RsvpRecord | null>(null);
  const [errors, setErrors] = useState<RsvpValidationErrors>({});
  const [copiedMsg, setCopiedMsg] = useState(false);

  useEffect(() => {
    clearSavedRsvp();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateRsvpInput(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const record: RsvpRecord = {
      ...formValues,
      guestName: formValues.guestName.trim(),
      adults: formValues.attending ? formValues.adults : 0,
      children: formValues.attending ? formValues.children : 0,
      message: formValues.message.trim(),
      submittedAt: new Date().toISOString(),
    };

    if (record.attending) {
      playStampSound(isMuted);
      playEnvelopeOpenChime(isMuted);
      fireSafeConfetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.72 },
        colors: [...confettiColors],
      });
    }

    const whatsappUrl = buildWhatsAppRsvpUrl(record, config);
    if (typeof window !== 'undefined' && typeof window.open === 'function') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    setLastSubmitted(record);
    setCopiedMsg(false);
    setErrors({});
    setFormValues(DEFAULT_FORM_VALUES);
    onSuccess?.(record);
  };

  const handleCopyMessage = async () => {
    if (!lastSubmitted) {
      return;
    }
    const text = buildWhatsAppRsvpMessage(lastSubmitted, config);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedMsg(true);
      window.setTimeout(() => setCopiedMsg(false), 2600);
    }
  };

  return (
    <div className="w-full">
      {headingSlot}

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        <div>
          <label htmlFor="guest-name" className="block text-sm font-bold text-[#3D240F]">
            Nombre o familia *
          </label>
          <input
            id="guest-name"
            type="text"
            required
            maxLength={80}
            placeholder="Ej. Familia Martínez o Laura Gómez"
            value={formValues.guestName}
            onChange={(event) => {
              setFormValues((prev) => ({ ...prev, guestName: event.target.value }));
              if (errors.guestName) {
                setErrors((prev) => ({ ...prev, guestName: undefined }));
              }
            }}
            className="mt-1.5 w-full rounded-2xl border-2 border-[#8B6136]/40 bg-white px-4 py-3 text-sm font-semibold text-[#261B10] placeholder:text-[#7B6550] focus:border-[#1B4332] focus:outline-none"
          />
          {errors.guestName && (
            <p role="alert" className="mt-1 text-xs font-bold text-[#B91C1C]">
              {errors.guestName}
            </p>
          )}
        </div>

        <div>
          <span className="block text-sm font-bold text-[#3D240F]">¿Nos acompañas?</span>
          <div className="mt-1.5 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setFormValues((prev) => ({ ...prev, attending: true }))}
              className={`cursor-pointer rounded-2xl border-2 px-3 py-2.5 text-xs font-bold transition sm:text-sm ${
                formValues.attending
                  ? 'border-[#1B4332] bg-[#1B4332] text-white shadow'
                  : 'border-[#8B6136]/35 bg-white text-[#3D240F] hover:bg-[#FAF3DF]'
              }`}
            >
              Sí, allá estaremos
            </button>
            <button
              type="button"
              onClick={() => setFormValues((prev) => ({ ...prev, attending: false }))}
              className={`cursor-pointer rounded-2xl border-2 px-3 py-2.5 text-xs font-bold transition sm:text-sm ${
                !formValues.attending
                  ? 'border-[#6F4220] bg-[#6F4220] text-white shadow'
                  : 'border-[#8B6136]/35 bg-white text-[#3D240F] hover:bg-[#FAF3DF]'
              }`}
            >
              No podremos asistir
            </button>
          </div>
        </div>

        {formValues.attending && (
          <div className="grid grid-cols-2 gap-3 rounded-2xl border-2 border-dashed border-[#3F7D4C]/45 bg-white/90 p-3.5">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#3D240F]">
                <Users className="h-3.5 w-3.5 text-[#1B4332]" aria-hidden="true" />
                <span>Adultos</span>
              </span>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Restar adulto"
                  onClick={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      adults: Math.min(MAX_ADULTS, Math.max(1, prev.adults - 1)),
                    }))
                  }
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#8B6136]/40 bg-[#FAF3DF]"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-6 text-center text-base font-extrabold text-[#1B4332]">
                  {formValues.adults}
                </span>
                <button
                  type="button"
                  aria-label="Sumar adulto"
                  onClick={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      adults: Math.min(MAX_ADULTS, Math.max(1, prev.adults + 1)),
                    }))
                  }
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#8B6136]/40 bg-[#FAF3DF]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div>
              <span className="block text-xs font-bold text-[#3D240F]">Niños</span>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Restar niño"
                  onClick={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      children: Math.min(MAX_CHILDREN, Math.max(0, prev.children - 1)),
                    }))
                  }
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#8B6136]/40 bg-[#FAF3DF]"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-6 text-center text-base font-extrabold text-[#1B4332]">
                  {formValues.children}
                </span>
                <button
                  type="button"
                  aria-label="Sumar niño"
                  onClick={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      children: Math.min(MAX_CHILDREN, Math.max(0, prev.children + 1)),
                    }))
                  }
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#8B6136]/40 bg-[#FAF3DF]"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="guest-message" className="block text-sm font-bold text-[#3D240F]">
            Mensaje para Jacobo (opcional)
          </label>
          <textarea
            id="guest-message"
            rows={3}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Déjale un lindo deseo para su primer añito..."
            value={formValues.message}
            onChange={(event) =>
              setFormValues((prev) => ({ ...prev, message: event.target.value }))
            }
            className="mt-1.5 w-full rounded-2xl border-2 border-[#8B6136]/40 bg-white px-4 py-2.5 text-sm font-semibold text-[#261B10] placeholder:text-[#7B6550] focus:border-[#1B4332] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-b-4 px-5 py-3.5 text-base font-bold text-white shadow-lg transition active:translate-y-0.5 ${accentClassName}`}
        >
          <Send className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
          <span>{submitLabel}</span>
        </button>
      </form>

      {lastSubmitted && (
        <div role="status" className="mt-4 rounded-2xl border-2 border-[#1B4332]/30 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1B4332]" aria-hidden="true" />
              <p className="text-xs font-bold text-[#261B10] sm:text-sm">
                Respuesta lista para {lastSubmitted.guestName}. Si WhatsApp no se abrió, usa estas opciones:
              </p>
            </div>
            <button
              type="button"
              aria-label="Cerrar aviso de confirmación"
              onClick={() => setLastSubmitted(null)}
              className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6F4220] hover:bg-[#FAF3DF]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={buildWhatsAppRsvpUrl(lastSubmitted, config)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border-b-2 border-[#15692c] bg-[#1E8E3E] px-3.5 py-2 text-xs font-bold text-white"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Abrir WhatsApp de nuevo</span>
            </a>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#6F4220]/30 bg-[#FAF3DF] px-3.5 py-2 text-xs font-bold text-[#4E2E14]"
            >
              {copiedMsg ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#1B4332]" aria-hidden="true" />
                  <span>¡Mensaje copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copiar mensaje</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
