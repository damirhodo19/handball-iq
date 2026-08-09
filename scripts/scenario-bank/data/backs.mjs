import { defineArchetype, answer, COMMON_SLOTS } from '../archetype-builder.mjs';

const { minute, score, opponent } = COMMON_SLOTS;

function backArchetypes(side, position, category) {
  const wing = side === 'left' ? 'left wing' : 'right wing';
  const oppositeWing = side === 'left' ? 'right wing' : 'left wing';
  const pivotSide = side === 'left' ? 'right' : 'left';
  const nearHalf = side === 'left' ? 'left half' : 'right half';

  return [
    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Basic Gap Between Defenders`,
      situationEn:
        `You catch at nine metres against a set 6:0 at {minute}' ({score}). Your defender is a half-step late. The gap between the ${nearHalf} and centre defender is open for one stride; the ${wing} is covered.`,
      questionEn: 'What do you attack first when that gap appears?',
      explanationEn:
        'A late defender creates a temporary gap. One decisive drive or jump-shot into that lane beats holding for a perfect wing that is already covered.',
      answers: answer(
        [
          'Drive or jump-shot into the open gap before the late defender recovers',
          'Correct — the half-step late defender gifts one clean attacking window.',
        ],
        [
          `Hold at nine metres and wait for the ${wing} to become free`,
          'Good — patient, but the covered wing is not the open option right now.',
        ],
        [
          'Pass sideways to the centre back without threatening the gap',
          'Risky — empty side-passes let the late defender recover into structure.',
        ],
        [
          'Step back beyond ten metres and reset the entire attack',
          'Poor — resetting throws away a created gap against a set 6:0.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Simple Wing Feed Timing`,
      situationEn:
        `At {minute}' ({score}) you have the ball at nine metres. The defence slides toward you. The ${wing} starts a cut toward the six-metre line with a clear receiving lane opening.`,
      questionEn: 'When do you release the pass to the wing?',
      explanationEn:
        'The wing pass must arrive as they reach finishing depth. Early balls let the wing defender recover; late balls shrink the angle.',
      answers: answer(
        [
          'Release as the wing reaches six metres on their cut into space',
          'Correct — timed arrival maximises finishing angle against a sliding defence.',
        ],
        [
          'Hold a beat if the lane is tight, then release into the cut',
          'Good — slight delay can work, but early timing to six metres is cleaner.',
        ],
        [
          'Pass immediately while the wing is still outside nine metres',
          'Risky — early passes give the wing defender time to close the angle.',
        ],
        [
          'Hold until the wing stops and faces you at the sideline',
          'Poor — static wings are easy to deny and kill tempo.',
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
      titleEn: `${position} — Long-Range Read vs Set 6:0`,
      situationEn:
        `You receive at nine metres against a compact 6:0 at {minute}' ({score}). The pivot is sealed on the ${pivotSide}; the ${wing} is covered. Two defenders raise a block line in front of your strong release.`,
      questionEn: 'What must you read before choosing shot or feed?',
      explanationEn:
        'Against a set 6:0 with covered wings, the value is either a corner finish after one fake or a feed into the sealed pivot once the block commits. Blind power into raised arms is low percentage.',
      answers: answer(
        [
          'Read the block line, then shoot a corner gap or feed the sealed pivot',
          'Correct — one defender read decides between corner finish and pivot feed.',
        ],
        [
          'One short fake to move a raised arm, then shoot the freed corner',
          'Good — workable if the fake creates a lane, but the seal is equally valuable.',
        ],
        [
          'Force a power jump shot straight through the raised block',
          'Risky — shooting into a set block wall produces easy saves and rebounds.',
        ],
        [
          `Pass immediately to the covered ${wing} under pressure`,
          'Poor — forcing covered wings turns a controlled possession into a turnover.',
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
      titleEn: `${position} — Feeding the Sealed Pivot`,
      situationEn:
        `The pivot seals the ${pivotSide} defender at six metres at {minute}' ({score}). You have the ball at nine metres; your own defender stands between you and the seal with hands high.`,
      questionEn: 'How do you open the passing lane into the seal?',
      explanationEn:
        'Direct line passes into a high-handed defender are intercepted. A short drive fake shifts that defender, then the bounce or wrist pass hits the space the pivot owns.',
      answers: answer(
        [
          'Short drive fake, then pass into the space the pivot seals',
          'Correct — the fake moves the high hands and opens the feed lane.',
        ],
        [
          'Jump-shot attempt if the defender drops too deep on the fake',
          'Good — valid when the fake creates a clean lane, but the seal is already high value.',
        ],
        [
          'Straight-line pass through the defender\'s raised hands',
          'Risky — alert half-backs cut those direct feeds easily.',
        ],
        [
          'Wave the pivot outside nine metres to receive facing up',
          'Poor — pivots create value inside; pulling them out kills the seal.',
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
      titleEn: `${position} — Isolation Hip Read`,
      situationEn:
        `Your defender gives you space at nine metres at {minute}' ({score}). Hips are open toward the ${pivotSide}. Help from the centre is one stride away; the pivot is ready on the seal.`,
      questionEn: 'What tells you whether to drive, shoot, or feed?',
      explanationEn:
        'In isolation the open hip shows the drive lane. Attack that hip with speed, then decide shot versus pivot feed based on whether help arrives.',
      answers: answer(
        [
          'Attack the open hip, then shoot or feed based on help defence',
          'Correct — hip position sets the lane; help defence decides finish versus pass.',
        ],
        [
          'Immediate jump shot without testing the open hip',
          'Good — can score if the lane is clean, but leaves the isolation unread.',
        ],
        [
          'Pass to the pivot before engaging the defender at all',
          'Risky — early feeds without drawing help are easier to intercept.',
        ],
        [
          'Step back and call for a screen you do not need',
          'Poor — you already have isolation space; inviting a screen slows the attack.',
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
      titleEn: `${position} — Crossing After Late Switch`,
      situationEn:
        `You and the centre back run a crossing action at {minute}' ({score}). The defence switches late; you receive on the ${pivotSide} side at nine metres with the switched defender still turning.`,
      questionEn: 'When must you attack after the cross lands?',
      explanationEn:
        'Crossing value lives in the switch confusion. The receiver must threaten immediately — holding lets the switched defender square up and the structure resets.',
      answers: answer(
        [
          'Attack immediately on the catch before the switched defender squares',
          'Correct — speed after the cross exploits the late switch window.',
        ],
        [
          'One fake to freeze the turning defender, then decide shot or pass',
          'Good — works if the defender recovers balance; still slower than a first-step attack.',
        ],
        [
          'Hold and wait for the pivot to reseal after the switch',
          'Risky — waiting returns organisation to the defence.',
        ],
        [
          'Pass back to the original side without threatening the gap',
          'Poor — the cross loses value if nobody attacks the confusion.',
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
      titleEn: `${position} — Open Side vs Aggressive 5:1`,
      situationEn:
        `{opponent} run an aggressive 5:1 at {minute}' ({score}). Their front defender commits hard to the centre back. You are free on the ${side} side at nine metres with the ${wing} holding width.`,
      questionEn: 'Where does the first advantage appear when the press commits?',
      explanationEn:
        'When the 5:1 front man commits to centre, the ball-side back becomes the open 1v1. Quick reception and attack beat holding for the press to retreat.',
      answers: answer(
        [
          'Receive quickly on the open side and attack the isolated 1v1',
          'Correct — ball speed to the free back punishes the centre commitment.',
        ],
        [
          `Swing once more to the ${oppositeWing} before attacking`,
          'Good — can create a better angle, but may burn the temporary overload.',
        ],
        [
          'Hold the ball at nine metres waiting for the press to drop',
          'Risky — holding lets the 5:1 re-form and removes the open-side gift.',
        ],
        [
          'Launch a deep shot from behind the centre press without engaging',
          'Poor — contested deep shots into a set back line are low percentage.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category,
      primaryPosition: position,
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: `${position} — Power-Play Gap Before Rotation`,
      situationEn:
        `Your team has 6-on-5 at {minute}' ({score}). You receive at nine metres; one short-handed defender is rotating late from the middle. The pivot seals the near man; the ${wing} is open one pass wide.`,
      questionEn: 'What do you punish before the late rotator arrives?',
      explanationEn:
        'Power-play value is temporary. Attack the open gap — finish, feed the seal, or hit the wing — before the rotation rebuilds a 6:0 shape.',
      answers: answer(
        [
          'Attack the open gap immediately — finish, feed the seal, or hit the wing',
          'Correct — the advantage exists only until the late rotator recovers.',
        ],
        [
          'Swing the full perimeter once more looking for a prettier angle',
          'Good — can improve the shot, but often returns the defence to structure.',
        ],
        [
          'Hold at nine metres until the pivot seals even deeper',
          'Risky — holding invites the short-handed unit to recover into 6:0.',
        ],
        [
          'Dribble along the nine-metre line to protect the possession',
          'Poor — power play is for scoring pressure, not empty clock work.',
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
      titleEn: `${position} — First Recoverer on the Break`,
      situationEn:
        `{opponent} win the ball and counter at {minute}' ({score}). You are the first back recovering; their ball carrier approaches at speed with a wing runner on the far side.`,
      questionEn: 'How do you delay without gifting a clean break?',
      explanationEn:
        'The first recoverer must angle the carrier wide and deny the easy skip, buying time for the 6:0 to set — not dive from behind or sprint past the ball.',
      answers: answer(
        [
          'Angle the run to force the carrier wide and delay without fouling',
          'Correct — angled delay slows the break and protects the far-wing skip.',
        ],
        [
          'Sprint goal-side of the far wing first, then recover to the ball',
          'Good — denies the highest-value skip, but only if you can still influence the carrier.',
        ],
        [
          'Dive into a tackle from behind on the ball carrier',
          'Risky — rear contact often means a suspension and a clear chance.',
        ],
        [
          'Stop at halfway and wait for the goalkeeper to manage the 1v1',
          'Poor — backs must delay transition; leaving the carrier free concedes the break.',
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
      titleEn: `${position} — Breaking the Keeper\'s Pattern Read`,
      situationEn:
        `You receive at ten metres at {minute}' ({score}) against a set 6:0. The goalkeeper has saved your last two shots to the same high corner and is already shading that release.`,
      questionEn: 'How do you change the threat without abandoning the shot?',
      explanationEn:
        'When the keeper patterns you, change release type or height — pass fake into shot, or opposite corner — not just more power into the same window.',
      answers: answer(
        [
          'Pass fake, then shoot a different height or the opposite corner',
          'Correct — changing release type beats a keeper who is reading your pattern.',
        ],
        [
          'Feed the pivot if the shade leaves the inside lane soft',
          'Good — valid when the keeper over-commits, but you can still punish with a varied shot.',
        ],
        [
          'Shoot harder into the same high corner they already own',
          'Risky — more power into a patterned save is still their ball.',
        ],
        [
          'Refuse to shoot for the rest of the half to avoid the duel',
          'Poor — predictable avoidance removes your scoring threat entirely.',
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
      titleEn: `${position} — Late Possession Decision`,
      situationEn:
        `Final 40 seconds, score {score}. You are the ${position.toLowerCase()} with the ball at nine metres. One clear gap is open toward the ${nearHalf}; the ${wing} is half-covered. Coach wants a clean decision, not chaos.`,
      questionEn: 'What decides whether you shoot now or use one more pass?',
      explanationEn:
        'Late possessions reward the highest-percentage available action. If the gap is clean, take it; if the wing or pivot is truly freer, one decisive pass — not empty holding to the buzzer.',
      answers: answer(
        [
          'Take the highest-percentage shot or one decisive pass to the open player',
          'Correct — clear value now beats hesitation in the final seconds.',
        ],
        [
          'Use one quick pass to the freer teammate, then they finish cleanly',
          'Good — valid when that teammate is clearly freer than your gap.',
        ],
        [
          'Hold until five seconds then force a deep contested jumper',
          'Risky — last-second chaos usually lowers shot quality.',
        ],
        [
          'Manufacture contact hoping for a seven-metre award',
          'Poor — referees rarely gift seven-metres on forced late contact.',
        ],
      ),
      variationSlots: { score },
    }),
  ];
}

export function getLeftBackArchetypes() {
  return backArchetypes('left', 'Left Back', 'Left Back');
}

export function getRightBackArchetypes() {
  return backArchetypes('right', 'Right Back', 'Right Back');
}

export function getCentreBackArchetypes() {
  return [
    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Basic Ball Shift vs 6:0',
      situationEn:
        `You receive at the top of the nine-metre line against a set 6:0 at {minute}' ({score}). Wings are held; the pivot is sealed. The defence is square and waiting for your first action.`,
      questionEn: 'What is your first job before forcing a shot?',
      explanationEn:
        'Against a set 6:0 the centre back creates value with one purposeful ball shift that moves the block, then attacks the gap or feeds the pivot — not a first-touch hero shot.',
      answers: answer(
        [
          'Shift the ball once to move the block, then attack the gap or feed',
          'Correct — one organised shift creates the opening a set 6:0 hides.',
        ],
        [
          'Threaten a drive first to freeze the centre, then shift the ball',
          'Good — a threat helps, but the decisive step is still the organised shift.',
        ],
        [
          'Immediate jump shot into the square defensive line',
          'Risky — first-option shots into an organised 6:0 are often blocked.',
        ],
        [
          'Hold the ball static at the top until the shot clock tightens',
          'Poor — passive holds let the defence rest and remove tempo.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Choosing the Open Side',
      situationEn:
        `At {minute}' ({score}) the left back is doubled after a drive. The right back stands free at nine metres with the right wing holding width. You have just received the return pass centrally.`,
      questionEn: 'Where should the next attack go after the double?',
      explanationEn:
        'When one side draws a double, the opposite back is the open attacker. Quick ball to that side beats recycling into the crowded trap.',
      answers: answer(
        [
          'Move the ball immediately to the free right-back side',
          'Correct — the double on the left gifts a clean open-side attack.',
        ],
        [
          'Hold centrally and call for the left back to reseal the same gap',
          'Good — can work later, but ignores the free side already available.',
        ],
        [
          'Return the ball into the doubled left side for another drive',
          'Risky — feeding a trap you already created invites a turnover.',
        ],
        [
          'Launch a contested centre shot while both backs are uninvolved',
          'Poor — with a free side open, a forced centre shot wastes the advantage.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Organising Tempo vs Compact 6:0',
      situationEn:
        `You organise against a compact 6:0 at {minute}' ({score}). Both wings are covered on the first look. The pivot flashes a seal between centre and half; your left back asks for an early shot.`,
      questionEn: 'How do you sequence the attack when the first look is covered?',
      explanationEn:
        'If wings are covered, do not force them. Use one shift, threaten the seal, and only release a back shot when a real gap or corner appears.',
      answers: answer(
        [
          'One ball shift, threaten the pivot seal, then release only on a real gap',
          'Correct — covered first looks need sequence, not forced early shots.',
        ],
        [
          'Give the left back the early shot they are asking for anyway',
          'Good — can punish a late slide, but often feeds the compact block.',
        ],
        [
          'Force a skip to a covered wing just to keep the attack wide',
          'Risky — covered wing skips are high-turnover plays.',
        ],
        [
          'Stand still and dribble in place until someone else creates',
          'Poor — the centre back must organise; empty dribbling stalls the set.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Building the Pivot Connection',
      situationEn:
        `The pivot seals at six metres at {minute}' ({score}). You have the ball at nine metres; both half-backs shade you as the playmaker and leave a narrow lane into the seal.`,
      questionEn: 'How do you create a clean feed into the seal?',
      explanationEn:
        'Playmakers who pass without a fake gift intercepts. A short drive fake toward the seal shifts one half-back; the feed then hits the space the pivot owns.',
      answers: answer(
        [
          'Drive fake toward the seal, then pass into the space the pivot owns',
          'Correct — the fake shifts a half-back and opens the feed lane.',
        ],
        [
          'Shoot if the fake makes both half-backs drop too deep',
          'Good — take the shot when the lane opens, but the seal remains high value.',
        ],
        [
          'Thread a direct pass through the shaded hands without a fake',
          'Risky — alert half-backs cut those straight feeds.',
        ],
        [
          'Send the pivot outside nine metres to receive facing the goal',
          'Poor — pivots create scoring value inside; pulling them out kills the seal.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Tempo When Protecting a Lead',
      situationEn:
        `Your team leads by one at {minute}' ({score}). {opponent} press high after every missed shot. Coach wants controlled possession, not empty fast breaks.`,
      questionEn: 'How do you set tempo while still threatening to score?',
      explanationEn:
        'When leading, slow the first pass, use the clock, and attack only on clear gaps. Rushing every possession or endless backwards passes both invite turnovers.',
      answers: answer(
        [
          'Structured build-up, use the clock, attack only on clear gaps',
          'Correct — controlled tempo protects the lead without becoming passive.',
        ],
        [
          'One quick attack if a clear break opens, otherwise rebuild',
          'Good — selective pace is fine when the gap is real.',
        ],
        [
          'Rush every attack at maximum speed to extend the lead',
          'Risky — rushed possessions when leading produce cheap turnovers.',
        ],
        [
          'Pass backwards continuously without ever threatening nine metres',
          'Poor — empty backwards passing invites pressing traps and fouls under pressure.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Breaking the 5:1 Front Press',
      situationEn:
        `{opponent} deploy a 5:1 at {minute}' ({score}). Their front defender commits onto you as you catch at the top. The left back is free for one stride; the right wing holds width.`,
      questionEn: 'What do you do the moment the front defender commits?',
      explanationEn:
        'A committed 5:1 front man opens a back or wing. The pass must leave before the press recovers — holding or solo dribbling into the trap gifts turnovers.',
      answers: answer(
        [
          'Release quickly to the open back or wing before the press recovers',
          'Correct — ball speed beats the 5:1 commitment on the centre.',
        ],
        [
          'One short fake to freeze the front man, then hit the free back',
          'Good — works if the fake is sharp; delay still risks recovery.',
        ],
        [
          'Dribble through the press trying to win a foul alone',
          'Risky — solo dribbles into a set press are high-turnover plays.',
        ],
        [
          'Hold the ball at the top waiting for the press to retreat',
          'Poor — waiting lets the 5:1 fully re-form around you.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Finding the Weak Line in 3:2:1',
      situationEn:
        `{opponent} play a 3:2:1 at {minute}' ({score}). Their middle line overloads your left side after two consecutive attacks there. The right back and right wing are lightly covered.`,
      questionEn: 'How do you attack a 3:2:1 that has overloaded one side?',
      explanationEn:
        '3:2:1 breaks when you identify the weak line and overload it. Persistent attacks into the loaded side are absorbed; weak-side ball movement forces collapse.',
      answers: answer(
        [
          'Identify the weak right side, overload it, and attack the gap',
          'Correct — weak-side identification is how you break 3:2:1 structure.',
        ],
        [
          'Use the pivot as a short link to change the point of attack',
          'Good — pivot links can shift lines if the next pass still finds the weak side.',
        ],
        [
          'Attack the same loaded left side again because it worked earlier',
          'Risky — repeating into an overloaded line is exactly what 3:2:1 wants.',
        ],
        [
          'Ignore structure and force a centre jump shot into three lines',
          'Poor — blind centre shots into 3:2:1 produce blocks and easy outlets.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Directing the 6-on-5',
      situationEn:
        `Your team has 6-on-5 at {minute}' ({score}). You direct from the centre. One short-handed defender is late rotating toward the right; the pivot seals left of centre.`,
      questionEn: 'How do you turn the numerical edge into a shot?',
      explanationEn:
        'In power play the centre back must move the ball to the open side and call the shot when the gap appears. Indecision or perimeter-only passing lets the defence recover.',
      answers: answer(
        [
          'Move the ball to the open side and call the shot when the gap opens',
          'Correct — decisive direction is what converts 6-on-5 into goals.',
        ],
        [
          'Use one extra swing if the first gap closes, then attack the next',
          'Good — one recovery swing is fine; endless swinging is not.',
        ],
        [
          'Hold centrally waiting for a perfect uncontested look',
          'Risky — waiting allows the short-handed unit to rebuild 6:0 shape.',
        ],
        [
          'Shoot every possession yourself from the same central pocket',
          'Poor — predictable centre shooting is easy for a short-handed defence to key on.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      secondaryPositions: ['Left Back', 'Right Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Centre Back — Organising Transition Defence',
      situationEn:
        `Turnover at {minute}' ({score}). You are the deepest field player as {opponent} outlet immediately to the far wing. Your teammates are still above the nine-metre line.`,
      questionEn: 'What is your first responsibility in this break?',
      explanationEn:
        'The deepest centre back must delay centrally and organise wing coverage with clear calls. Solo pressing or stopping to argue leaves the highest-value lanes open.',
      answers: answer(
        [
          'Delay centrally and direct wing coverage with clear communication',
          'Correct — central delay plus vocal organisation stops the clean break.',
        ],
        [
          'Sprint to cut the far-wing skip first, then recover to the middle',
          'Good — denies the best outlet if you can still influence the centre lane after.',
        ],
        [
          'Press the outlet passer alone as hard as possible',
          'Risky — solo presses are beaten by one skip when wings are free.',
        ],
        [
          'Stop to protest the turnover before recovering goal-side',
          'Poor — transition defence starts on the loss of possession, not after the argument.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Advanced',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Timing the Back-Screen Set',
      situationEn:
        `Your team runs a back-screen set at {minute}' ({score}). You call the play from the centre. The screen lands clean; the freed back has a two-second window before help slides.`,
      questionEn: 'What keeps the set play valuable after the screen lands?',
      explanationEn:
        'Set plays live on timing. Once the screen frees a back, they must shoot or pass inside that short window — improvising mid-play or holding kills the action.',
      answers: answer(
        [
          'Freed back shoots or feeds within two seconds of the screen landing',
          'Correct — set-play value is the immediate window, not later improvisation.',
        ],
        [
          'One short read for help defence, then finish or pass inside the window',
          'Good — a micro-read is fine if it still fits the two-second window.',
        ],
        [
          'Hold after the screen to invent a second action',
          'Risky — holding lets help arrive and erases the screen\'s purpose.',
        ],
        [
          'Break the timing mid-play because a different idea appears',
          'Poor — broken timing is why rehearsed sets fail under pressure.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Centre Back — Final Possession Execution',
      situationEn:
        `Final possession of the half at {minute}' ({score}). You have the ball at nine metres with eight seconds on the shot clock. One back has a playable gap; a full reset would leave three seconds.`,
      questionEn: 'What is the right final-possession standard here?',
      explanationEn:
        'On a last possession, take the best available shot inside the system. Empty holding to the buzzer or a full reset that kills the clock wastes the chance.',
      answers: answer(
        [
          'Take the best available system shot before the clock expires',
          'Correct — structured final shots beat chaos and empty resets.',
        ],
        [
          'One decisive pass to the open back, then they finish inside the clock',
          'Good — valid when that back is clearly freer than your own look.',
        ],
        [
          'Hold until the buzzer and force a deep contested jumper',
          'Risky — rushed deep shots under the horn are low percentage.',
        ],
        [
          'Full reset that leaves only three seconds for a chaos throw',
          'Poor — a reset that burns the possession window abandons the system shot.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Centre Back',
      primaryPosition: 'Centre Back',
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      titleEn: 'Centre Back — Calm Direction When Trailing',
      situationEn:
        `Your team trails by two at {minute}' ({score}). {opponent} press after every possession. Teammates look to you for the next action; the crowd noise is rising.`,
      questionEn: 'How do you lead the next attack without turning it into panic?',
      explanationEn:
        'When trailing, the centre back stays calm, calls one clear structure, and takes calculated risks through that structure — not desperate deep shots or solo play.',
      answers: answer(
        [
          'Stay calm, call one clear structure, take calculated risks inside it',
          'Correct — structured risk under pressure beats panic creativity.',
        ],
        [
          'Speed up ball movement inside the same structure to create earlier gaps',
          'Good — tempo up inside structure is fine; abandoning structure is not.',
        ],
        [
          'Stop involving teammates and hunt a solo deep goal',
          'Risky — isolation heroics when trailing usually gift turnovers.',
        ],
        [
          'Force contested long-range shots every possession to chase the deficit',
          'Poor — panic shooting accelerates the deficit instead of closing it.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),
  ];
}
