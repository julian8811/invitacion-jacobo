import { useState, type FormEvent } from 'react';
import { Check, CheckCircle2, Copy, Edit3, MessageCircle, Minus, Plus, Send, Users } from 'lucide-react';
import type { EventConfig } from '../config/event';
import { PROPOSAL_BY_ID } from '../proposals/themes';
import type { ProposalTheme } from '../proposals/types';
import { copyToClipboard } from '../utils/clipboard';
import { fireSafeConfetti } from '../utils/confetti';
import { playEnvelopeOpenChime } from '../utils/soundEffects';
import {
  buildWhatsAppRsvpMessage,
  buildWhatsAppRsvpUrl,
  loadSavedRsvp,
  MAX_ADULTS,
  MAX_CHILDREN,
  MAX_MESSAGE_LENGTH,
  saveRsvp,
  validateRsvpInput,
  type RsvpFormValues,
  type RsvpRecord,
  type RsvpValidationErrors,
} from '../domain/rsvp';

interface RsvpSectionProps {
  readonly config: EventConfig;
  readonly theme?: ProposalTheme;
  readonly isMuted?: boolean;
}

const DEFAULT_FORM_VALUES: RsvpFormValues = {
  guestName: '',
  attending: true,
  adults: 1,
  children: 0,
  message: '',
};

