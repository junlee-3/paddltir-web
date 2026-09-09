/** FAQ content shared by the homepage accordion and /faq. Answers are plain
 *  strings so the same text feeds the visible copy and FAQPage JSON-LD. */

export interface Faq {
  q: string;
  a: string;
}

export const HOME_FAQS: Faq[] = [
  {
    q: "What is Paddltir?",
    a: "Paddltir is a dragon boat crew management app. Build lineups, keep rosters and crewlists organised, and check trim and balance before you race.",
  },
  {
    q: "Who is it for?",
    a: "Coaches, sweeps, and club organisers who need to seat boats quickly and keep paddler details in one place — especially when you run multiple heats in a day.",
  },
  {
    q: "What can I configure in a boat?",
    a: "Seat paddlers left and right, assign drummer and sweep, and switch between small and standard boat sizes. Paddltir uses weight and preferred side to help you see how the boat sits.",
  },
  {
    q: "What insights do I get?",
    a: "You can see fore-aft trim, side balance, and empty seats before you commit a lineup. The goal is fewer surprises on the pontoon.",
  },
  {
    q: "Do I need to be technical?",
    a: "No. Sign in, add your paddlers, build a crewlist, and seat the boat. If you can run a race day roster on paper, you can use Paddltir.",
  },
  {
    q: "Is my crew data private?",
    a: "Your account, paddlers, and crewlists belong to you. You can update or remove them from the app. See the privacy page for what we store.",
  },
  {
    q: "Is it ready for race day?",
    a: "Yes. Keep a roster ready, seat each heat, and check trim before you load. Open the app from any device your crew already uses.",
  },
];

export const EXTRA_FAQS: Faq[] = [
  {
    q: "What's the difference between a roster and a crewlist?",
    a: "A roster is your pool of paddlers. A crewlist is the set of people available for a race or training block. You seat boats from a crewlist so each heat stays clear.",
  },
  {
    q: "Can I run multiple heats?",
    a: "Yes. Configure separate lineups per heat so open, mixed, and women's crews don't overwrite each other.",
  },
  {
    q: "How does weight affect seating?",
    a: "Heavier paddlers shift the boat's centre of mass. Paddltir shows trim so you can move people forward or aft before you race instead of guessing on the water.",
  },
  {
    q: "What about preferred side?",
    a: "Many paddlers paddle stronger on one side. You can record that and seat left/right with it in mind, then still override when the boat needs balance.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. Account deletion removes your profile and associated crew data from the service. Details are on the privacy page.",
  },
  {
    q: "Where do I start?",
    a: "Open the app, add paddlers to a roster, create a crewlist, then seat your first boat. The docs page walks through the main pieces.",
  },
  {
    q: "Is Paddltir open source?",
    a: "Yes. The code is MIT-licensed — copyright stays with Jun Lee, and you can use, modify, and distribute it, including commercially. Paid hosted access may still apply separately from the open-source license.",
  },
];
