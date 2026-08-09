import { defineArchetype, answer, COMMON_SLOTS } from '../archetype-builder.mjs';

const { minute, score, opponent, handedness, wingSide } = COMMON_SLOTS;

export function getGoalkeeperArchetypes() {
  return [
    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Defence',
      titleEn: 'Wing Shot — Narrow-Angle Cover',
      situationEn:
        `Against a set 6:0 at {minute}' ({score}), the {wingSide} wing catches on the edge with only a sliver of goal visible. They face you one-on-one; the near post and a soft lob are both live.`,
      questionEn: 'How do you set your body before the release?',
      explanationEn:
        'At a narrow wing angle, centred cover already closes most of the goal. Stay large on the short corner line and delay until the shoulder and arm commit.',
      answers: answer(
        [
          'Stay centred on the short angle, large frame, react to the release',
          'Correct — centred cover holds near post and lob until the wing commits.',
        ],
        [
          'Step one metre forward to shrink the visible goal early',
          'Good — angle cutting helps, but early depth can gift a lob over you.',
        ],
        [
          'Shift fully onto the near post before they jump',
          'Risky — pre-shifting the near post opens the cross-court finish.',
        ],
        [
          'Retreat to the goal line and wait on your heels',
          'Poor — deep retreat grows the target and slows your first step.',
        ],
      ),
      variationSlots: { wingSide, minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Defence',
      titleEn: 'Jump Shot — Basic Shoulder Cue',
      situationEn:
        `A {handedness} centre back jumps freely from nine metres at {minute}' ({score}). Their open shoulder shows early; your defender is half a step late and cannot block.`,
      questionEn: 'When do you commit weight to a side?',
      explanationEn:
        'An open shoulder prepares your feet, but the arm swing confirms direction. Committing on the shoulder alone lets skilled backs fake you.',
      answers: answer(
        [
          'Load from the open shoulder, commit only on the arm swing',
          'Correct — shoulder prepares; the swing is the real commitment cue.',
        ],
        [
          'Hold dead centre and react purely after ball flight starts',
          'Good — safe baseline, but you waste the free shoulder information.',
        ],
        [
          'Dive to the open-shoulder side as soon as they jump',
          'Risky — early dive on the jump lets them adjust to the open corner.',
        ],
        [
          'Step out hard to the nine-metre line before they release',
          'Poor — rushing out opens the lob and removes reaction time.',
        ],
      ),
      variationSlots: { handedness, minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Defence',
      titleEn: 'Wing Finish — Release Height Read',
      situationEn:
        `The {wingSide} wing receives a skip pass at {minute}' ({score}) vs {opponent}. They rise into a jump with a high elbow; your near defender arrives a stride late and cannot contest.`,
      questionEn: 'What do you take from the elbow before moving?',
      explanationEn:
        'A high elbow on a wing angle often telegraphs a far-post or lob finish. Shade that lane while keeping the near-post skim alive until release.',
      answers: answer(
        [
          'Shade the far-post/lob lane from the high elbow, hold near-post balance',
          'Correct — high elbow cues far-post or lob; balance still covers the skim.',
        ],
        [
          'Stay perfectly square and ignore the elbow height entirely',
          'Good — pure reaction works, but you leave a free cue unused.',
        ],
        [
          'Plant hard on the near post as soon as the elbow rises',
          'Risky — planting near post early gifts the cross-court high finish.',
        ],
        [
          'Drop to a low stance preparing only for a bounce skim',
          'Poor — low early stance kills your chance on a lobbed far-post ball.',
        ],
      ),
      variationSlots: { wingSide, minute, score, opponent },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Defence',
      titleEn: 'Backcourt — Tendency Without Dive',
      situationEn:
        `At {minute}' ({score}) the right back has space for a full jump shot. Scouting says they finish far corner most often; your defender is late and the shot is clean.`,
      questionEn: 'How do you use the far-corner tendency without giving it away?',
      explanationEn:
        'Tendency informs a slight shade and foot load, not a pre-dive. Stay reactive through the release so they cannot reverse into the open near post.',
      answers: answer(
        [
          'Slight far-corner shade, stay tall, decide on the release point',
          'Correct — shade the pattern but delay commitment until the release.',
        ],
        [
          'Hold true centre and treat the scouting note as irrelevant',
          'Good — reliable, yet you ignore useful pattern information.',
        ],
        [
          'Dive hard to the far corner before the arm comes forward',
          'Risky — early commitment lets them reverse into the open near post.',
        ],
        [
          'Rush off your line to challenge the jump at nine metres',
          'Poor — challenging a free jump shot opens lob and near-post lanes.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Pivot Spin — Low-Zone Close',
      situationEn:
        `The pivot receives with their back to goal at six metres at {minute}' ({score}). They spin for a finish; your defender is sealed behind them and cannot block or foul in time.`,
      questionEn: 'Where do you close as the spin finishes?',
      explanationEn:
        'Pivot spin finishes are close-range and usually low. Close the gap into the low zone and read the shooting arm rather than guessing the spin side early.',
      answers: answer(
        [
          'Close into the low zone and read the shooting arm through the spin',
          'Correct — pivots finish low; gap-closing plus arm read beats side-guessing.',
        ],
        [
          'Stay on the goal line and hope to react after the ball leaves',
          'Good — late reaction is safer than a wrong dive, but distance hurts you.',
        ],
        [
          'Pre-slide to one post before the spin direction is clear',
          'Risky — guessing the spin side leaves you flat-footed on the reverse.',
        ],
        [
          'Call your sealed defender to step around for a late block',
          'Poor — they are already beaten; the save job is yours alone now.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Defence',
      titleEn: 'Hip Shot — Confirm the Fake',
      situationEn:
        `A left back finds space for a hip shot at {minute}' ({score}). Their shoulder opens toward your right — the same cue they used twice before scoring — but elite backs fake that open.`,
      questionEn: 'How do you treat the repeated shoulder open?',
      explanationEn:
        'Repeated shoulder cues are information, not certainty. Prepare weight toward the shown side, then confirm with the arm path before you leave your feet.',
      answers: answer(
        [
          'Prepare toward the open shoulder, confirm with the arm before diving',
          'Correct — use the cue to prepare; confirm at the arm so fakes fail.',
        ],
        [
          'Ignore every shoulder cue and react only to ball flight',
          'Good — avoids fake traps, but you discard useful preparation time.',
        ],
        [
          'Commit fully to the open-shoulder side on the first shoulder move',
          'Risky — that is exactly the fake skilled backs use against keepers.',
        ],
        [
          'Step out and press the hip-shot lane before they release',
          'Poor — stepping out against a hip shot opens the far corner instantly.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Fast Break — 2v1 Eyes',
      situationEn:
        `{opponent} win the ball and sprint into a 2-on-1 at {minute}' ({score}). The ball carrier is a {handedness} back; your lone recoverer trails. The wing outside is open for a pass or a finish.`,
      questionEn: 'What do you watch to decide pass versus shot?',
      explanationEn:
        'In a 2v1 the carrier decides last. Hold a split that covers both lanes and read their eyes and pass arm — early commitment to the ball gifts the wing.',
      answers: answer(
        [
          'Hold a split stance and read the carrier\'s eyes and pass arm',
          'Correct — eyes and pass arm reveal pass or shot without early dive.',
        ],
        [
          'Split the two attackers evenly and wait for ball flight only',
          'Good — delays the decision, but eyes give an earlier honest cue.',
        ],
        [
          'Commit fully to the ball carrier as soon as they enter nine metres',
          'Risky — full commitment opens an easy slip pass to the free wing.',
        ],
        [
          'Retreat onto the goal line and concede both finishing lanes',
          'Poor — deep retreat gives both attackers a clear shooting window.',
        ],
      ),
      variationSlots: { opponent, minute, score, handedness },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Breakaway — Controlled Advance',
      situationEn:
        `After an interception at {minute}' ({score}), a {handedness} attacker breaks free from halfway. They will reach nine metres in seconds; you must set depth before their last dribble.`,
      questionEn: 'How far do you advance before they decide?',
      explanationEn:
        'A controlled advance to about five metres shortens the angle without over-committing. Stay large and force them to choose first; rushing to nine metres invites the chip.',
      answers: answer(
        [
          'Advance under control to about five metres, stay large, react late',
          'Correct — mid-depth cuts the angle while keeping lob and chip covered.',
        ],
        [
          'Hold near the goal line until they enter the six-metre area',
          'Good — avoids the chip, but leaves a large target for a composed finish.',
        ],
        [
          'Sprint all the way to the nine-metre line to meet them early',
          'Risky — over-advancing opens chip and lob finishes over your head.',
        ],
        [
          'Pre-slide to their strong hand before they enter shooting range',
          'Poor — pre-sliding removes your ability to recover the other side.',
        ],
      ),
      variationSlots: { minute, score, handedness },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      matchPhase: 'Penalty',
      titleEn: 'Seven-Metre — Shade the Pattern',
      situationEn:
        `Seven-metre at {minute}' ({score}). The shooter is {handedness} and has scored three previous sevens high to your left this season. They set for another throw with the same run-up.`,
      questionEn: 'How do you balance tendency against late adjustment?',
      explanationEn:
        'Season patterns justify a slight shade and foot load, not a pre-dive. Stay centred enough to recover if they change height or reverse the throw.',
      answers: answer(
        [
          'Slight shade toward the left-high pattern, react on the release',
          'Correct — shade the tendency while delaying so they cannot reverse you.',
        ],
        [
          'Stay perfectly centred and ignore the three-throw pattern',
          'Good — safe, but you leave free pattern information unused.',
        ],
        [
          'Dive hard left-high before the ball leaves their hand',
          'Risky — early dive lets them soft-roll the opposite corner.',
        ],
        [
          'Step off the line early to distract them before the whistle',
          'Poor — leaving the line risks an open goal if the throw is allowed.',
        ],
      ),
      variationSlots: { minute, score, handedness },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Screened Jump — Sight Line Through Block',
      situationEn:
        `{opponent} run a back-screen set at {minute}' ({score}). The centre back frees the left back for a nine-metre jump; your defence switches late and a pivot body briefly blocks your sight line.`,
      questionEn: 'What do you track while the screen hides the shooter?',
      explanationEn:
        'Screens steal a beat of vision. Stay centred on the ball path through the screen and pick up the final shooter\'s arm — do not chase the screener or guess the gap side.',
      answers: answer(
        [
          'Track the ball through the screen and pick up the final shooter\'s arm',
          'Correct — ball-then-arm through the screen identifies the real release.',
        ],
        [
          'Hold centre and wait for the ball to appear past the screen bodies',
          'Good — patient, but arm pickup through the gap is faster than pure wait.',
        ],
        [
          'Step out to challenge the screener before the shot develops',
          'Risky — challenging the screener opens the freed jump shooter.',
        ],
        [
          'Shift hard to one gap side before you see the release point',
          'Poor — guessing the gap abandons the reverse lane behind the screen.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Advanced',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Defence',
      titleEn: 'Lob Threat — Height Over Early Step',
      situationEn:
        `The pivot seals deep at six metres. At {minute}' ({score}) the right back shapes for a lob over your head while your defender is pinned on the screen and cannot jump to contest.`,
      questionEn: 'How do you set depth against the lob threat?',
      explanationEn:
        'When the lob is the live finish, stay tall with slightly deeper feet and track the shooting arm. An aggressive step under the screen is exactly what the lob wants.',
      answers: answer(
        [
          'Stay tall with slightly deeper feet and track the shooting arm',
          'Correct — height and depth cover the lob without abandoning the power shot.',
        ],
        [
          'Hold your normal depth and trust a late vertical jump on release',
          'Good — workable, but a small depth adjust improves lob reach earlier.',
        ],
        [
          'Step forward under the screen to shrink the power-shot angle',
          'Risky — the forward step is the invitation the lob is waiting for.',
        ],
        [
          'Drop into a low stance preparing for a hard low bounce shot',
          'Poor — low early posture makes the lob almost unsaveable.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Off-Balance Pivot — Late React',
      situationEn:
        `{opponent} play empty-goal 7v6. At {minute}' ({score}) the pivot catches a bounce pass at six metres, slightly off balance, with a defender on their hip.`,
      questionEn: 'What tempo do you use against the off-balance release?',
      explanationEn:
        'An off-balance pivot releases slower and with less disguise. Stay upright and late — early movement gifts them a free adjustment once they regain balance.',
      answers: answer(
        [
          'Stay upright and late; use the slower release to read the finish side',
          'Correct — off-balance tempo is slow; patience turns that into a save.',
        ],
        [
          'Close half a step but keep your feet quiet until the arm starts',
          'Good — small close helps, as long as you do not dive early.',
        ],
        [
          'Drop to a knee early before they fully control the bounce pass',
          'Risky — early drop lets a recovering pivot loft over or reverse you.',
        ],
        [
          'Abandon the pivot lane and cheat toward the open weak-side wing',
          'Poor — leaving a live six-metre catch is an easy goal.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Expert',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Empty Goal — 7v6 Overload Organise',
      situationEn:
        `{opponent} play seven against six with an empty goal at {minute}' ({score}). The extra attacker overloads the left; the ball whips around the perimeter faster than a normal 6:0.`,
      questionEn: 'How do you organise body and voice against the extra player?',
      explanationEn:
        'In empty-goal 7v6 your job is ball-tracking plus constant communication of the overload. Silent hard shifts open skip-pass lanes; leaving the goal is never an option.',
      answers: answer(
        [
          'Track the ball, call the overload side, shift with the perimeter',
          'Correct — voice plus ball-tracking keeps the short-handed 6:0 organised.',
        ],
        [
          'Shade the overload side yourself and let defence find their own marks',
          'Good — logical body shade, but silence lets the skip open behind you.',
        ],
        [
          'Stay dead centre and wait for a shot without calling the overload',
          'Risky — silent waiting gives the extra player time to find the gap.',
        ],
        [
          'Leave the crease to press the ball carrier at nine metres',
          'Poor — abandoning an empty-goal 7v6 is an automatic open goal.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Expert',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Double Pivot — Arm Through the Gap',
      situationEn:
        `Two pivots screen side-by-side at six metres in a positional attack at {minute}' ({score}). The centre back looks to fire through the narrow gap between the screens.`,
      questionEn: 'What sight line do you trust when both screens obscure you?',
      explanationEn:
        'Double screens steal vision on purpose. Stay centred and track the ball into the shooting arm through the gap — shifting to contact side or stepping out opens the reverse lane.',
      answers: answer(
        [
          'Stay centred and track ball into the shooting arm through the gap',
          'Correct — arm tracking through the gap beats guessing which screen side opens.',
        ],
        [
          'Hold a slightly taller stance and wait for ball flight past the bodies',
          'Good — height helps, but arm pickup through the gap is the sharper read.',
        ],
        [
          'Shift toward the pivot making more contact before the shot',
          'Risky — shifting to contact opens the opposite gap for a clean strike.',
        ],
        [
          'Step out to challenge the front screener and shrink the lane',
          'Poor — stepping out into screens opens the shot through the gap.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Goalkeeper',
      primaryPosition: 'Goalkeeper',
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Defence',
      matchPhase: 'Final Minutes',
      titleEn: 'Tied Late — Wing Patience',
      situationEn:
        `Final ninety seconds, score {score}. {opponent}'s {wingSide} wing catches at a narrow angle; the arena is loud and your team needs this stop to keep the tie alive.`,
      questionEn: 'What keeps your save chance highest under this noise?',
      explanationEn:
        'Late pressure amplifies early movement. Run your pre-shot routine, hold centred narrow-angle cover, and read the final shoulder-to-arm path — do not pick a corner early.',
      answers: answer(
        [
          'Run your routine, hold centred cover, read shoulder-to-arm at release',
          'Correct — routine and delayed read beat pressure-driven corner guesses.',
        ],
        [
          'Hold a slightly deeper stance but still wait for the release cue',
          'Good — depth can help on lobs, as long as you do not pre-dive.',
        ],
        [
          'Pick a corner from scouting and dive there before they jump',
          'Risky — pre-committing under late pressure is when wings reverse you.',
        ],
        [
          'Abandon the narrow angle and cheat middle for a possible skip pass',
          'Poor — the wing already has a live catch; leaving them is a gift.',
        ],
      ),
      variationSlots: { score, opponent, wingSide },
    }),
  ];
}