export function RsvpSection({
  config,
  theme = PROPOSAL_BY_ID.explorador,
  isMuted = false,
}: RsvpSectionProps) {
  const [savedRecord, setSavedRecord] = useState<RsvpRecord | null>(() => loadSavedRsvp());
  const [formValues, setFormValues] = useState<RsvpFormValues>(() =>
    savedRecord
      ? {
          guestName: savedRecord.guestName,
          attending: savedRecord.attending,
          adults: savedRecord.adults,
          children: savedRecord.children,
          message: savedRecord.message,
        }
      : DEFAULT_FORM_VALUES,
  );
  const [isEditing, setIsEditing] = useState(() => savedRecord === null);
  const [errors, setErrors] = useState<RsvpValidationErrors>({});
  const [copiedMsg, setCopiedMsg] = useState(false);

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

    saveRsvp(record);
    setSavedRecord(record);
    setIsEditing(false);

    if (record.attending) {
      playEnvelopeOpenChime(isMuted);
      fireSafeConfetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.72 },
        colors: [...theme.confettiColors],
      });
    }

    const whatsappUrl = buildWhatsAppRsvpUrl(record, config);
    if (typeof window !== 'undefined' && typeof window.open === 'function') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEdit = () => {
    if (savedRecord) {
      setFormValues({
        guestName: savedRecord.guestName,
        attending: savedRecord.attending,
        adults: savedRecord.attending ? Math.max(1, savedRecord.adults) : 1,
        children: savedRecord.attending ? savedRecord.children : 0,
        message: savedRecord.message,
      });
    }
    setErrors({});
    setIsEditing(true);
  };

  const handleCopyMessage = async () => {
    if (!savedRecord) {
      return;
    }
    const text = buildWhatsAppRsvpMessage(savedRecord, config);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedMsg(true);
      window.setTimeout(() => setCopiedMsg(false), 2600);
    }
  };

  const adjustAdults = (delta: number) => {
    setFormValues((prev) => ({
      ...prev,
      adults: Math.min(MAX_ADULTS, Math.max(1, prev.adults + delta)),
    }));
  };

  const adjustChildren = (delta: number) => {
    setFormValues((prev) => ({
      ...prev,
      children: Math.min(MAX_CHILDREN, Math.max(0, prev.children + delta)),
    }));
  };

  const cardSurface =
    theme.id === 'selva-viva'
      ? 'selva-treehouse-card'
      : theme.id === 'campamento'
        ? 'camp-parchment-card'
        : 'explorer-journal';

  const mascotRing =
    theme.id === 'selva-viva'
      ? 'border-4 border-[#2168B0] bg-[#EAF7FF]'
      : theme.id === 'campamento'
        ? 'border-4 border-[#D7A645] bg-[#14362B]'
        : 'border-4 border-[#D98A2B] bg-[#F5EEDB]';

  const activeToggleClass =
    theme.id === 'selva-viva'
      ? 'border-[#2168B0] bg-[#2168B0] text-white shadow'
      : theme.id === 'campamento'
        ? 'border-[#173E31] bg-[#173E31] text-[#F6BD3A] shadow'
        : 'border-[#1B4332] bg-[#1B4332] text-white shadow';

  return (
    <section id="rsvp" aria-labelledby="rsvp-heading" className="px-4 py-6">
      <div className={`${cardSurface} mx-auto max-w-3xl overflow-hidden rounded-[2.25rem] p-6 sm:p-8`}>
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="w-40 shrink-0 text-center md:w-44">
            <div className={`mx-auto h-40 w-40 overflow-hidden rounded-full shadow-lg ${mascotRing}`}>
              <img
                src={theme.assets.rsvpMascot}
                alt={theme.assets.mascotAlt}
                className="animate-sway h-full w-full scale-[1.04] object-cover"
              />
            </div>
            <p className="font-hand mt-2 text-xl text-[#1B4332]">{theme.copy.rsvpBadgeText}</p>
          </div>

          <div className="min-w-0 w-full flex-1">
            <p
              className={`font-hand text-xl ${
                theme.id === 'selva-viva'
                  ? 'text-[#2168B0]'
                  : theme.id === 'campamento'
                    ? 'text-[#8B5223]'
                    : 'text-[#B4691E]'
              }`}
            >
              {theme.copy.rsvpEyebrow}
            </p>
            <h2
              id="rsvp-heading"
              className={`font-display text-2xl font-bold sm:text-3xl ${
                theme.id === 'selva-viva'
                  ? 'text-[#1E7E45]'
                  : theme.id === 'campamento'
                    ? 'text-[#112A20]'
                    : 'text-[#4E2E14]'
              }`}
            >
              {config.rsvpHeading}
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#3D240F]/85">
              Al confirmar, abriremos WhatsApp con tu mensaje listo para enviarlo al instante.
            </p>

            {!isEditing && savedRecord ? (
              <div className="mt-5 rounded-3xl border-2 border-[#1B4332]/30 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#1B4332]" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#1B4332]">
                      ¡Confirmación guardada!
                    </h3>
                    <p className="mt-1 text-sm font-bold text-[#261B10]">
                      {savedRecord.guestName} ·{' '}
                      {savedRecord.attending
                        ? `Sí asistiremos (${savedRecord.adults} ${
                            savedRecord.adults === 1 ? 'adulto' : 'adultos'
                          }${
                            savedRecord.children > 0
                              ? `, ${savedRecord.children} ${savedRecord.children === 1 ? 'niño' : 'niños'}`
                              : ''
                          })`
                        : 'No podremos asistir en esta ocasión'}
                    </p>
                    {savedRecord.message && (
                      <p className="mt-2 rounded-2xl bg-[#F5EEDB]/75 p-3 text-sm italic text-[#4E2E14]">
                        “{savedRecord.message}”
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <a
                    href={buildWhatsAppRsvpUrl(savedRecord, config)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-b-4 border-[#15692c] bg-[#1E8E3E] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#177030] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E8E3E]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Enviar confirmación por WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-[#6F4220]/30 bg-[#FAF3DF] px-4 py-2.5 text-xs font-bold text-[#4E2E14] transition hover:bg-[#f1e4c2] sm:text-sm"
                  >
                    {copiedMsg ? (
                      <>
                        <Check className="h-4 w-4 text-[#1B4332]" aria-hidden="true" />
                        <span>¡Mensaje copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        <span>Copiar mensaje</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleEdit}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-[#1B4332] underline underline-offset-2 transition hover:text-[#112A20] sm:text-sm"
                  >
                    <Edit3 className="h-4 w-4" aria-hidden="true" />
                    <span>Editar confirmación</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
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
                          ? activeToggleClass
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
                          onClick={() => adjustAdults(-1)}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#8B6136]/40 bg-[#FAF3DF] text-[#3D240F] hover:bg-[#efe3c2]"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-6 text-center text-base font-extrabold text-[#1B4332]">
                          {formValues.adults}
                        </span>
                        <button
                          type="button"
                          aria-label="Sumar adulto"
                          onClick={() => adjustAdults(1)}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#8B6136]/40 bg-[#FAF3DF] text-[#3D240F] hover:bg-[#efe3c2]"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      {errors.adults && (
                        <p role="alert" className="mt-1 text-xs font-bold text-[#B91C1C]">
                          {errors.adults}
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-[#3D240F]">Niños</span>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Restar niño"
                          onClick={() => adjustChildren(-1)}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#8B6136]/40 bg-[#FAF3DF] text-[#3D240F] hover:bg-[#efe3c2]"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-6 text-center text-base font-extrabold text-[#1B4332]">
                          {formValues.children}
                        </span>
                        <button
                          type="button"
                          aria-label="Sumar niño"
                          onClick={() => adjustChildren(1)}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#8B6136]/40 bg-[#FAF3DF] text-[#3D240F] hover:bg-[#efe3c2]"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      {errors.children && (
                        <p role="alert" className="mt-1 text-xs font-bold text-[#B91C1C]">
                          {errors.children}
                        </p>
                      )}
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
                  {errors.message && (
                    <p role="alert" className="mt-1 text-xs font-bold text-[#B91C1C]">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-b-4 border-[#15692c] bg-[#1E8E3E] px-5 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[#177030] active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E8E3E]"
                >
                  <Send className="h-4 w-4 text-[#FCE085]" aria-hidden="true" />
                  <span>Confirmar por WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
