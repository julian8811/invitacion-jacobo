import { useState } from 'react';
import { motion } from 'framer-motion';
import type { EventConfig } from '../../config/event';
import { SharedRsvpForm } from '../../components/shared/SharedRsvpForm';
import { REALISTIC_ANIMALS } from '../assets';

interface PassportRsvpProps {
  readonly config: EventConfig;
  readonly isMuted: boolean;
}

export function PassportRsvp({ config, isMuted }: PassportRsvpProps) {
  const [stamped, setStamped] = useState(false);
  const mascot = REALISTIC_ANIMALS[1];

  return (
    <section id="rsvp" aria-labelledby="safari-rsvp-heading" className="w-full px-3 py-6 pb-28 sm:px-4">
      <div className="passport-card relative mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] p-5 sm:p-7">
        <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
          <div className="mx-auto w-40 shrink-0 text-center md:mx-0">
            <div className="mx-auto flex h-36 w-36 items-end justify-center overflow-hidden rounded-full border-4 border-[#D98A2B] bg-[#F5EEDB] shadow-lg">
              <img
                src={mascot.src}
                alt={mascot.alt}
                className="h-[92%] w-auto object-contain"
              />
            </div>
            <p className="font-hand mt-2 text-lg text-[#FCE085]">¡Te esperamos, explorador!</p>
            <motion.div
              aria-hidden="true"
              className="passport-stamp mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-dashed border-[#FCE085]/70 text-center text-[10px] font-extrabold tracking-wide text-[#FCE085] uppercase"
              animate={stamped ? { scale: [1.4, 1], opacity: [0, 1], rotate: -12 } : { opacity: 0.45 }}
              transition={{ duration: 0.35 }}
            >
              Confirmado
              <br />
              13 DIC
            </motion.div>
          </div>

          <div className="min-w-0 w-full flex-1 rounded-[1.5rem] bg-[#FFFDF6] p-4 text-[#3D240F] shadow-inner sm:p-5">
            <SharedRsvpForm
              config={config}
              isMuted={isMuted}
              confettiColors={['#1B4332', '#235B8C', '#E09F24', '#4D8B55', '#B4691E']}
              submitLabel="Estampar confirmación"
              accentClassName="border-[#0E271D] bg-[#1B4332] hover:bg-[#245842]"
              onSuccess={() => setStamped(true)}
              headingSlot={
                <div>
                  <p className="font-hand text-xl text-[#B4691E]">Puesto de campamento</p>
                  <h2
                    id="safari-rsvp-heading"
                    className="font-display text-2xl font-bold text-[#4E2E14] sm:text-3xl"
                  >
                    {config.rsvpHeading}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-[#3D240F]/85">
                    Al confirmar, abriremos WhatsApp con tu mensaje listo para enviarlo al instante.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
