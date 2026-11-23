import { Maximize2 } from 'lucide-react';
import type { JacoboMemory, SafariFrameAnimal } from '../data/memories';

interface SafariPortraitFrameProps {
  readonly memory: JacoboMemory;
  readonly index: number;
  readonly total: number;
  readonly onZoom?: () => void;
  readonly isLightbox?: boolean;
}

function AnimalGuardianSvg({ animal }: { readonly animal: SafariFrameAnimal }) {
  if (animal === 'lion') {
    return (
      <svg viewBox="0 0 120 78" className="h-16 w-24 drop-shadow-md sm:h-[72px] sm:w-28" fill="none">
        {/* Fluffy amber mane */}
        <circle cx="60" cy="40" r="27" fill="#B86B1B" />
        <circle cx="38" cy="28" r="9" fill="#B86B1B" />
        <circle cx="82" cy="28" r="9" fill="#B86B1B" />
        <circle cx="37" cy="48" r="9" fill="#B86B1B" />
        <circle cx="83" cy="48" r="9" fill="#B86B1B" />
        {/* Round ears */}
        <circle cx="39" cy="21" r="8" fill="#E09F24" stroke="#9C5714" strokeWidth="2" />
        <circle cx="81" cy="21" r="8" fill="#E09F24" stroke="#9C5714" strokeWidth="2" />
        <circle cx="39" cy="21" r="4" fill="#C77A22" />
        <circle cx="81" cy="21" r="4" fill="#C77A22" />
        {/* Warm golden face */}
        <circle cx="60" cy="40" r="20" fill="#F2B84B" />
        <ellipse cx="60" cy="46" rx="11" ry="8" fill="#FBE6B7" />
        {/* Khaki safari explorer hat */}
        <path d="M40 22 Q60 6 80 22 Z" fill="#CBB37A" stroke="#6F4220" strokeWidth="2" />
        <ellipse cx="60" cy="22" rx="25" ry="5" fill="#B89B5E" stroke="#6F4220" strokeWidth="2" />
        {/* Friendly eyes & muzzle */}
        <circle cx="52" cy="36" r="2.7" fill="#2A1708" />
        <circle cx="68" cy="36" r="2.7" fill="#2A1708" />
        <circle cx="51" cy="35" r="0.9" fill="#FFFFFF" />
        <circle cx="67" cy="35" r="0.9" fill="#FFFFFF" />
        <path d="M56 42 L64 42 L60 46 Z" fill="#6F4220" />
        <path d="M55 49 Q60 53 65 49" stroke="#6F4220" strokeWidth="2" strokeLinecap="round" />
        {/* Little explorer paws holding frame rail */}
        <ellipse cx="32" cy="67" rx="9" ry="6" fill="#F2B84B" stroke="#9C5714" strokeWidth="2" />
        <ellipse cx="88" cy="67" rx="9" ry="6" fill="#F2B84B" stroke="#9C5714" strokeWidth="2" />
      </svg>
    );
  }

  if (animal === 'elephant') {
    return (
      <svg viewBox="0 0 120 78" className="h-16 w-24 drop-shadow-md sm:h-[72px] sm:w-28" fill="none">
        {/* Big friendly ears */}
        <ellipse cx="31" cy="40" rx="16" ry="18" fill="#8C9AA6" stroke="#5D6B77" strokeWidth="2" />
        <ellipse cx="89" cy="40" rx="16" ry="18" fill="#8C9AA6" stroke="#5D6B77" strokeWidth="2" />
        <ellipse cx="33" cy="41" rx="9" ry="11" fill="#C9D2D9" />
        <ellipse cx="87" cy="41" rx="9" ry="11" fill="#C9D2D9" />
        {/* Rounded head */}
        <circle cx="60" cy="39" r="21" fill="#A3B1BC" stroke="#5D6B77" strokeWidth="2" />
        {/* Explorer cap */}
        <path d="M44 21 Q60 10 76 21 Z" fill="#235B8C" stroke="#153C5E" strokeWidth="2" />
        <ellipse cx="60" cy="22" rx="20" ry="4" fill="#2E6FA8" stroke="#153C5E" strokeWidth="2" />
        {/* Happy eyes */}
        <circle cx="52" cy="36" r="2.7" fill="#1F2933" />
        <circle cx="68" cy="36" r="2.7" fill="#1F2933" />
        <circle cx="51" cy="35" r="0.9" fill="#FFFFFF" />
        <circle cx="67" cy="35" r="0.9" fill="#FFFFFF" />
        {/* Curled trunk & navy bandana */}
        <path d="M43 56 Q60 66 77 56 L70 67 L60 63 L50 67 Z" fill="#235B8C" stroke="#153C5E" strokeWidth="1.5" />
        <path d="M56 44 Q55 58 67 56 Q72 54 68 48" stroke="#8C9AA6" strokeWidth="7" strokeLinecap="round" />
        <path d="M56 44 Q55 58 67 56 Q72 54 68 48" stroke="#B7C4CE" strokeWidth="4" strokeLinecap="round" />
        {/* Paws gripping top frame */}
        <ellipse cx="35" cy="68" rx="8.5" ry="5.5" fill="#A3B1BC" stroke="#5D6B77" strokeWidth="2" />
        <ellipse cx="85" cy="68" rx="8.5" ry="5.5" fill="#A3B1BC" stroke="#5D6B77" strokeWidth="2" />
      </svg>
    );
  }

  if (animal === 'monkey') {
    return (
      <svg viewBox="0 0 120 78" className="h-16 w-24 drop-shadow-md sm:h-[72px] sm:w-28" fill="none">
        {/* Curly tail peeking left */}
        <path d="M22 65 Q10 42 22 30 Q29 24 27 33" stroke="#6F4220" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {/* Big round ears */}
        <circle cx="35" cy="36" r="10" fill="#7D4C27" />
        <circle cx="85" cy="36" r="10" fill="#7D4C27" />
        <circle cx="35" cy="36" r="5.5" fill="#E9C89B" />
        <circle cx="85" cy="36" r="5.5" fill="#E9C89B" />
        {/* Head */}
        <circle cx="60" cy="38" r="21" fill="#7D4C27" />
        {/* Face mask */}
        <ellipse cx="53" cy="35" rx="9" ry="8.5" fill="#E9C89B" />
        <ellipse cx="67" cy="35" rx="9" ry="8.5" fill="#E9C89B" />
        <ellipse cx="60" cy="46" rx="14" ry="10" fill="#E9C89B" />
        {/* Tuft of hair */}
        <path d="M55 18 Q60 10 66 18" stroke="#5A3418" strokeWidth="3.5" strokeLinecap="round" />
        {/* Eyes & big grin */}
        <circle cx="52" cy="35" r="2.7" fill="#2A1708" />
        <circle cx="68" cy="35" r="2.7" fill="#2A1708" />
        <circle cx="51" cy="34" r="0.9" fill="#FFFFFF" />
        <circle cx="67" cy="34" r="0.9" fill="#FFFFFF" />
        <circle cx="58" cy="41" r="1.4" fill="#5A3418" />
        <circle cx="62" cy="41" r="1.4" fill="#5A3418" />
        <path d="M52 47 Q60 54 68 47" stroke="#5A3418" strokeWidth="2" strokeLinecap="round" />
        {/* Paws gripping top rail */}
        <ellipse cx="36" cy="67" rx="8.5" ry="5.5" fill="#E9C89B" stroke="#6F4220" strokeWidth="2" />
        <ellipse cx="84" cy="67" rx="8.5" ry="5.5" fill="#E9C89B" stroke="#6F4220" strokeWidth="2" />
      </svg>
    );
  }

  if (animal === 'giraffe') {
    return (
      <svg viewBox="0 0 120 78" className="h-16 w-24 drop-shadow-md sm:h-[72px] sm:w-28" fill="none">
        {/* Neck & green bandana */}
        <rect x="48" y="45" width="24" height="24" rx="8" fill="#F2BE49" />
        <path d="M44 55 L76 55 L60 67 Z" fill="#1B4332" stroke="#123023" strokeWidth="1.5" />
        {/* Ossicones (giraffe horns) */}
        <path d="M50 22 L46 10" stroke="#A86921" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M70 22 L74 10" stroke="#A86921" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="46" cy="9" r="3.5" fill="#6F4220" />
        <circle cx="74" cy="9" r="3.5" fill="#6F4220" />
        {/* Ears */}
        <ellipse cx="39" cy="27" rx="8" ry="4.5" transform="rotate(-18 39 27)" fill="#E2A430" />
        <ellipse cx="81" cy="27" rx="8" ry="4.5" transform="rotate(18 81 27)" fill="#E2A430" />
        {/* Head */}
        <ellipse cx="60" cy="36" rx="18" ry="19" fill="#F2BE49" stroke="#C58820" strokeWidth="2" />
        {/* Giraffe spots */}
        <circle cx="49" cy="26" r="3.2" fill="#B56E1D" />
        <circle cx="70" cy="28" r="2.8" fill="#B56E1D" />
        {/* Warm snout */}
        <ellipse cx="60" cy="45" rx="12" ry="8" fill="#FBE4AF" />
        <circle cx="53" cy="34" r="2.6" fill="#2A1708" />
        <circle cx="67" cy="34" r="2.6" fill="#2A1708" />
        <circle cx="52" cy="33" r="0.9" fill="#FFFFFF" />
        <circle cx="66" cy="33" r="0.9" fill="#FFFFFF" />
        <path d="M55 47 Q60 51 65 47" stroke="#6F4220" strokeWidth="2" strokeLinecap="round" />
        {/* Hooves on frame */}
        <ellipse cx="36" cy="67" rx="8" ry="5.5" fill="#6F4220" />
        <ellipse cx="84" cy="67" rx="8" ry="5.5" fill="#6F4220" />
      </svg>
    );
  }

  // toucan
  return (
    <svg viewBox="0 0 120 78" className="h-16 w-24 drop-shadow-md sm:h-[72px] sm:w-28" fill="none">
      {/* Perched wing & body */}
      <ellipse cx="52" cy="44" rx="20" ry="22" fill="#1C354D" stroke="#0F2133" strokeWidth="2" />
      <ellipse cx="43" cy="49" rx="10" ry="14" transform="rotate(-12 43 49)" fill="#122536" />
      {/* Yellow chest bib */}
      <ellipse cx="56" cy="44" rx="12" ry="13" fill="#F6BD3A" />
      {/* Bold colorful toucan beak */}
      <path d="M62 29 Q89 27 94 40 Q82 44 62 41 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
      <path d="M84 31 Q92 34 94 40 Q88 42 84 41 Z" fill="#1B4332" />
      {/* Friendly eye */}
      <circle cx="55" cy="33" r="5" fill="#4DA866" />
      <circle cx="56" cy="33" r="2.6" fill="#111827" />
      <circle cx="55" cy="32" r="0.9" fill="#FFFFFF" />
      {/* Explorer claws gripping rail */}
      <path d="M44 65 L44 71 M48 65 L50 71" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M58 65 L58 71 M62 65 L64 71" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function SafariPortraitFrame({
  memory,
  index,
  total,
  onZoom,
  isLightbox = false,
}: SafariPortraitFrameProps) {
  return (
    <div className={`relative mx-auto w-full ${isLightbox ? 'max-w-md pt-9' : 'max-w-[330px] pt-8 sm:max-w-[360px]'}`}>
      {/* Safari animal guardian perching on top rail of wooden frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2 select-none"
      >
        <AnimalGuardianSvg animal={memory.animal} />
      </div>

      {/* Carved wooden safari portrait frame */}
      <div className="safari-portrait-wood relative rounded-[1.75rem] p-3.5 sm:p-4">
        {/* Corner brass rivets */}
        <span aria-hidden="true" className="absolute top-2.5 left-2.5 h-2.5 w-2.5 rounded-full border border-[#5C371B] bg-[#F3CD6D]" />
        <span aria-hidden="true" className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border border-[#5C371B] bg-[#F3CD6D]" />
        <span aria-hidden="true" className="absolute bottom-2.5 left-2.5 h-2.5 w-2.5 rounded-full border border-[#5C371B] bg-[#F3CD6D]" />
        <span aria-hidden="true" className="absolute right-2.5 bottom-2.5 h-2.5 w-2.5 rounded-full border border-[#5C371B] bg-[#F3CD6D]" />

        {/* Tropical jungle leaf clusters at diagonal corners */}
        <svg
          aria-hidden="true"
          viewBox="0 0 64 64"
          className="pointer-events-none absolute -top-2 -right-2 z-20 h-12 w-12 drop-shadow"
          fill="none"
        >
          <path d="M54 10 C38 8 24 18 18 34 C34 32 48 24 54 10 Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.5" />
          <path d="M56 28 C44 26 32 34 26 48 C40 46 52 38 56 28 Z" fill="#3F7D4C" stroke="#1B4332" strokeWidth="1.5" />
        </svg>

        <svg
          aria-hidden="true"
          viewBox="0 0 64 64"
          className="pointer-events-none absolute -bottom-2 -left-2 z-20 h-12 w-12 drop-shadow"
          fill="none"
        >
          <path d="M10 54 C26 56 40 46 46 30 C30 32 16 40 10 54 Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.5" />
          <path d="M8 36 C20 38 32 30 38 16 C24 18 12 26 8 36 Z" fill="#3F7D4C" stroke="#1B4332" strokeWidth="1.5" />
        </svg>

        {/* Cream museum mat */}
        <div className="safari-portrait-mat rounded-[1.2rem] p-2.5 sm:p-3">
          {onZoom ? (
            <button
              type="button"
              onClick={onZoom}
              aria-label={`Ampliar foto: ${memory.ageLabel} — ${memory.title}`}
              className="group relative block w-full cursor-pointer overflow-hidden rounded-xl border border-[#C7A977] bg-[#EAE1CA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            >
              <img
                src={memory.imageSrc}
                alt={memory.imageAlt}
                style={{ objectPosition: memory.objectPosition }}
                className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-full bg-[#1B4332]/85 px-2.5 py-1 text-[11px] font-bold text-[#FFFDF7] shadow backdrop-blur-sm transition group-hover:bg-[#1B4332]">
                <Maximize2 className="h-3 w-3 text-[#FCE085]" aria-hidden="true" />
                <span>Ampliar</span>
              </span>
            </button>
          ) : (
            <div className="relative overflow-hidden rounded-xl border border-[#C7A977] bg-[#EAE1CA]">
              <img
                src={memory.imageSrc}
                alt={memory.imageAlt}
                style={{ objectPosition: memory.objectPosition }}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Engraved brass milestone plaque on bottom molding */}
        <div className="relative z-20 mx-auto -mb-1.5 mt-2.5 flex w-fit items-center gap-2 rounded-full px-4 py-1 safari-brass-plate">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5A3418]" aria-hidden="true" />
          <span className="text-xs font-extrabold tracking-wide text-[#2A1708]">
            {memory.ageLabel} · {index + 1}/{total}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#5A3418]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
