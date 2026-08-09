import { defineArchetype, answer, COMMON_SLOTS } from '../archetype-builder.mjs';

const { minute, score, opponent, defensiveSystem } = COMMON_SLOTS;

export function getPivotArchetypes() {
  return [
    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Attack',
      titleEn: 'Pivot — Seal Side vs Flat Line',
      situationEn:
        'Against a flat 6:0 at {minute}\' ({score}), the centre back has the ball at nine metres. You stand open at six metres between the two middle defenders. Both watch the ball.',
      questionEn: 'Where do you seal first to create a real passing lane?',
      explanationEn:
        'Seal on the side opposite the ball so the back can feed through the gap the ball-watching defenders leave. Standing dead-centre is easy to cover from both sides.',
      answers: answer(
        [
          'Seal between defenders on the side opposite the ball',
          'Correct — opposite-side seal opens a legal feed lane the centre back can hit.',
        ],
        [
          'Hold the open centre gap and call for a bounce pass',
          'Good — possible if both middles ball-watch, but easier to close from both sides.',
        ],
        [
          'Step outside nine metres to create a hand-off for the backs',
          'Risky — leaving six metres removes your finishing threat against a set 6:0.',
        ],
        [
          'Stand directly behind one middle defender and wait',
          'Poor — nesting behind a defender hides you and kills the pass angle.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Pivot — Clearing the Drive Lane',
      situationEn:
        'At {minute}\' ({score}) the left back prepares to drive the gap. You are sealed on the same side at six metres. Help defence is already shading toward the drive.',
      questionEn: 'What off-ball action opens the drive instead of clogging it?',
      explanationEn:
        'Clear to the opposite side or set a cross-screen so the drive lane stays empty. Asking for the ball in the same gap collapses both options.',
      answers: answer(
        [
          'Clear opposite or set a cross-screen, then reseal after the drive',
          'Correct — clearing empties the lane; resealing keeps a second option live.',
        ],
        [
          'Hold your seal and demand the bounce pass into the drive',
          'Good — works if the back is passing, but blocks the drive if they are shooting.',
        ],
        [
          'Step up to nine metres and ask for a hand-off',
          'Risky — traffic at nine metres invites help and removes the six-metre threat.',
        ],
        [
          'Stay planted in the drive lane waiting for contact',
          'Poor — standing in the lane turns a clear drive into a congested collision.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Pivot — Secure Under Back Contact',
      situationEn:
        'You catch a bounce pass at six metres with a defender on your back at {minute}\' ({score}). Contact is legal and tight. Help is one stride from doubling.',
      questionEn: 'How do you secure the catch before help arrives?',
      explanationEn:
        'Protect the ball, pivot to create one finishing or passing window, then decide within two seconds. Holding for a soft foul usually gifts the double-team.',
      answers: answer(
        [
          'Protect the ball, pivot once, finish or release within two seconds',
          'Correct — one secure move under contact beats waiting for a whistle.',
        ],
        [
          'Pass back to nine metres the instant contact arrives',
          'Good — safe if help is already there, but you already earned a six-metre catch.',
        ],
        [
          'Spin immediately toward the near post without securing the catch',
          'Risky — spinning before the ball is secure invites a strip or travel.',
        ],
        [
          'Hold still and wait for the referee to call a foul',
          'Poor — referees rarely bail out a static pivot; the double-team will arrive.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Pivot — Legal Goalkeeper Screen',
      situationEn:
        'Your right back jumps for a nine-metre shot at {minute}\' ({score}). The goalkeeper has a clear sight line. You are at six metres with time to set before release.',
      questionEn: 'How do you screen the keeper without conceding a foul?',
      explanationEn:
        'Legal screens are stationary with arms in before the shot. Moving into the keeper after they set, or jumping with hands out, turns a screen into a foul.',
      answers: answer(
        [
          'Set a stationary screen with arms in between keeper and shooter',
          'Correct — stationary body screen blocks the view without fouling.',
        ],
        [
          'Hold the seal and stay out of the shooting lane entirely',
          'Good — avoids fouls, but leaves the keeper with a clear sight line.',
        ],
        [
          'Step laterally into the keeper as the shot leaves the hand',
          'Risky — a moving screen after the keeper sets is a foul throw.',
        ],
        [
          'Jump with arms high to tip the ball before it reaches the keeper',
          'Poor — pivots cannot legally tip shots with extended arms from this position.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Pivot — Finish Before Recovery',
      situationEn:
        'You catch facing goal at six metres at {minute}\' ({score}). The keeper is centred. One defender recovers from the weak side and will arrive in one stride. The near wing is open.',
      questionEn: 'Which action do you take before the recovery closes?',
      explanationEn:
        'Speed beats perfection. A quick near-post spin or a bounce to the open wing converts before the recoverer sets. Holding invites the double.',
      answers: answer(
        [
          'Quick near-post spin finish or bounce to the open wing now',
          'Correct — the window exists only until the recovering defender arrives.',
        ],
        [
          'Pass back to the centre back for a reset',
          'Good — safe, but turns a six-metre catch into a restarted 6:0 attack.',
        ],
        [
          'Hold one extra fake to freeze the centred keeper',
          'Risky — one more fake often gives the recoverer the block angle.',
        ],
        [
          'Retreat outside nine metres looking for a jump shot',
          'Poor — pivots surrender their highest-value finish by leaving six metres.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Advanced',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Pivot — Reading Rotation Gaps',
      situationEn:
        '{opponent} rotate hard on every perimeter pass at {minute}\' ({score}). Ball swings left to right. The middle defender leaves your seal to pressure the receiving back.',
      questionEn: 'Where do you move as the rotation leaves your seal?',
      explanationEn:
        'Rotation creates a temporary vacancy. Slide into the space the departing defender vacated before the next rotator fills it.',
      answers: answer(
        [
          'Slide into the gap the rotating defender just vacated',
          'Correct — the vacated pocket is the highest-value pivot receive.',
        ],
        [
          'Step out to nine metres to drag a defender high',
          'Good — can create a backdoor, but against hard rotation the vacated gap is cleaner.',
        ],
        [
          'Stay sealed on the original mark regardless of the rotation',
          'Risky — static seals are easy to re-cover after the unit rotates.',
        ],
        [
          'Chase the ball toward the new ball-side wing',
          'Poor — ball-following pivots clog traffic and leave the middle empty.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Pivot — Bounce-Pass Catch Angle',
      situationEn:
        'The left back prepares a bounce pass into six metres at {minute}\' ({score}). Your defender fronts you on the strong side. A soft gap opens behind the fronting defender toward the near post.',
      questionEn: 'How do you present for the bounce without losing the seal?',
      explanationEn:
        'Show a target hand in the soft gap behind the fronter, keep the seal hip, and catch on the move toward goal. Standing still behind the fronter kills the angle.',
      answers: answer(
        [
          'Show a target in the soft gap and catch moving toward the near post',
          'Correct — receiving behind the fronter turns the front into a screen for you.',
        ],
        [
          'Release the seal and cut high for a hand-off at nine metres',
          'Good — creates an outlet, but abandons the six-metre advantage already built.',
        ],
        [
          'Fight in front of the defender and demand the pass through the body',
          'Risky — straight-line feeds into a fronting defender are often stripped.',
        ],
        [
          'Turn your back fully and wait for the pass to find you',
          'Poor — passive nesting gives the defender every denial angle.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Pivot — Clutch Six-Metre Read',
      situationEn:
        'Final 50 seconds, you trail by one at {score}. You catch at six metres with one defender on your hip. The keeper shades your strong-side spin. Coach wants a clean finish, not a hero pass.',
      questionEn: 'What do you finish or force before the double arrives?',
      explanationEn:
        'Under late pressure, one clear action beats creativity: finish opposite the keeper shade or draw the foul immediately. Holding invites the double and a turnover.',
      answers: answer(
        [
          'Finish opposite the keeper shade or draw the foul within one second',
          'Correct — one decisive six-metre action protects the last possession.',
        ],
        [
          'Soft near-post placement with a short fake against the shade',
          'Good — executable if contact stays light, but slower than finishing or drawing immediately.',
        ],
        [
          'Hold through contact waiting for a second perimeter option',
          'Risky — delay invites the double-team and a strip in the final minute.',
        ],
        [
          'Pass back for a full reset despite the six-metre catch',
          'Poor — resetting from a live six-metre catch wastes the trail-by-one chance.',
        ],
      ),
      variationSlots: { score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Expert',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Pivot — Empty-Goal 7v6 Timing',
      situationEn:
        'Your goalkeeper joins as an extra field player at {minute}\' ({score}). You seal at six metres. {opponent} leave one defender high to protect against the empty-goal long throw.',
      questionEn: 'When do you demand the inside feed in 7v6?',
      explanationEn:
        'Demand the feed when the high defender commits to the perimeter and your seal creates a clear lane. Early calls before the overload forms invite turnovers into the empty goal.',
      answers: answer(
        [
          'Call for the feed once the high defender commits and your seal opens a lane',
          'Correct — timing the feed to the commitment protects the empty-goal risk.',
        ],
        [
          'Stay quiet and let the perimeter shooters decide alone',
          'Good — can work, but a live seal should be part of the 7v6 threat.',
        ],
        [
          'Demand every bounce pass immediately after the keeper crosses halfway',
          'Risky — premature feeds into unsettled structure gift empty-goal counters.',
        ],
        [
          'Drift to the sideline to act as an outlet for the empty-goal throw',
          'Poor — abandoning six metres removes the main reason for playing 7v6.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Pivot',
      primaryPosition: 'Pivot',
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Pivot — Transition Recovery Duty',
      situationEn:
        'Turnover at {minute}\' ({score}) while you are the deepest attacker at six metres. {opponent} outlet immediately to their wing. Two of your backs are still above nine metres.',
      questionEn: 'What is your first defensive job on the loss?',
      explanationEn:
        'Pivots sprint goal-side first — mark the opposing pivot or cover the centre channel. Staying up court hoping for a return pass gifts the easy break.',
      answers: answer(
        [
          'Sprint goal-side, mark their pivot or cover the centre channel',
          'Correct — deepest attacker becomes first recovery body in the middle.',
        ],
        [
          'Sprint to cut the far-wing skip lane, then recover goal-side',
          'Good — denies the highest-value skip, though centre cover is your first duty here.',
        ],
        [
          'Press the outlet passer from behind to force a bounce',
          'Risky — solo chase is beaten by one skip if the middle stays empty.',
        ],
        [
          'Hold near halfway hoping for an immediate return steal',
          'Poor — offensive lingering after a turnover is how easy counters start.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),
  ];
}

export function getDefenceArchetypes() {
  return [
    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Beginner',
      pressureLevel: 'Low',
      attackOrDefence: 'Defence',
      defensiveSystem: '6-0',
      titleEn: 'Defence — Unit Shift on Ball Swing',
      situationEn:
        'You defend a set 6:0 at {minute}\' ({score}). Ball swings from right back to left back. Your unit is still weighted to the original ball side.',
      questionEn: 'How does the unit shift so the new ball side stays covered?',
      explanationEn:
        'Shift together: ball-side pressure without over-committing, weak-side tuck one step. Solo movers break the wall and open skip lanes.',
      answers: answer(
        [
          'Shift as a unit — ball-side pressure, weak-side tuck, no over-commit',
          'Correct — coordinated shift keeps the wall intact under the swing.',
        ],
        [
          'Ball-side defender closes hard while weak side holds depth for the skip',
          'Good — protects the skip, but without a full unit shift the middle softens.',
        ],
        [
          'Only the nearest defender closes; everyone else holds the old spots',
          'Risky — individual close-outs leave gaps the next pass will find.',
        ],
        [
          'Collapse all six bodies toward the new ball carrier',
          'Poor — full collapse opens the opposite wing and pivot seal.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing'],
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Defence',
      defensiveSystem: '6-0',
      titleEn: 'Defence — Weak-Side Wing Vision',
      situationEn:
        'Ball is on the opposite wing in a flat 6:0 at {minute}\' ({score}). Your wing attacker starts a back-door cut toward six metres while you ball-watch.',
      questionEn: 'What body position stops the back-door before the skip arrives?',
      explanationEn:
        'See ball and player. Drop one step inside when the ball is opposite so the cut lane closes without abandoning the sideline entirely.',
      answers: answer(
        [
          'See ball and player, drop one step inside to cut the back-door lane',
          'Correct — inside drop denies the cut while you still track the skip.',
        ],
        [
          'Hold width with an open stance so you can see both ball and cutter',
          'Good — vision helps, but without the inside drop the cut lane stays open.',
        ],
        [
          'Face the ball fully and trust peripheral vision on the wing',
          'Risky — full ball-watching loses the cutter until the pass is already gone.',
        ],
        [
          'Push out early to press the wing before they cut',
          'Poor — early push opens the skip lane behind you.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Defence',
      defensiveSystem: '5-1',
      titleEn: 'Defence — 5:1 High Press Trigger',
      situationEn:
        'You play the high point in a 5:1 at {minute}\' ({score}). The centre back catches facing you with time. Wings are held; the pivot is sealed low.',
      questionEn: 'When do you pressure the centre back without wrecking the line?',
      explanationEn:
        'Pressure when they catch facing up with time — force an early pass. Dive only after they commit; gambling before the catch opens the middle for the pivot.',
      answers: answer(
        [
          'Press the facing catch to force an early pass, recover if they reverse',
          'Correct — timed high pressure without abandoning the recover line.',
        ],
        [
          'Hold at nine metres and never engage the centre back',
          'Good — keeps the line, but wastes the point of playing 5:1.',
        ],
        [
          'Dive at the ball the moment it leaves the previous passer hand',
          'Risky — early dives are reversed into the space you vacated.',
        ],
        [
          'Chase the centre back laterally wherever they dribble',
          'Poor — lateral chase opens the middle for the sealed pivot.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Pivot', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Defence — Denying the Pivot Seal',
      situationEn:
        'Opposing pivot seals at six metres at {minute}\' ({score}). You are behind the seal. The centre back loads a bounce-pass fake. Help from the middles is late.',
      questionEn: 'How do you deny the feed without wrapping?',
      explanationEn:
        'Front when you can. If stuck behind, use legal forearm contact and a high deny hand on the passing lane — wrapping gifts a free throw or seven-metre.',
      answers: answer(
        [
          'Front if possible; if behind, forearm deny with a high hand on the lane',
          'Correct — legal contact plus lane denial without wrapping.',
        ],
        [
          'Stay goal-side with active hands and call for middle help early',
          'Good — organises help, but without the deny hand the feed still arrives.',
        ],
        [
          'Wrap both arms around the pivot to freeze their movement',
          'Risky — wrapping is a foul and often creates a free throw or seven-metre.',
        ],
        [
          'Give three metres of space and wait to contest the shot later',
          'Poor — free reception at six metres is an easy finish or foul draw.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Defence — Help Timing on Beaten Teammate',
      situationEn:
        'Your teammate loses hip position at nine metres at {minute}\' ({score}). The attacker drives the gap. You are the nearest help defender with a mark on the weak-side back.',
      questionEn: 'When do you help, and what do you do after the stop?',
      explanationEn:
        'Help when hip position is lost — show from the centre, force a pass or contested shot, then recover to your mark. Helping on every fake empties your own player.',
      answers: answer(
        [
          'Help from centre once hips are lost, force a pass, then recover your mark',
          'Correct — timed help stops the drive without permanently abandoning coverage.',
        ],
        [
          'Show help early with a short step, then recover if your teammate recovers hips',
          'Good — soft help can deter, but a lost-hip drive needs a firmer stop.',
        ],
        [
          'Help on the first shot fake even while your teammate still has hip position',
          'Risky — early help leaves your mark open for the reverse pass.',
        ],
        [
          'Stay glued to your mark and refuse any help responsibility',
          'Poor — refusing help gifts a free path to six metres.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Defence — Skip-Pass Recovery Sprint',
      situationEn:
        'Attack throws a skip pass across the court at {minute}\' ({score}). Your unit is fully shifted to the original ball side. The receiving back has one clean catch window.',
      questionEn: 'Who sprints first, and what does the rest of the unit do?',
      explanationEn:
        'Weak-side back sprints to the ball; the unit shifts behind that sprint. Everyone flooding the new ball side leaves the opposite wing free for the next skip.',
      answers: answer(
        [
          'Weak-side back sprints to the catch; unit shifts and communicates coverage',
          'Correct — one sprint plus unit shift closes the window without overloading.',
        ],
        [
          'Nearest middle rotates first while weak-side back closes the wing behind',
          'Good — covers the next skip, but the live catch still needs the weak-side sprint.',
        ],
        [
          'Wait until the receiver lands before anyone leaves their current spot',
          'Risky — late recovery gifts a clean catch-and-shoot.',
        ],
        [
          'All perimeter defenders sprint to the new ball side together',
          'Poor — mass sprint opens the opposite wing for the next skip.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Defence',
      defensiveSystem: '3-2-1',
      titleEn: 'Defence — 3:2:1 Close-Out Control',
      situationEn:
        'In a 3:2:1 at {minute}\' ({score}), ball swings to the left back at nine metres. You are the recovering high defender. The shooter has time if you arrive out of control.',
      questionEn: 'How do you close out so the shot stays contested without a foul?',
      explanationEn:
        'Arrive on balance with hands high, force a pass or contested release. Flying leaps create fouls or blow-bys that wreck the 3:2:1 shape.',
      answers: answer(
        [
          'Arrive on balance, hands high, force a pass or contested release',
          'Correct — controlled close-out keeps the system and contests the shot.',
        ],
        [
          'Close under control and funnel the shooter toward your recovering help',
          'Good — smart direction, provided you still contest the release.',
        ],
        [
          'Sprint flat-out and leap at the shooter shooting arm',
          'Risky — flying close-outs produce fouls or easy drives past you.',
        ],
        [
          'Stop short at eleven metres and concede the open nine-metre shot',
          'Poor — uncontested nines are exactly what 3:2:1 tries to prevent.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Defence — Shot-Block Release Timing',
      situationEn:
        'A backcourt player jumps for a nine-metre shot at {minute}\' ({score}). You have a legal blocking angle from the side. The shooter has already used one fake.',
      questionEn: 'When do you leave your feet for the block?',
      explanationEn:
        'Jump as the ball leaves the hand with arms straight up. Jumping on the wind-up eats the fake; reaching across the body is a foul.',
      answers: answer(
        [
          'Jump on the release with arms straight up through the shooting lane',
          'Correct — release timing keeps the block legal and hard to fake.',
        ],
        [
          'Stay grounded with a high hand and contest without leaving your feet',
          'Good — safe contest, but a clean release-timed block is available here.',
        ],
        [
          'Leave your feet on the first upward motion of the shooting arm',
          'Risky — early jumps are faked into open space behind you.',
        ],
        [
          'Reach across the shooter body to tip the ball sideways',
          'Poor — reaching across is a foul even if you touch the ball.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing', 'Pivot', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Defence — First Bodies in Transition',
      situationEn:
        'Your team loses possession at {minute}\' ({score}). Three attackers are already ahead of your line. You are the first field player recovering toward goal.',
      questionEn: 'What is the first job before the rest of the unit arrives?',
      explanationEn:
        'Delay centrally without fouling, then fill 6:0 as bodies arrive. Mass pressing the ball opens pass lanes; stopping to argue ends the recovery.',
      answers: answer(
        [
          'Delay the ball centrally without fouling, then fill a 6:0 spot',
          'Correct — central delay buys the sprint that rebuilds the wall.',
        ],
        [
          'Sprint to cut the far-wing skip first, then drop into the wall',
          'Good — stops the highest-value pass, if someone else delays the ball.',
        ],
        [
          'Press the ball carrier with teammates in a chase pack',
          'Risky — chase packs are beaten by one skip to the open wing.',
        ],
        [
          'Sprint past the attackers straight to your own wing spot',
          'Poor — running past leaves the middle unprotected during the break.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Defence',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Defence',
      matchPhase: 'Final Minutes',
      titleEn: 'Defence — Late Lead, No-Gamble Stand',
      situationEn:
        'Final 28 seconds, you lead by one at {score}. {opponent} have possession against your set defence. Their best scorer loads at nine metres looking for a double-team reaction.',
      questionEn: 'What defensive priority protects the one-goal lead?',
      explanationEn:
        'Stay in system, no fouls, no steal gambles. Force a low-percentage contested shot. Doubling a playmaker late creates the open wing that loses the game.',
      answers: answer(
        [
          'Stay in system, refuse fouls, force a contested low-percentage shot',
          'Correct — disciplined structure is how one-goal leads survive.',
        ],
        [
          'Shade the top scorer with high hands while the unit holds shape',
          'Good — adds pressure without the full double that frees the wing.',
        ],
        [
          'Double the best scorer immediately to force a turnover',
          'Risky — late doubles on playmakers free the weak-side wing.',
        ],
        [
          'Foul intentionally away from the ball to stop the clock',
          'Poor — intentional fouls in the final seconds invite seven-metres.',
        ],
      ),
      variationSlots: { score, opponent },
    }),
  ];
}

export function getFastBreakArchetypes() {
  return [
    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing'],
      difficulty: 'Beginner',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Fast Break — Wing Sprint Trigger',
      situationEn:
        'Your team wins possession at {minute}\' ({score}). The outlet is at centre court. You are the wing still near halfway with one recovering defender between you and six metres.',
      questionEn: 'When do you start the sprint so the finish stays on?',
      explanationEn:
        'Sprint on possession confirmation so you arrive as the ball arrives. Waiting for the catch at halfway gifts the recoverer the finishing lane.',
      answers: answer(
        [
          'Sprint on possession confirmation and arrive with the pass at six metres',
          'Correct — timed sprint keeps speed and finishing angle alive.',
        ],
        [
          'Start the sprint as the outlet leaves the passer hand',
          'Good — close timing, provided possession is already secure.',
        ],
        [
          'Hold until the ball crosses halfway, then accelerate past the defender',
          'Risky — late starts let the recoverer take the lane first.',
        ],
        [
          'Stay connected to the back line for defensive balance on this break',
          'Poor — with a clear wing lane developing you must commit to the break.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Fast Break — Short Pass Beats Cross-Court',
      situationEn:
        'You carry the break at {minute}\' ({score}) with two lanes open: a short pass to the near wing in stride, or a long cross-court to the far wing who is slightly ahead.',
      questionEn: 'Which pass keeps break speed without inviting the intercept?',
      explanationEn:
        'Prefer the short pass that keeps tempo. Take the cross-court only when the near wing is covered and the far wing is truly free.',
      answers: answer(
        [
          'Hit the near wing if open; cross-court only when the near wing is covered',
          'Correct — shortest live pass preserves speed and reduces intercept risk.',
        ],
        [
          'Bounce to the trailing pivot as a safety valve if both wings tighten',
          'Good — valid second option, but slower than a live near-wing finish.',
        ],
        [
          'Throw the long cross-court for the more spectacular finish angle',
          'Risky — longer flight time lets recoverers cut the lane.',
        ],
        [
          'Keep dribbling alone to the nine-metre line before choosing',
          'Poor — solo dribbling slows the break and invites help defence.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Left Wing', 'Right Wing'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Fast Break — 2-on-1 Keeper Commit',
      situationEn:
        '2-on-1 at {minute}\' ({score}). You carry centrally; your wing sprints wide. The lone defender shades you. The keeper holds depth waiting for your eyes.',
      questionEn: 'What do you force the defender or keeper to show before deciding?',
      explanationEn:
        'Commit the last defender or read the keeper\'s step, then pass or finish. Early automatic passes let the defender recover; early solo shots waste the open wing.',
      answers: answer(
        [
          'Commit the last defender, then pass if they step or finish if they freeze',
          'Correct — forcing a show creates the clean wing finish or open shot.',
        ],
        [
          'Read the keeper first step, then choose pass or finish from that commit',
          'Good — works if the defender stays soft, but the defender show is cleaner here.',
        ],
        [
          'Pass to the wing immediately without engaging the last defender',
          'Risky — early passes let the defender recover onto the wing.',
        ],
        [
          'Stop at nine metres and wait for the rest of the team',
          'Poor — stopping converts a 2-on-1 into a set defence.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Fast Break — 3-on-2 Last Defender',
      situationEn:
        'Your team counters 3-on-2 at {minute}\' ({score}). You have the ball at centre with wings both ahead. Two defenders are set near six metres waiting for the early pass.',
      questionEn: 'How do you break the 3-on-2 before the defence numbers up?',
      explanationEn:
        'Attack the last defender to create a 2-on-1 on one side, then release. Early wing-to-wing hoping gifts the defence time to become 3-on-3.',
      answers: answer(
        [
          'Attack the last defender to create a side 2-on-1, then release',
          'Correct — committing the last body turns 3-on-2 into a clean finish.',
        ],
        [
          'Drive the middle gap to split the two defenders before releasing wide',
          'Good — can work if the gap is real, but side 2-on-1 is the cleaner structure.',
        ],
        [
          'Swing wing-to-wing once hoping one skip freezes both defenders',
          'Risky — early swings without a commit often become 3-on-3.',
        ],
        [
          'Hold at centre court until the trailing backs arrive for even numbers',
          'Poor — waiting kills the break you already earned.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'Goalkeeper',
      secondaryPositions: [],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Fast Break — Goalkeeper Outlet Window',
      situationEn:
        'You save and secure the ball at {minute}\' ({score}). Three opponents are still above your nine-metre line. Your nearest back is open on the right; the far wing is sprinting but covered by a recoverer.',
      questionEn: 'Where do you release the outlet before the defence sets?',
      explanationEn:
        'Hit the nearest open back or wing while the lane is live. Holding for the perfect far-wing throw lets the defence recover; covered long throws are intercepted.',
      answers: answer(
        [
          'Quick outlet to the nearest open back while the lane is still live',
          'Correct — the first open outlet starts the break before recovery.',
        ],
        [
          'Hit the near wing if they are ahead of their recoverer by a clear step',
          'Good — valid when the near wing wins the race; here the open back is cleaner.',
        ],
        [
          'Hold two extra seconds for the far wing to win a cleaner race',
          'Risky — delay is exactly what recovering defences need.',
        ],
        [
          'Throw the length of the court toward the covered far wing',
          'Poor — covered long outlets are the classic transition intercept.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Fast Break — Delay Without the Foul',
      situationEn:
        '{opponent} break 2-on-1 at {minute}\' ({score}). You are the first defender back between ball and goal. Your teammates are three strides behind.',
      questionEn: 'How do you delay the break long enough for recovery?',
      explanationEn:
        'Angle the carrier wide, slow the break, stay legal. A transition foul often becomes a seven-metre; running past leaves both attackers free.',
      answers: answer(
        [
          'Angle the carrier wide and slow the break without fouling',
          'Correct — legal angled delay buys the recovering bodies time.',
        ],
        [
          'Force the ball toward the sideline and protect the pass lane to the wing',
          'Good — strong if you still slow the carrier; pure lane focus can get beaten centrally.',
        ],
        [
          'Foul the ball carrier immediately to stop the numerical break',
          'Risky — transition fouls frequently become seven-metres.',
        ],
        [
          'Sprint past both attackers to reclaim your set defensive spot',
          'Poor — running past abandons the live 2-on-1 in front of goal.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Pivot', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Fast Break — Trailer Pivot Lane',
      situationEn:
        'Your team breaks 2-on-1 at {minute}\' ({score}). You are the pivot trailing at centre court. The first wave may be stopped at nine metres.',
      questionEn: 'Where do you trail so you stay useful if the break stalls?',
      explanationEn:
        'Trail centrally as a safety valve and secondary finish. Sprinting ahead of the ball clogs the lane; staying in your own half removes the second wave.',
      answers: answer(
        [
          'Trail centrally as a safety pass and secondary scoring option',
          'Correct — the trailer keeps the break alive if the first wave stalls.',
        ],
        [
          'Cut to the far sideline and wait for a cross-court outlet',
          'Good — width can help, but central trailing is the cleaner second option.',
        ],
        [
          'Sprint ahead of the ball carrier into the same finishing lane',
          'Risky — overlapping the carrier clogs the 2-on-1 you already have.',
        ],
        [
          'Hold near your own free-throw line for defensive balance',
          'Poor — on a live break the trailer must follow the attack.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Fast Break — Deny the First Outlet',
      situationEn:
        'After a save at {minute}\' ({score}), their goalkeeper looks for the first outlet. You are the nearest presser above the nine-metre line. The nearest back is open for one second.',
      questionEn: 'How do you disrupt the outlet without fouling the keeper?',
      explanationEn:
        'Block the lane with arms high and legal positioning. Contact on the goalkeeper is a foul; retreating immediately is slower than a legal lane deny.',
      answers: answer(
        [
          'Take the outlet lane with arms high and no contact on the keeper',
          'Correct — lane denial delays the break without giving a foul.',
        ],
        [
          'Sprint back immediately and organise the first recovering bodies',
          'Good — gets you organised, but a legal lane deny is available first.',
        ],
        [
          'Jump sideways into the passing lane after the throw has left the hand',
          'Risky — late jumps miss the ball and take you out of recovery.',
        ],
        [
          'Push the goalkeeper throwing arm to prevent the release',
          'Poor — contact on the goalkeeper is a foul and a free restart.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      titleEn: 'Fast Break — Solo Breakaway vs Stepping Keeper',
      situationEn:
        'You intercept and break alone at {minute}\' ({score}). The goalkeeper advances to five metres. No teammate is level with you; one recoverer is still behind halfway.',
      questionEn: 'How do you finish before the advancing keeper recovers depth?',
      explanationEn:
        'Show the shot, wait for the commit, finish the abandoned corner. Early distance shots play into the step; stopping to wait for help kills the breakaway.',
      answers: answer(
        [
          'Show the shot, read the keeper commit, finish the open corner',
          'Correct — deception against an advancing keeper creates the open finish.',
        ],
        [
          'Take the ball closer under control and finish low past the stepped body',
          'Good — works if you keep speed; the fake-then-finish is cleaner against the step.',
        ],
        [
          'Release a power shot immediately from eleven metres',
          'Risky — early distance shots are exactly what stepping keepers want.',
        ],
        [
          'Stop at nine metres and wait for a trailing teammate',
          'Poor — stopping turns a breakaway into a recovered set defence.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Fast Break',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing', 'Centre Back'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Fast Break — Trailing Late Counter Finish',
      situationEn:
        'You trail by one with 40 seconds left at {score}. Your team steals and counters 2-on-1. The open wing has a playable angle; the defender shades the ball.',
      questionEn: 'Which finish priority converts the late counter?',
      explanationEn:
        'When trailing late, convert the numerical chance. Draw the keeper or hit the open wing. Holding to run clock or resetting into 6:0 wastes the steal.',
      answers: answer(
        [
          'Draw the keeper or release to the open wing for the highest-percentage finish',
          'Correct — trailing late means the counter must become a goal.',
        ],
        [
          'Attack the shaded defender with a hard drive if the wing lane closes',
          'Good — backup if the pass dies, but the open wing is still first.',
        ],
        [
          'Stop and rebuild a full positional attack against the recovering defence',
          'Risky — resetting gifts the defence the structure you just broke.',
        ],
        [
          'Hold the ball near nine metres to shorten the remaining clock',
          'Poor — trailing teams need the goal more than the clock.',
        ],
      ),
      variationSlots: { score },
    }),
  ];
}

export function getPowerPlayArchetypes() {
  return [
    defineArchetype({
      category: 'Power Play',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Beginner',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Power Play — First Two Passes',
      situationEn:
        'You earn 6-on-5 after an exclusion at {minute}\' ({score}). The short-handed defence is still rotating to their spots. Wings are wide; the pivot is sealed.',
      questionEn: 'What must happen in the first two passes of the power play?',
      explanationEn:
        'Move the ball to the open side and attack the temporary gap before the defence recovers a 6:0 shape. Holding for perfection returns them to even numbers.',
      answers: answer(
        [
          'Find the open side within two passes and attack the rotation gap',
          'Correct — early ball movement is the entire point of 6-on-5.',
        ],
        [
          'Look inside to the sealed pivot on the second pass if the middle opens',
          'Good — strong second action, provided the first pass already moved the defence.',
        ],
        [
          'Hold at the top until the perfect shot presents itself',
          'Risky — patience beyond the gap lets short-handed defence recover.',
        ],
        [
          'Swing the ball around the full perimeter four times before looking inside',
          'Poor — empty perimeter circulation wastes the numerical window.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Power Play',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing', 'Centre Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Power Play — Wing Overload Cut',
      situationEn:
        '6-on-5 at {minute}\' ({score}) with two attackers on the left against one defender. The outside wing has the ball; the inside player is ready to cut. The late rotator is one stride from recovering.',
      questionEn: 'How do you use the overload before the rotator arrives?',
      explanationEn:
        'Outside wing draws the defender; inside player cuts for the finish. Standing static or swinging away from the overload burns the temporary 2-on-1.',
      answers: answer(
        [
          'Outside wing draws the defender; inside attacker cuts for the finish',
          'Correct — the overload only exists until the late rotator recovers.',
        ],
        [
          'Outside wing finishes immediately if the defender refuses to step out',
          'Good — punish a frozen defender, but the cut is richer if they do step.',
        ],
        [
          'Both wing players hold width and wait for another full swing',
          'Risky — waiting invites the short-handed unit back into shape.',
        ],
        [
          'Dribble along the sideline to protect possession until the exclusion ends',
          'Poor — power play is for scoring pressure, not clock management alone.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Power Play',
      primaryPosition: 'All',
      secondaryPositions: ['Pivot', 'Centre Back', 'Left Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Power Play — Pivot Isolation Window',
      situationEn:
        '6-on-5 at {minute}\' ({score}). The rotating defender is late and smaller than your pivot. You have the ball at nine metres with a clean bounce lane into the seal.',
      questionEn: 'When is the pivot isolation the first option?',
      explanationEn:
        'Isolate immediately when the match-up favours the pivot and the lane is open. Waiting for a prettier perimeter look lets the rotator recover.',
      answers: answer(
        [
          'Feed the pivot immediately while the mismatch and lane are live',
          'Correct — quick isolation is the cleanest 6-on-5 finish here.',
        ],
        [
          'Force your own jump shot through the recovering middle if the lane closes',
          'Good — executable backup, but inferior to the live mismatch inside.',
        ],
        [
          'Hold one more perimeter pass to improve the shooting angle first',
          'Risky — one extra swing often returns the defence to even coverage.',
        ],
        [
          'Wave the pivot out to nine metres for a hand-off instead',
          'Poor — pulling the pivot high removes the six-metre threat in power play.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Power Play',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Power Play — Weak-Side Backdoor Skip',
      situationEn:
        '6-on-5 at {minute}\' ({score}). Defence over-shifts to your ball-side overload. The weak-side wing starts a backdoor cut behind the line as you catch at the top.',
      questionEn: 'Which pass punishes the over-shift first?',
      explanationEn:
        'The skip to the cutting weak-side wing beats the over-shift. Forcing into the crowded ball side or holding until recovery wastes the read.',
      answers: answer(
        [
          'Skip to the weak-side wing cutting backdoor behind the over-shift',
          'Correct — the skip is the direct punishment for the collapsed side.',
        ],
        [
          'Attack the seam created next to the over-shift with a quick drive',
          'Good — can score if the seam is huge, but the backdoor cutter is freer.',
        ],
        [
          'Force another pass into the already crowded ball-side overload',
          'Risky — forcing into coverage is how power-play turnovers start.',
        ],
        [
          'Hold at the top until the defence recovers and resets its shape',
          'Poor — waiting erases the backdoor the over-shift created.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Power Play',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Power Play — Clean Entry Shape',
      situationEn:
        'Referee restarts your 6-on-5 with a free throw at {minute}\' ({score}). Defence is still communicating assignments. Your wings are narrow; backs are clustered.',
      questionEn: 'How do you enter so the numerical advantage stays alive?',
      explanationEn:
        'Spread the wings, receive centrally, and make the first progressive pass within two seconds. Clustering or waiting for the defence to set wastes the restart.',
      answers: answer(
        [
          'Spread wings, receive centrally, first progressive pass within two seconds',
          'Correct — immediate spacing and tempo keep 6-on-5 alive on the restart.',
        ],
        [
          'Spread first, then attack the nearest soft gap even before a full swing',
          'Good — aggression is fine once width is established.',
        ],
        [
          'Cluster four players on one side to create a local overload right away',
          'Risky — early clusters are easy for five defenders to cover.',
        ],
        [
          'Wait for the short-handed defence to finish its assignments before moving',
          'Poor — their organisation is exactly what you should attack now.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Power Play',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back', 'Pivot'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Power Play — Defending the Rotation',
      situationEn:
        'You defend 5-on-6 at {minute}\' ({score}). Attack swings the ball quickly around the perimeter. Your unit must cover the missing body without fouling.',
      questionEn: 'What is the short-handed defensive priority on each swing?',
      explanationEn:
        'Rotate as a unit, stay between ball and goal, and force an outside shot. Static man-marks and early fouls turn one exclusion into multiple goals.',
      answers: answer(
        [
          'Rotate as a unit, stay goal-side of the ball, force an outside shot',
          'Correct — connected rotation is how five bodies survive six attackers.',
        ],
        [
          'Protect the pivot first and rotate the perimeter around that anchor',
          'Good — inside-first helps, if the perimeter still rotates with the ball.',
        ],
        [
          'Each defender locks a nearest attacker and refuses to leave them',
          'Risky — static marks are beaten by the extra free attacker.',
        ],
        [
          'Foul early on the first catch to reset into even numbers',
          'Poor — early fouls often extend or multiply the power-play chances.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Power Play',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      titleEn: 'Power Play — Leading With 15 Seconds Left',
      situationEn:
        'You lead by two in 6-on-5 at {minute}\' ({score}). Fifteen seconds remain on the exclusion. A clean wing angle is available now; a prettier centre look might appear later.',
      questionEn: 'How do you manage the final seconds of the power play while leading?',
      explanationEn:
        'Take the best available shot soon. Holding the full clock for perfection risks a turnover and an even-strength counter with the lead exposed.',
      answers: answer(
        [
          'Take the best available shot now rather than holding the full exclusion clock',
          'Correct — early conversion protects the lead better than perfect patience.',
        ],
        [
          'Use one more pass only if it clearly upgrades the wing look already available',
          'Good — one upgrade pass is fine; endless holding is not.',
        ],
        [
          'Hold possession until the exclusion expires to deny any counter risk',
          'Risky — turnovers on held power plays create the exact counter you fear.',
        ],
        [
          'Pass backwards repeatedly to burn clock without looking at the wing',
          'Poor — empty backwards passing invites pressure and strips.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Power Play',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Pivot', 'Left Wing', 'Right Wing'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Power Play — Trailing Final Exclusion',
      situationEn:
        'Final power play of the match at {minute}\'. You trail by one at {score}. Defence is packing the middle. Three clean passes can create a wing or pivot finish.',
      questionEn: 'What shot clock discipline do you use when trailing on the last power play?',
      explanationEn:
        'Shoot within three purposeful passes from the highest-percentage spot. Holding until the exclusion dies or manufacturing a dive foul wastes the last advantage.',
      answers: answer(
        [
          'Attack within three purposeful passes from the highest-percentage finish',
          'Correct — decisive power-play shooting is required when trailing late.',
        ],
        [
          'Settle for the first contested long-range shot to avoid a turnover on a pass',
          'Good — gets a shot up, but inferior to using the three-pass structure available.',
        ],
        [
          'Dive into a defender to manufacture a seven-metre under contact',
          'Risky — manufactured fouls are rarely given and burn the possession.',
        ],
        [
          'Hold for the perfect look until the exclusion clock reaches zero',
          'Poor — an expired power play with no shot is a wasted last chance.',
        ],
      ),
      variationSlots: { minute, score },
    }),
  ];
}

export function getShortHandedArchetypes() {
  return [
    defineArchetype({
      category: 'Short Handed',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Beginner',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Short Handed — Compact First Principle',
      situationEn:
        'Your teammate is excluded at {minute}\' ({score}). You must defend 5-on-6 for two minutes. Attack spreads early looking for the free player.',
      questionEn: 'What shape keeps 5-on-6 alive through the first swing?',
      explanationEn:
        'Stay compact, force outside shots, and avoid fouls. Aggressive steals and early fouls turn one exclusion into a multi-goal swing.',
      answers: answer(
        [
          'Stay compact, force outside shots, and refuse unnecessary fouls',
          'Correct — compactness plus discipline is the core 5-on-6 survival plan.',
        ],
        [
          'Protect the middle first and accept contested perimeter shots',
          'Good — inside-first works if the unit still shifts with the ball.',
        ],
        [
          'Press high for a steal to end the disadvantage early',
          'Risky — high presses with five bodies open easy inside finishes.',
        ],
        [
          'Abandon structure and chase nearest attackers in pure man-marks',
          'Poor — chaotic chasing is exactly how the free sixth attacker scores.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Short Handed',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back', 'Pivot'],
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Short Handed — Immediate Reorganisation',
      situationEn:
        'The referee shows two minutes at {minute}\' ({score}). Play will restart in seconds. Your unit is still standing in a six-player 6:0 shape with one body missing.',
      questionEn: 'What is the first reorganisation action before the restart?',
      explanationEn:
        'Shift immediately into a five-player shape, assign the missing zone, and communicate. Playing as if you still have six leaves a permanent hole.',
      answers: answer(
        [
          'Shift into a five-player shape, assign the missing zone, communicate now',
          'Correct — instant reorganisation prevents the first power-play goal.',
        ],
        [
          'Pull one wing tighter and keep a four-across-plus-one compact wall',
          'Good — a valid 5-on-6 shape if zones are assigned immediately.',
        ],
        [
          'Keep the old 6:0 spots and hope the attack does not find the gap',
          'Risky — five players cannot hold six spots without a planned shift.',
        ],
        [
          'Send two players toward the bench area to discuss the new system',
          'Poor — leaving the court before the restart creates an even worse mismatch.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Short Handed',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Short Handed — Wing Collapse Timing',
      situationEn:
        '5-on-6 at {minute}\' ({score}). Ball is opposite you. Your unit is compact centrally. The weak-side wing holds width waiting for a skip.',
      questionEn: 'When do you collapse from the wing without opening the skip?',
      explanationEn:
        'Hold width until the ball enters the six-metre danger zone, then collapse. Collapsing on the first opposite-side catch opens the skip you are there to prevent.',
      answers: answer(
        [
          'Hold width until the ball enters six metres, then collapse inside',
          'Correct — wide first denies the skip; late collapse protects the finish.',
        ],
        [
          'Shade one step inside while still seeing the weak-side wing',
          'Good — soft shade helps, but full early collapse still opens the skip.',
        ],
        [
          'Collapse as soon as the ball is caught on the opposite wing',
          'Risky — early collapse is the invitation for the skip pass.',
        ],
        [
          'Leave your wing entirely to double the centre back at the top',
          'Poor — abandoning the wing creates the exact free player 6-on-5 wants.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Short Handed',
      primaryPosition: 'All',
      secondaryPositions: ['Pivot', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Short Handed — Pivot Front in 5-on-6',
      situationEn:
        '5-on-6 at {minute}\' ({score}). Opposing pivot seals at six metres while an extra attacker loads outside. You are the pivot defender stuck half a step behind the seal.',
      questionEn: 'How do you defend the seal when you are already a body short?',
      explanationEn:
        'Front when possible. If behind, deny the pass with legal contact and call help — do not wrap, and do not abandon the pivot to chase the perimeter.',
      answers: answer(
        [
          'Front the seal if possible; if behind, deny the pass and call help',
          'Correct — fronting plus communication protects the six-metre understaffed.',
        ],
        [
          'Stay goal-side with a high deny hand and keep talking to the middles',
          'Good — solid if you cannot front, provided the deny hand is active.',
        ],
        [
          'Wrap the pivot tightly so they cannot show a target hand',
          'Risky — wrapping is a foul that can extend the power play.',
        ],
        [
          'Leave the pivot to double the extra perimeter attacker instead',
          'Poor — leaving the seal opens the easiest finish on the court.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Short Handed',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Short Handed — Ball-Side Rotation Rule',
      situationEn:
        '5-on-6 at {minute}\' ({score}). Ball moves quickly from left back to right back. Your farthest defender is still ball-watching on the old side.',
      questionEn: 'How should the five-player unit rotate on that swing?',
      explanationEn:
        'Rotate with the ball: farthest defender tucks, ball-side pressures, constant talk. Random movement or full collapse creates the free sixth attacker.',
      answers: answer(
        [
          'Rotate with the ball — farthest tucks in, ball-side pressures, talk constantly',
          'Correct — connected ball-side rotation is the only workable 5-on-6 method.',
        ],
        [
          'Keep the pivot covered and rotate the four perimeter bodies with the swing',
          'Good — inside anchor helps if the perimeter still moves together.',
        ],
        [
          'Everyone stays on their original mark regardless of the swing',
          'Risky — static marks cannot cover the extra free attacker.',
        ],
        [
          'All five defenders collapse to the new ball at once',
          'Poor — full collapse frees wings and the opposite back.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Short Handed',
      primaryPosition: 'Goalkeeper',
      secondaryPositions: [],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Defence',
      titleEn: 'Short Handed — Keeper Overload Calls',
      situationEn:
        '5-on-6 at {minute}\' ({score}). {opponent} overload the left side with an extra attacker. Your field defence is compact but quiet. A skip to the weak-side wing is one pass away.',
      questionEn: 'What is your first contribution before the shot comes?',
      explanationEn:
        'Call the overload and the skip threat early, hold aggressive angles, and be ready to outlet if you win the ball. Passive silence leaves five field players guessing.',
      answers: answer(
        [
          'Call the overload and skip threat early, hold angle, ready the outlet',
          'Correct — vocal organisation plus angle is the keeper 5-on-6 job.',
        ],
        [
          'Hold a higher starting angle toward the overloaded side while staying reactive',
          'Good — angle helps, but the early call is what organises the five field players.',
        ],
        [
          'Stay deep and silent so you can focus only on the eventual shot',
          'Risky — silence lets the overload settle before you ever see the release.',
        ],
        [
          'Leave the goal to press the extra attacker above nine metres',
          'Poor — an empty goal during 5-on-6 is an automatic gift.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),

    defineArchetype({
      category: 'Short Handed',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Wing', 'Right Wing'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      titleEn: 'Short Handed — Turnover Counter Decision',
      situationEn:
        'You steal the ball while still 5-on-6 at {minute}\' ({score}). Thirty seconds remain on the exclusion. Two opposing defenders are behind the play; your near wing is open.',
      questionEn: 'Do you counter now, and what triggers the yes?',
      explanationEn:
        'Counter when numbers are ahead of the recovering defence — quick outlet to the open wing. Holding for a full reset often wastes the only short-handed scoring window.',
      answers: answer(
        [
          'Counter now with a quick outlet while two defenders are still behind',
          'Correct — selective counters on short-handed steals punish disorganised recovery.',
        ],
        [
          'Advance under control and finish if the near wing stays open through halfway',
          'Good — controlled advance works, provided you do not stall into a reset.',
        ],
        [
          'Hold and walk into a set attack until all five teammates arrive',
          'Risky — waiting lets the defence recover and removes the numerical race.',
        ],
        [
          'Throw a hopeful long ball toward the covered far wing immediately',
          'Poor — covered long outlets turn a steal into a fresh power-play chance.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Short Handed',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Defence',
      matchPhase: 'Final Minutes',
      titleEn: 'Short Handed — Final Ten Seconds of the Kill',
      situationEn:
        '5-on-6 with ten seconds left on the exclusion at {minute}\' ({score}). Attack has one final swing. Your returning teammate is at the sideline ready to enter.',
      questionEn: 'How do you close the last ten seconds without extending the kill?',
      explanationEn:
        'No fouls, force a perimeter shot, and be ready to attack the instant the exclusion ends. Fouling or stopping to prepare the sub early can extend the disadvantage.',
      answers: answer(
        [
          'No fouls, force a perimeter shot, prepare the counter as the penalty expires',
          'Correct — discipline plus transition readiness ends the kill cleanly.',
        ],
        [
          'Stay compact and accept a contested nine rather than chasing a steal',
          'Good — safe close, if you are also ready for the immediate transition.',
        ],
        [
          'Foul the ball carrier to guarantee they cannot score before the return',
          'Risky — fouls can extend the power play or create a seven-metre.',
        ],
        [
          'Stop defending early and organise the substitution instead',
          'Poor — defend through the full exclusion; substitution follows the stoppage.',
        ],
      ),
      variationSlots: { minute, score },
    }),
  ];
}

export function getMatchEndingArchetypes() {
  return [
    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Beginner',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Trailing Final Attack Clock',
      situationEn:
        'Final 30 seconds, you trail by one at {score}. Your team has possession at nine metres against a set defence. A playable wing angle will open on the second pass.',
      questionEn: 'How do you use the final 30 seconds when you need a goal?',
      explanationEn:
        'Take the best available shot within about 15 seconds and leave a few seconds for a rebound or second action. Holding for the buzzer often destroys shot quality.',
      answers: answer(
        [
          'Take the best available shot within 15 seconds and keep a second-chance window',
          'Correct — structured urgency beats last-second chaos when trailing.',
        ],
        [
          'Use the second-pass wing look as soon as it opens, even with 20 seconds left',
          'Good — converting the clean look early is often better than waiting.',
        ],
        [
          'Hold until the final second every time to deny any counter',
          'Risky — buzzer chaos reduces shot quality more than it protects you.',
        ],
        [
          'Charge into a defender hoping to manufacture a seven-metre',
          'Poor — manufactured fouls are rarely awarded under late scrutiny.',
        ],
      ),
      variationSlots: { score },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'Critical',
      attackOrDefence: 'Defence',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Protect One-Goal Lead',
      situationEn:
        'Final 30 seconds, you lead by one at {score}. {opponent} have possession against your set defence. Their playmaker wants you to chase a steal.',
      questionEn: 'What defensive choices protect the lead for thirty seconds?',
      explanationEn:
        'No fouls, stay in system, force a low-percentage contested shot. Gambling for steals or intentional fouls is how one-goal leads disappear.',
      answers: answer(
        [
          'Stay in system, refuse fouls, force a contested low-percentage shot',
          'Correct — discipline over gambling is how narrow leads survive.',
        ],
        [
          'Shade the playmaker with high hands while the unit holds its shape',
          'Good — pressure without the full gamble that frees a wing.',
        ],
        [
          'Press for a steal so you can score an insurance goal',
          'Risky — late steal gambles create fouls and open finishing lanes.',
        ],
        [
          'Foul intentionally away from the ball to freeze the clock',
          'Poor — intentional late fouls often become seven-metres.',
        ],
      ),
      variationSlots: { score, opponent },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Advanced',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Tied Last Possession',
      situationEn:
        'Final possession of regulation at {minute}\', score tied at {score}. You receive at nine metres with a playable wing and a contested long-range lane. Defence is packed for the last shot.',
      questionEn: 'Which finish do you prioritise on the last tied possession?',
      explanationEn:
        'Hunt the highest-percentage shot inside the system. Settling for a contested long heave or running into a manufactured foul wastes the tie-game chance.',
      answers: answer(
        [
          'Hunt the highest-percentage system shot — wing or clean nine — before the buzzer',
          'Correct — best available shot wins or sends the game to overtime.',
        ],
        [
          'Attack the packed middle only if a clear foul or short finish appears',
          'Good — selective aggression works if the high-percentage wing dies.',
        ],
        [
          'Hold exclusively for a final-second heave regardless of earlier open looks',
          'Risky — last-second only habits turn good looks into panic releases.',
        ],
        [
          'Force contact diving into a set defender to chase a seven-metre',
          'Poor — late manufactured fouls are rarely given and often turn the ball over.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Timeout Before Final Set',
      situationEn:
        'Final two minutes, you trail by two at {score}. You have one timeout left. Your team just earned a restart with enough time for one organised attack.',
      questionEn: 'When do you spend the last timeout?',
      explanationEn:
        'Call it before the organised final possession so you can set roles and spacing. Calling after a chaotic turnover or with five seconds left wastes the tool.',
      answers: answer(
        [
          'Call before the organised final possession to set roles and spacing',
          'Correct — the timeout value is structure before the decisive attack.',
        ],
        [
          'Keep playing without a timeout while the attack already has clear structure',
          'Good — valid if the set is already organised, but trailing by two often needs a reset.',
        ],
        [
          'Save it until after the next turnover so you can regroup under chaos',
          'Risky — post-turnover timeouts often arrive too late to create a clean set.',
        ],
        [
          'Call with five seconds left so the defence cannot set',
          'Poor — five seconds is not enough time to run a structured equaliser.',
        ],
      ),
      variationSlots: { score },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'Critical',
      attackOrDefence: 'Defence',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Trailing Foul on the Clock',
      situationEn:
        'Final 18 seconds, you trail by two at {score}. {opponent} have possession and are running the clock above nine metres. Their shooter is not yet loaded.',
      questionEn: 'If you foul to stop the clock, who do you foul and why?',
      explanationEn:
        'Foul the non-shooter to stop the clock without giving a seven-metre. Fouling the loaded shooter or fouling multiple players creates worse outcomes.',
      answers: answer(
        [
          'Foul the non-shooter cleanly to stop the clock without a seven-metre',
          'Correct — tactical foul on the non-shooter buys the restart you need.',
        ],
        [
          'Stay passive and hunt a natural strip if the ball handler is careless',
          'Good — valid if a steal is live, but here they are successfully running clock.',
        ],
        [
          'Foul the loaded shooter to prevent any possible release',
          'Risky — fouling the shooter is how late seven-metres appear.',
        ],
        [
          'Foul two different players in sequence to freeze the clock faster',
          'Poor — multiple late fouls risk suspensions and free throws in rhythm.',
        ],
      ),
      variationSlots: { score, opponent },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'All',
      secondaryPositions: ['Pivot', 'Centre Back'],
      difficulty: 'Advanced',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Pivot Catch While Trailing',
      situationEn:
        'Final minute, you trail by one at {score}. Pivot receives at six metres while the defence collapses from the perimeter. Help will arrive in under a second.',
      questionEn: 'What must the pivot do with that catch?',
      explanationEn:
        'Finish or draw the foul immediately. Holding for a perfect perimeter reverse lets the double arrive and kills the trail-by-one possession.',
      answers: answer(
        [
          'Finish or draw the foul within one second of securing the catch',
          'Correct — immediate action is the only way the six-metre catch stays valuable.',
        ],
        [
          'One short fake, then near-post finish before the second defender lands',
          'Good — works if contact stays light and the fake is tiny.',
        ],
        [
          'Hold through the collapsing help waiting for a kick-out to open',
          'Risky — holding into the double is the classic late-game strip.',
        ],
        [
          'Pass back immediately for a full perimeter reset',
          'Poor — resetting from a live six-metre catch wastes precious seconds.',
        ],
      ),
      variationSlots: { score },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'Goalkeeper',
      secondaryPositions: [],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Defence',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Level-Game Shot Read',
      situationEn:
        'Final minute, score level at {score}. {opponent}\'s best scorer catches at nine metres with a clear lane. Crowd noise spikes as they jump.',
      questionEn: 'What do you prioritise before leaving your feet?',
      explanationEn:
        'Run your full pre-shot routine and read the release. Early corner guesses and intimidation steps open the opposite finish under late pressure.',
      answers: answer(
        [
          'Complete your pre-shot routine and read the release before committing',
          'Correct — routine plus delayed read wins more late shots than guessing.',
        ],
        [
          'Hold a slight shade to their season tendency, then react to the release',
          'Good — tendency shade helps if you still delay the dive.',
        ],
        [
          'Dive early toward their strong-side corner based on the season pattern',
          'Risky — early dives gift the open side to an adjusting shooter.',
        ],
        [
          'Watch the scoreboard and crowd to feel the moment before setting',
          'Poor — external focus delays the only information that matters: the release.',
        ],
      ),
      variationSlots: { score, opponent },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'Goalkeeper',
      secondaryPositions: [],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Empty-Goal Last Push',
      situationEn:
        'Final 12 seconds, you trail by one at {score}. Your team has secure possession in attack. You are at halfway after the outlet and can arrive as an extra field player.',
      questionEn: 'When is joining the last attack worth the empty-goal risk?',
      explanationEn:
        'Join only with secure possession and a clear arrival as an extra body. Sprinting up on loose balls or hanging near nine metres helps neither end.',
      answers: answer(
        [
          'Join only while possession is secure and you can arrive as a true extra body',
          'Correct — conditional empty-goal support is the controlled late risk.',
        ],
        [
          'Stay in the goal area for the entire final possession',
          'Good — safest choice, but here a secure extra body is available.',
        ],
        [
          'Sprint into the attack on every late possession regardless of security',
          'Risky — loose balls into an empty goal end the match instantly.',
        ],
        [
          'Hover near the opponent nine-metre line without entering the play',
          'Poor — that positioning helps neither the attack nor the empty-goal defence.',
        ],
      ),
      variationSlots: { score },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      matchPhase: 'Halftime',
      titleEn: 'Match Ending — Last Shot Before Halftime',
      situationEn:
        'Final 15 seconds of the first half at {minute}\' ({score}). Your team has possession against a recovering defence. A clean wing look is available; a forced long shot is also there.',
      questionEn: 'What is the right risk level before the break?',
      explanationEn:
        'Take a good shot within about 10 seconds if it is clean. If nothing opens, protect the ball — a turnover into a counter before halftime is the worst outcome.',
      answers: answer(
        [
          'Take a clean shot within 10 seconds; otherwise protect the ball to the break',
          'Correct — calculated risk before halftime, not chaos or pure passivity.',
        ],
        [
          'Use the open wing immediately even with 12 seconds still on the clock',
          'Good — converting the clean look early is usually right.',
        ],
        [
          'Force any release immediately regardless of quality before the buzzer',
          'Risky — rushed low-percentage shots often become easy counters the other way.',
        ],
        [
          'Throw a hopeful cross-court pass into traffic to create a miracle finish',
          'Poor — low-percentage miracle passes are how halftime leads disappear.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Match Ending',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      matchPhase: 'Final Minutes',
      titleEn: 'Match Ending — Overtime Opening Possession',
      situationEn:
        'Regulation ends tied at {score}. Overtime tip is yours. {opponent} look rushed to score first. Your wings are set; their best defender is mismatched on your left back.',
      questionEn: 'How do you open overtime without handing them the first goal?',
      explanationEn:
        'Stay structured and attack the best match-up. The first overtime goal often decides the match — panic heaves and empty holding both fail.',
      answers: answer(
        [
          'Run a calm structured first possession into the best available match-up',
          'Correct — overtime openings are won by clarity, not by rushing the first shot.',
        ],
        [
          'Attack the mismatched left back early inside a structured set',
          'Good — that is the right match-up, provided the set stays organised.',
        ],
        [
          'Heave the first clean catch from distance to score first at any cost',
          'Risky — rushed first shots are the most common overtime gift.',
        ],
        [
          'Hold the ball near halfway indefinitely to settle nerves',
          'Poor — empty holding lets the defence organise and invites a press.',
        ],
      ),
      variationSlots: { score, opponent },
    }),
  ];
}

export function getDecisionMakingArchetypes() {
  return [
    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Beginner',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Decision Making — Shoot or Feed the Open Pivot',
      situationEn:
        'You catch at nine metres at {minute}\' ({score}) against a {defensiveSystem}. Your shooting lane is half-blocked. The pivot has sealed a clear bounce lane on the strong side.',
      questionEn: 'Which option do you take first with a blocked lane and an open seal?',
      explanationEn:
        'Feed the open pivot when your own lane is contested. Forcing the blocked shot wastes the better finish already created inside.',
      answers: answer(
        [
          'Feed the sealed pivot first while the bounce lane is still open',
          'Correct — the open six-metre finish outranks a half-blocked nine.',
        ],
        [
          'Hold one extra fake hoping the block dissolves into a clean lane',
          'Good — can work, but the pivot lane is already the cleaner read.',
        ],
        [
          'Force the jump shot through the half-block before help recovers',
          'Risky — contested nines are weaker than a live pivot seal.',
        ],
        [
          'Pass to a covered wing instead of using the sealed pivot',
          'Poor — skipping the open seal for a covered wing invites the intercept.',
        ],
      ),
      variationSlots: { minute, score, defensiveSystem },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Decision Making — Switch or Stay on the Cross',
      situationEn:
        'Opponents run a crossing action at {minute}\' ({score}). Your mark screens across your path. The crossing attacker is a clear speed mismatch if you stay; your teammate is already calling "switch".',
      questionEn: 'When do you switch marks instead of fighting through the cross?',
      explanationEn:
        'Switch when the cross creates a clear mismatch or your path is blocked and the call is early. Staying into a lost hip race gifts the shot; switching on every soft cross creates gaps.',
      answers: answer(
        [
          'Switch on the early call when the cross creates a clear mismatch',
          'Correct — early vocal switches prevent free shots after lost races.',
        ],
        [
          'Fight through if you still have hip position and the call is late',
          'Good — staying is right when you are not beaten and communication is unclear.',
        ],
        [
          'Switch automatically on every cross even when you still have hip position',
          'Risky — unnecessary switches create coverage gaps on soft actions.',
        ],
        [
          'Stop moving and wait to see who ends up nearest the ball',
          'Poor — hesitation during crosses is how both defenders end on one player.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Intermediate',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Decision Making — Tempo When Leading Late',
      situationEn:
        'You lead by one at {minute}\' ({score}). Defence is unsettled after a turnover. Teammates want a sprint finish; you also have a safe set attack available if the numbers are even.',
      questionEn: 'When do you keep sprinting, and when do you slow the tempo?',
      explanationEn:
        'Sprint only on a clear numerical advantage. If numbers are even, controlled tempo protects the lead better than a forced transition shot.',
      answers: answer(
        [
          'Sprint only on a clear numerical advantage; otherwise control tempo into a set attack',
          'Correct — lead protection means selecting which transitions are worth the risk.',
        ],
        [
          'Take the break if you already have a 2-on-1; otherwise rebuild structure',
          'Good — concrete version of the same principle.',
        ],
        [
          'Attack every unsettled defence at full speed while leading',
          'Risky — forced transition shots while leading create the turnovers that erase leads.',
        ],
        [
          'Walk every possession for the rest of the match regardless of open breaks',
          'Poor — refusing clear numerical chances invites pressure and stalled attacks.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'All',
      secondaryPositions: ['Left Wing', 'Right Wing'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Decision Making — Wing Finish Under Two Cues',
      situationEn:
        'You catch on the wing at {minute}\' ({score}) with a moderate angle. The goalkeeper has stepped out early. Your defender is one stride from contact. The near back is open but trailing.',
      questionEn: 'Which cue do you honour first before releasing?',
      explanationEn:
        'An early keeper step opens the lob; close defensive contact demands a quick release. Combine both: lob or skim now, rather than waiting for a trailing reset.',
      answers: answer(
        [
          'Punish the early keeper step immediately with a lob or low skim before contact',
          'Correct — both cues point to a quick punish, not a reset.',
        ],
        [
          'Pass back to the trailing near back despite the advanced keeper',
          'Good — safe, but slower than the lob window the keeper already gifted.',
        ],
        [
          'Power into the near post against an already advanced keeper body line',
          'Risky — stepped keepers cover near post with their body.',
        ],
        [
          'Retreat outside the nine-metre line to restart a full positional attack',
          'Poor — retreating throws away the keeper commitment you already forced.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'All',
      secondaryPositions: ['Pivot'],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Attack',
      titleEn: 'Decision Making — Hold Contact or Release',
      situationEn:
        'You receive at six metres with heavy but legal back contact at {minute}\' ({score}). You can still pivot to the near post. A second defender is one stride from doubling.',
      questionEn: 'Do you hold through the contact or release immediately — and what tells you?',
      explanationEn:
        'Hold if the contact is manageable and the finishing window is still there. Release or pass the moment the double arrives. Waiting for a whistle usually loses the ball.',
      answers: answer(
        [
          'Hold through manageable contact to finish; release the instant the double arrives',
          'Correct — contact quality plus help timing decide hold versus release.',
        ],
        [
          'Release on the first touch of contact even when the near-post window is open',
          'Good — safe, but you can still finish if the first contact is manageable.',
        ],
        [
          'Hold indefinitely hoping the referee will bail out the contact',
          'Risky — holding into a double while waiting for a whistle is a classic strip.',
        ],
        [
          'Let the ball go free and appeal for a foul instead of playing through contact',
          'Poor — giving possession away is worse than playing through legal contact.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back', 'Left Wing', 'Right Wing'],
      difficulty: 'Advanced',
      pressureLevel: 'Moderate',
      attackOrDefence: 'Attack',
      titleEn: 'Decision Making — Pre-Catch Priority Order',
      situationEn:
        'Before you receive at {minute}\' ({score}) against a {defensiveSystem}, you see three cues: pivot sealed and open, weak-side wing covered, your defender shifting late toward the ball.',
      questionEn: 'In what order do you lock the decision before the catch?',
      explanationEn:
        'Priority: the shifting defender (immediate threat), then the open pivot (best option), then a covered wing as backup only. Deciding after the catch is usually too late.',
      answers: answer(
        [
          'Lock defender shift first, open pivot second, covered wing only as backup — before the catch',
          'Correct — pre-catch priority order turns scanning into a decision.',
        ],
        [
          'Pre-decide the pivot feed if the defender shift creates a clear lane',
          'Good — simplifies correctly toward the best option, with less backup planning.',
        ],
        [
          'Catch first, then process all three cues with equal weight',
          'Risky — deciding after the catch often arrives one pass too late.',
        ],
        [
          'Pre-commit only to the covered wing because width feels safest',
          'Poor — skipping an open pivot for a covered wing skips the best finish.',
        ],
      ),
      variationSlots: { minute, score, defensiveSystem },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'Goalkeeper',
      secondaryPositions: [],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Decision Making — Pattern Shade vs Live Release',
      situationEn:
        'The left wing has scored twice this half — near post, then lob. At {minute}\' ({score}) they receive again with a similar angle. Your defender is late.',
      questionEn: 'How do you use the pattern without pre-committing the save?',
      explanationEn:
        'Shade preparation from the pattern, then read the actual release. Full pre-commitment to the last finish is how the third different finish scores.',
      answers: answer(
        [
          'Shade from the pattern, then delay and read the live release before leaving your feet',
          'Correct — patterns inform weight; the release makes the save.',
        ],
        [
          'Play centred with no shade and react only to the release',
          'Good — pure reaction works, but useful tendency data is available here.',
        ],
        [
          'Dive immediately to the near post because that was finish number one',
          'Risky — full pre-commitment is beaten by the adjusted third finish.',
        ],
        [
          'Move before they catch so they see a smaller goal early',
          'Poor — early movement gives the wing time to choose the abandoned side.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'Goalkeeper',
      secondaryPositions: [],
      difficulty: 'Advanced',
      pressureLevel: 'High',
      attackOrDefence: 'Defence',
      titleEn: 'Decision Making — Patience on a Late Close-Out',
      situationEn:
        'Opponent right back catches at nine metres at {minute}\' ({score}). Your field defender is a half-step late. The shooter has space for one fake before release.',
      questionEn: 'What do you wait for before committing your dive?',
      explanationEn:
        'Stay balanced and read the arm or shoulder before leaving your feet. Early dives and early steps remove the adjustment you need against a free shooter.',
      answers: answer(
        [
          'Stay balanced and read the shooting arm before leaving your feet',
          'Correct — delayed commitment preserves the reaction against a free release.',
        ],
        [
          'Hold depth and take away the lob until the release declares a corner',
          'Good — lob control helps, provided you still read the eventual release.',
        ],
        [
          'Dive immediately to the strong-side corner to shorten the decision',
          'Risky — early dives remove your ability to adjust to the fake.',
        ],
        [
          'Abandon the shooter and shade fully toward the sealed pivot instead',
          'Poor — with a clear nine-metre lane the shooter is the first threat.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'All',
      secondaryPositions: ['Centre Back', 'Left Back', 'Right Back'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Attack',
      titleEn: 'Decision Making — Passive Warning Under Lead',
      situationEn:
        'Referee has raised the passive-play warning at {minute}\'. You lead by one at {score}. Defence packs the middle and dares a forced nine. Your pivot has a soft seal forming.',
      questionEn: 'What attack do you take under passive warning while protecting a lead?',
      explanationEn:
        'Attack a real finish quickly — preferably the forming pivot seal or a clean wing — rather than empty swings that expire into a free throw or a forced heave.',
      answers: answer(
        [
          'Attack the forming pivot seal or a clean wing before the warning expires',
          'Correct — under passive warning you need a real finish, not empty circulation.',
        ],
        [
          'Force an immediate contested nine to avoid any turnover risk on a pass',
          'Good — gets a shot up, but inferior to the soft seal already forming.',
        ],
        [
          'Keep swinging the perimeter until a perfect centre look appears',
          'Risky — empty swings under warning often expire into a lost possession.',
        ],
        [
          'Hold near halfway to protect the lead until the warning somehow disappears',
          'Poor — holding under passive warning is how possessions are taken away.',
        ],
      ),
      variationSlots: { minute, score },
    }),

    defineArchetype({
      category: 'Decision Making',
      primaryPosition: 'All',
      secondaryPositions: ['Left Back', 'Right Back', 'Centre Back'],
      difficulty: 'Expert',
      pressureLevel: 'Critical',
      attackOrDefence: 'Defence',
      titleEn: 'Decision Making — Double the Scorer or Stay Home',
      situationEn:
        '{opponent}\'s top scorer catches at nine metres at {minute}\' ({score}). Coach signals a possible double. The scorer is also their main passer; weak-side wing is one skip away.',
      questionEn: 'When is doubling that scorer actually the right first action?',
      explanationEn:
        'Double only if they are a non-passer or you need a steal trailing late. Doubling a playmaker with a live weak-side wing creates the open finish you are trying to prevent.',
      answers: answer(
        [
          'Double only if they are a non-passer or you trail late needing a steal; otherwise stay home',
          'Correct — selective doubling avoids turning a playmaker catch into 4-on-5.',
        ],
        [
          'Stay in system and refuse all doubles regardless of game state',
          'Good — safest default, though a late trailing steal chance can justify one gamble.',
        ],
        [
          'Double every catch by the top scorer to take away their rhythm',
          'Risky — good scorers who pass will find the vacated wing every time.',
        ],
        [
          'Send a third defender to the ball so the scorer has no pass angle',
          'Poor — triple-teams guarantee an open finisher elsewhere.',
        ],
      ),
      variationSlots: { opponent, minute, score },
    }),
  ];
}
