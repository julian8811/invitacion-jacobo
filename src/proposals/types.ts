export interface ProposalTheme {
  readonly id: 'explorador';
  readonly name: string;
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
}
