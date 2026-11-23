export type ProposalId = 1 | 2 | 3;

export interface ProposalMeta {
  readonly id: ProposalId;
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
}

export const PROPOSALS: readonly ProposalMeta[] = [
  {
    id: 1,
    slug: 'safari',
    name: 'Safari al amanecer',
    tagline: 'Paralaje inmersivo con animales reactivos',
  },
  {
    id: 2,
    slug: 'popup-book',
    name: 'Libro pop-up',
    tagline: 'Libro artesanal con páginas 3D',
  },
  {
    id: 3,
    slug: 'jeep',
    name: 'Expedición en jeep',
    tagline: 'Camino de selva interactivo en 3D',
  },
] as const;

export const DEFAULT_PROPOSAL_ID: ProposalId = 1;

export function parseProposalId(raw: string | null | undefined): ProposalId {
  if (raw === '2' || raw === 'popup' || raw === 'popup-book') {
    return 2;
  }
  if (raw === '3' || raw === 'jeep' || raw === 'jeep3d') {
    return 3;
  }
  return 1;
}

export function readProposalFromLocation(
  search: string = typeof window !== 'undefined' ? window.location.search : '',
): ProposalId {
  const params = new URLSearchParams(search);
  return parseProposalId(params.get('propuesta') ?? params.get('proposal'));
}

export function writeProposalToLocation(id: ProposalId): void {
  if (typeof window === 'undefined') {
    return;
  }
  const url = new URL(window.location.href);
  url.searchParams.set('propuesta', String(id));
  window.history.replaceState({}, '', url.toString());
}

export function getProposalMeta(id: ProposalId): ProposalMeta {
  return PROPOSALS.find((item) => item.id === id) ?? PROPOSALS[0];
}
