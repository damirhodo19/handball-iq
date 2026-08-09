import { defineArchetype, answer, COMMON_SLOTS } from '../archetype-builder.mjs';

const { minute, score, opponent, handedness } = COMMON_SLOTS;

function wingArchetypes(side, position, category) {
  const wing = side === 'left' ? 'left' : 'right';
  const oppositeWing = side === 'left' ? 'right' : 'left';
  const back = side === 'left' ? 'left back' : 'right back';
  const nearDefender = side === 'left' ? 'left wing defender' : 'right wing defender';

  return [
    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Basic Near-Post Read`,
      situationEn: `You receive on the ${wing} wing against a set 6:0 at {minute} min. Score {score}. The goalkeeper has drifted half a step toward the far post. Your defender is a step late and cannot block.`,
      questionEn: 'What do you finish to first?',
      explanationEn:
        'When the keeper over-shifts far, the near post opens. A quick low finish there beats waiting for a better angle that never comes.',
      answers: answer(
        [
          'Low near-post finish before the goalkeeper recovers centre',
          'Correct — the far-post drift leaves near post open for a quick release.',
        ],
        [
          'High far-post lob over a recovering keeper',
          'Good — possible if the keeper stays tall, but slower than the open near post.',
        ],
        [
          `Pass back to the ${back} to reset the attack`,
          'Risky — resetting gives the defence time to recover your late defender.',
        ],
        [
          'Drive inside toward the middle against recovering help',
          'Poor — from a sharp wing angle the drive rarely creates a clean foul or shot.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Far-Post Under Centred Keeper`,
      situationEn: `At {minute} min ({score}) you catch a skip pass on the ${wing} wing. The goalkeeper stays centred on the six-metre line. Your ${nearDefender} is recovering from behind and will arrive in one stride.`,
      questionEn: 'Where do you place the finish before contact arrives?',
      explanationEn:
        'A centred keeper must cover maximum distance on a far-post wrist shot. Power into the near post plays into their strength while the recovering defender closes.',
      answers: answer(
        [
          'Controlled cross-court finish to the far post before the defender arrives',
          'Correct — far post maximises keeper travel from a centred stance under recovery pressure.',
        ],
        [
          'Power finish to the near post against the centred keeper',
          'Good — executable but the centred keeper already shades near post well.',
        ],
        [
          'Bounce pass inside to the pivot through the recovering defender',
          'Risky — the recovering wing defender can cut the inside lane.',
        ],
        [
          `Stop, face up, and wait for the ${back} to arrive for a hand-off`,
          'Poor — hesitation lets both defender and structure set; the skip pass already created the chance.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Lob vs Stepping Keeper`,
      situationEn: `{opponent} play a high line. At {minute} min ({score}) their goalkeeper steps out aggressively toward you on the ${wing} wing. You have a narrow angle; the ${back} is open one pass inside but under a trailing defender.`,
      questionEn: 'How do you punish the early step?',
      explanationEn:
        'An early step opens the lob lane over the near shoulder. Passing inside is viable only if the trailing defender cannot cut — here the lob is cleaner and faster.',
      answers: answer(
        [
          'High lob over the advanced keeper toward the far corner',
          'Correct — the early step gifts the lob; delay lets them recover depth.',
        ],
        [
          `One fake then soft pass inside to the ${back}`,
          'Good — works if the trailing defender is late; still slower than the open lob.',
        ],
        [
          'Hard near-post power shot into the stepped keeper',
          'Risky — an advanced keeper covers near post with their body line.',
        ],
        [
          'Retreat outside nine metres and restart the positional attack',
          'Poor — the keeper already committed; retreating throws away the advantage.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Fast-Break Arrival Timing`,
      situationEn: `Your team wins the ball at {minute} min ({score}). The ${oppositeWing} back releases a long outlet. You are level with halfway; one recovering defender is between you and the six-metre line.`,
      questionEn: 'When do you start the sprint so the finish stays on?',
      explanationEn:
        'Sprint with the pass release so you arrive at six metres as the ball arrives. Starting after the halfway catch gives the recovery defender the angle.',
      answers: answer(
        [
          'Sprint on the outlet release and arrive at six metres as you catch',
          'Correct — timed arrival keeps speed and finishing angle against one recoverer.',
        ],
        [
          'Hold until the ball crosses halfway, then sprint past the defender',
          'Good — safer timing, but the late start often loses the finishing lane.',
        ],
        [
          'Sprint before the outlet is released to get ahead of the ball',
          'Risky — early runs often force a bounce or a held pass and kill tempo.',
        ],
        [
          'Stay connected to the back line to keep defensive balance',
          'Poor — with a clear 2-on-1 developing the wing must commit to the break.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Advanced',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Back-Door vs Ball-Watching 6:0`,
      situationEn: `Positional 6:0 at {minute} min ({score}). Ball is on the opposite wing. Your defender turns their head to the ball and narrows toward the middle. The ${back} is about to receive.`,
      questionEn: 'What off-ball action creates the highest-value option?',
      explanationEn:
        'When the wing defender ball-watches and pinches, the back-door cut to six metres opens for a skip or bounce pass. Standing still keeps you covered.',
      answers: answer(
        [
          'Cut behind the ball-watching defender toward six metres on the next pass',
          `Correct — the pinch creates a back-door lane the ${back} can hit.`,
        ],
        [
          'Hold width on the wing line to stretch the defence',
          'Good — maintains spacing but does not punish the ball-watch.',
        ],
        [
          'Drift into the half-back lane to ask for a hand-off',
          'Risky — congests traffic and invites help onto the ball.',
        ],
        [
          'Drop to nine metres preparing a long-range shot',
          'Poor — wings rarely create value from nine metres in a set 6:0.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Power-Play Wing Overload`,
      situationEn: `6-on-5 after an exclusion at {minute} min ({score}). You receive on the ${wing} wing. The short-handed defence rotates one player late from the middle; the pivot is sealing the near defender.`,
      questionEn: 'What do you read first before the rotation closes?',
      explanationEn:
        'In power play the temporary gap is the value. Attack finish or feed the sealed pivot before the late rotator arrives — holding for perfection returns them to 6:0.',
      answers: answer(
        [
          'Attack the late rotation immediately — finish or feed the sealed pivot',
          'Correct — the gap exists only until the rotator recovers.',
        ],
        [
          'Swing the ball back around the full perimeter once more',
          'Good — can create a better angle, but burns the temporary overload.',
        ],
        [
          'Hold on the wing until the pivot seals deeper',
          'Risky — holding invites the short-handed defence to recover structure.',
        ],
        [
          'Dribble along the sideline to protect possession',
          'Poor — power play is for scoring pressure, not clock management.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: `${position} — Tied Game Wing Finish`,
      situationEn: `Final 90 seconds, score {score}. You receive on the ${wing} wing with a playable angle. The goalkeeper shades your strong {handedness} tendency. Coach signals calm finish, not heroics.`,
      questionEn: 'How do you decide the finish under this pressure?',
      explanationEn:
        'Under late pressure, one clear keeper read beats creativity. If they shade your strong side, finish weak-side or change height — do not invent a third option.',
      answers: answer(
        [
          'One keeper read, then finish opposite their shade or change shot height',
          'Correct — tendency shade is information; one adjustment, clean execution.',
        ],
        [
          'Pass back for a full reset despite the playable angle',
          'Good — protects possession, but you already have a finishable catch.',
        ],
        [
          'Attempt a reverse spin finish to surprise the defence',
          'Risky — low-percentage creativity under late-game pressure.',
        ],
        [
          'Rush a power shot without checking the keeper shade',
          'Poor — ignoring the shade turns a controlled chance into a saveable ball.',
        ],
      ),
      variationSlots: { score, handedness },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Keeper First-Step Read`,
      situationEn: `You catch on the ${wing} wing at {minute} min ({score}). The goalkeeper is tall and upright. Your defender gives half a step of space. You have time for one fake before contact.`,
      questionEn: 'What information do you take from the keeper before releasing?',
      explanationEn:
        'One fake extracts the keeper first step. Tall upright keepers often protect the lob; their first step shows which low corner they abandon.',
      answers: answer(
        [
          'One short fake, read the keeper first step, finish the abandoned corner',
          'Correct — the first step reveals priority; that is the finish lane.',
        ],
        [
          'Immediate release without a fake to beat the defender',
          'Good — quick release can work, but you leave keeper information unused.',
        ],
        [
          'Pre-commit to the far post before seeing the first step',
          'Risky — fixed patterns are what upright keepers prepare for.',
        ],
        [
          'Pass to the pivot even when they are already doubled',
          'Poor — if the wing is open and the pivot is doubled, the finish is yours.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: `${position} — Transition Cover Priority`,
      situationEn: `You lose the ball high on the ${wing} side at {minute} min ({score}). {opponent} outlet immediately to the ${oppositeWing} wing. You are still above the nine-metre line.`,
      questionEn: 'What is your first defensive job in this transition?',
      explanationEn:
        'The dangerous pass is the skip to the far wing. Sprint to cut that lane first; pressing the outlet alone is beaten by one pass.',
      answers: answer(
        [
          'Sprint to cut the far-wing skip lane, then recover goal-side',
          'Correct — denying the cross-court outlet stops the highest-value break.',
        ],
        [
          'Recover to your own wing spot and wait for the set defence',
          'Good — gets you organised, but may concede the first skip if you delay the sprint.',
        ],
        [
          'Press the nearest outlet passer immediately',
          'Risky — solo press is beaten by one skip if the far wing is free.',
        ],
        [
          'Stop to signal for a foul call before recovering',
          'Poor — transition defence starts on the loss of possession, not after the argument.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Expert',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Extreme-Angle Finish`,
      situationEn: `You catch at the sideline with only a sliver of goal visible at {minute} min ({score}). The goalkeeper knows you are a {handedness} finisher and shades that release. Help defence is one stride from a block.`,
      questionEn: 'Which technique keeps this finish alive?',
      explanationEn:
        'From extreme angles the high-percentage options are a low near-post skim or a disguised change of height. Central power is a gift to the keeper.',
      answers: answer(
        [
          'Low near-post skim along the floor before help arrives',
          'Correct — the skim is hardest to reach from extreme angles against a shaded keeper.',
        ],
        [
          'Soft pass inside to a covered half-back',
          'Good — valid if the angle dies, but you still have a legal skim lane.',
        ],
        [
          'High power shot into the middle of the visible goal',
          'Risky — from this angle the middle is the keeper strongest save zone.',
        ],
        [
          'Step out beyond the sideline and restart the attack',
          'Poor — you already have a legal finishing catch; restarting throws it away.',
        ],
      ),
      variationSlots: { minute, score, handedness },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Simple Width Principle`,
      situationEn: `Your team attacks a flat 6:0 at {minute} min ({score}). Ball is with the centre back. You are on the ${wing} wing standing a metre inside the sideline while your defender stays comfortable.`,
      questionEn: 'How should you use width to help the attack?',
      explanationEn:
        'Wings stretch 6:0 by holding true width. Standing narrow lets the wing defender help inside and kills skip-pass options.',
      answers: answer(
        [
          'Hold true width on the sideline to stretch the wing defender',
          'Correct — width creates skip lanes and stops the wing defender helping early.',
        ],
        [
          'Hold width, then time a short cut when the centre back looks your way',
          'Good — still uses width, with a delayed cut once the passer is ready.',
        ],
        [
          'Come inside to the half-back to ask for the ball',
          'Risky — early pinch crowds the backcourt and invites help defence.',
        ],
        [
          'Drop to halfway to prepare for a long outlet',
          'Poor — in a set 6:0 attack your value is width and finishing, not deep outlets.',
        ],
      ),
      variationSlots: { minute, score },
    }),
  ];
}

export function getLeftWingArchetypes() {
  return wingArchetypes('left', 'Left Wing', 'Left Wing');
}

export function getRightWingArchetypes() {
  return wingArchetypes('right', 'Right Wing', 'Right Wing');
}
