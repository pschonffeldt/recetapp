export type ContactRow = {
  id: string;

  eyebrow: string;
  title: string;
  description: string;

  bullets: string[];

  cards: {
    title: string;
    body: string;
  }[];
};

export const CONTACT_ROWS: ContactRow[] = [
  {
    id: "channels",
    eyebrow: "Ways to reach us",
    title: "Pick the channel that fits.",
    description:
      "For most questions, the form is the fastest. If you’re already a user, include the email you signed up with.",
    bullets: [
      "Help Center: docs + troubleshooting",
      "Roadmap: what we're building",
      "Pricing: plans + limits",
    ],
    cards: [
      {
        title: "Support",
        body: "Bugs, account questions, or how-to help.",
      },
      {
        title: "Feedback",
        body: "Feature ideas or UX improvements.",
      },
      {
        title: "Partnerships",
        body: "Collaboration or community ideas.",
      },
      {
        title: "Billing",
        body: "Plan limits, upgrades, or pricing questions.",
      },
    ],
  },
];
