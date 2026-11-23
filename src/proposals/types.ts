export type ProposalId = 'explorador' | 'selva-viva' | 'campamento';

export type StudioView = 'pagina' | 'tarjeta';

export interface ProposalTheme {
  readonly id: ProposalId;
  readonly number: 1 | 2 | 3;
  readonly name: string;
  readonly shortLabel: string;
  readonly tagline: string;
  readonly description: string;
  readonly assets: {
    readonly heroScene: string;
    readonly introMascot: string;
    readonly rsvpMascot: string;
    readonly heroAlt: string;
    readonly mascotAlt: string;
  };
  readonly copy: {
    readonly introEyebrow: string;
    readonly introCta: string;
    readonly heroEyebrow: string;
    readonly countdownEyebrow: string;
    readonly locationEyebrow: string;
    readonly rsvpEyebrow: string;
    readonly rsvpBadgeText: string;
    readonly cardButtonLabel: string;
    readonly cardHelperText: string;
    readonly cardBadgeText: string;
  };
  readonly confettiColors: readonly string[];
  readonly balloonColors: readonly string[];
  readonly exportFiles: {
    readonly pdf: string;
    readonly jpg: string;
  };
}
