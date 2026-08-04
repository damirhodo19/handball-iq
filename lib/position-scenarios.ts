// ── Position-Aware Match Scenarios ────────────────────────────────────────────
// Provides 15-situation matches for every position.
// First half: 7 situations (minutes 1–29), Second half: 8 situations (minutes 31–59).

import { HandballPosition } from '@/lib/positions';
import { MatchDecision, MatchSituation } from '@/lib/match-engine';
import { loadPublishedScenariosForPosition, loadPublishedScenariosForPositionAsync, AdminScenario } from '@/lib/admin-storage';

interface ScenarioTemplate {
  type: string;
  description: string;
  pressure: 'Low' | 'Moderate' | 'High' | 'Critical';
  attackOrDefence: 'Attack' | 'Defence';
  decisions: MatchDecision[];
}

const FORMATIONS = [
  '3-2-1 attacking formation',
  '2-4 attacking with line player',
  '7 vs 6 empty-court attack',
  'Standard 6-0 defence',
  '5-1 aggressive defence',
  '3-2-1 defence shifting',
];

// ── Goalkeeper Scenarios ────────────────────────────────────────────────────────

const GK_SCENARIOS: ScenarioTemplate[] = [
  {
    type: 'Wing Shot',
    description: 'The left wing receives a quick pass on the edge. They have a narrow angle but are one-on-one with you. The shot could go short or cross-court.',
    pressure: 'Moderate',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Stay centred, react to the shooter\'s shoulder', quality: 'optimal', feedback: 'Correct — at a narrow angle, staying centred gives you the best chance to react.' },
      { id: 'b', text: 'Step forward to cut the angle', quality: 'good', feedback: 'Reasonable — stepping out narrows the angle but commits you early.' },
      { id: 'c', text: 'Shift toward the short corner', quality: 'risky', feedback: 'Risky — anticipating the short corner opens the cross-court shot.' },
      { id: 'd', text: 'Drop deep on the goal line', quality: 'poor', feedback: 'Poor — dropping deep gives the wing too much goal to aim at.' },
    ],
  },
  {
    type: 'Fast Break',
    description: 'The opposition wins the ball and launches a 2-on-1 fast break. The left back has the ball and your lone defender is trailing. A pass to the right wing is open.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Hold position, watch the ball carrier\'s eyes', quality: 'optimal', feedback: 'Correct — reading the passer\'s eyes lets you react to the pass.' },
      { id: 'b', text: 'Commit to the ball carrier', quality: 'risky', feedback: 'Risky — committing to the carrier opens an easy pass to the wing.' },
      { id: 'c', text: 'Position between both attackers', quality: 'good', feedback: 'Good — splitting the difference delays the decision but may not fully cover either.' },
      { id: 'd', text: 'Retreat to the goal line', quality: 'poor', feedback: 'Poor — retreating gives both attackers a clear shooting lane.' },
    ],
  },
  {
    type: '7m Throw',
    description: 'A 7m throw is awarded. The shooter is their top scorer, right-handed, and tends to go high-left. The arena goes quiet.',
    pressure: 'Critical',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Move slightly right, delay your dive', quality: 'optimal', feedback: 'Correct — shading their tendency while delaying gives you a read.' },
      { id: 'b', text: 'Dive hard to the left side', quality: 'risky', feedback: 'Risky — committing to the tendency early lets the shooter adjust.' },
      { id: 'c', text: 'Stay centred and react', quality: 'good', feedback: 'Good — staying centred is safe but gives up the corners.' },
      { id: 'd', text: 'Step off the line to distract', quality: 'poor', feedback: 'Poor — stepping off the line gives the shooter an open goal.' },
    ],
  },
  {
    type: 'Pivot Shot',
    description: 'The pivot receives the ball at the 6m line with their back to goal. They spin and prepare to shoot. Your defender is behind them.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Close the gap, block the low zone', quality: 'optimal', feedback: 'Correct — pivots often shoot low on the spin; closing the gap cuts off the angle.' },
      { id: 'b', text: 'Stay on the line and react', quality: 'good', feedback: 'Good — reacting is safe but the pivot has little time to read.' },
      { id: 'c', text: 'Anticipate the cross-court finish', quality: 'risky', feedback: 'Risky — guessing the direction before the spin is complete can leave you flat-footed.' },
      { id: 'd', text: 'Call your defender to block', quality: 'poor', feedback: 'Poor — the defender is behind the pivot and cannot get a block in time.' },
    ],
  },
  {
    type: 'Backcourt Jump Shot',
    description: 'The right back receives the ball at 9m and launches a jump shot. They have a clear lane and tend to shoot to the far corner.',
    pressure: 'Moderate',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Shift slightly to the far post, watch the release', quality: 'optimal', feedback: 'Correct — shading the tendency while tracking the release gives you the best read.' },
      { id: 'b', text: 'Hold centre and react to the ball', quality: 'good', feedback: 'Good — pure reaction is reliable but may be too slow against a powerful jump shot.' },
      { id: 'c', text: 'Step out to narrow the angle', quality: 'risky', feedback: 'Risky — stepping out against a jump shot opens the lob or the near post.' },
      { id: 'd', text: 'Guess the far corner early', quality: 'poor', feedback: 'Poor — guessing early lets the shooter adjust to the open side.' },
    ],
  },
  {
    type: '7 vs 6 Attack',
    description: 'The opposition plays 7 vs 6 with an empty court. The extra player creates an overload on the left side. The ball moves quickly around the perimeter.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Track the ball, communicate the overload', quality: 'optimal', feedback: 'Correct — tracking the ball while calling out the overload keeps your defence organised.' },
      { id: 'b', text: 'Shift to cover the overload side', quality: 'good', feedback: 'Good — covering the overload is logical but can open the weak side for a skip pass.' },
      { id: 'c', text: 'Stay centred and wait', quality: 'risky', feedback: 'Risky — waiting against an overload gives the attack time to find the gap.' },
      { id: 'd', text: 'Abandon the goal to press', quality: 'poor', feedback: 'Poor — leaving the goal open against a 7 vs 6 is an easy goal.' },
    ],
  },
  {
    type: 'Last Attack Before Halftime',
    description: '30 seconds remain in the first half. The score is level. The opposition holds for a final shot. The back court moves the ball patiently.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Stay patient, read the shooter\'s body', quality: 'optimal', feedback: 'Correct — patience lets you read the final shot rather than committing early.' },
      { id: 'b', text: 'Anticipate a quick release', quality: 'risky', feedback: 'Risky — they are holding for the last shot; anticipating a quick release misreads the situation.' },
      { id: 'c', text: 'Step out to pressure the ball', quality: 'good', feedback: 'Good — pressuring can rush the shot but opens the goal if they drive past you.' },
      { id: 'd', text: 'Drop deep and wait', quality: 'poor', feedback: 'Poor — dropping deep gives the shooter the entire upper goal.' },
    ],
  },
  {
    type: 'Final Minute Under Pressure',
    description: '59:30 on the clock. Your team leads by one. The opposition needs a goal. They set up a 7 vs 6 attack, desperate to score.',
    pressure: 'Critical',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Hold position, communicate with defence', quality: 'optimal', feedback: 'Correct — in the final minute, holding position and organising your defence is the safest path.' },
      { id: 'b', text: 'Step out to intercept the extra player', quality: 'risky', feedback: 'Risky — stepping out against a 7 vs 6 opens the goal for a quick pass and finish.' },
      { id: 'c', text: 'Stay on the line and react', quality: 'good', feedback: 'Good — reacting is safe but the overload may find a gap before you can respond.' },
      { id: 'd', text: 'Rush the ball carrier', quality: 'poor', feedback: 'Poor — rushing out leaves an empty goal in the most critical moment.' },
    ],
  },
  {
    type: 'Crossing Movement',
    description: 'The left back and centre back cross near the 9m line. The ball could go to either player. The crossing creates confusion in the defence.',
    pressure: 'Moderate',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Track the ball through the crossing', quality: 'optimal', feedback: 'Correct — following the ball through the crossing lets you stay aligned with the shooter.' },
      { id: 'b', text: 'Follow the initial ball carrier', quality: 'risky', feedback: 'Risky — following the initial carrier loses track of the receiver after the crossing.' },
      { id: 'c', text: 'Hold centre and wait for the shot', quality: 'good', feedback: 'Good — holding centre is safe but may give the shooter a clean angle.' },
      { id: 'd', text: 'Shift to the crossing side early', quality: 'poor', feedback: 'Poor — committing to one side before the crossing completes opens the other.' },
    ],
  },
  {
    type: 'Breakaway',
    description: 'A long pass sends the right wing alone toward your goal. Your defenders are 10m behind. It is a pure 1-on-1 with the wing approaching at speed.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Advance slightly, then set and react', quality: 'optimal', feedback: 'Correct — a small advance narrows the angle, then setting lets you read the shot.' },
      { id: 'b', text: 'Charge out to meet the wing', quality: 'risky', feedback: 'Risky — charging out at speed gives the wing an easy lob or sidestep.' },
      { id: 'c', text: 'Stay on the line and wait', quality: 'good', feedback: 'Good — waiting is safe but gives the wing the full goal to aim at.' },
      { id: 'd', text: 'Guess the near post early', quality: 'poor', feedback: 'Poor — guessing the near post opens the far corner against a fast approach.' },
    ],
  },
  {
    type: 'Counter-Attack Read',
    description: 'Your team loses the ball in attack. The opposition transitions instantly. The centre back drives forward with two options left and right.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Retrace quickly, watch the ball handler', quality: 'optimal', feedback: 'Correct — quick retraction while watching the ball lets you adjust to the final pass.' },
      { id: 'b', text: 'Sprint to the goal and set', quality: 'good', feedback: 'Good — getting set early is safe but may not account for the developing options.' },
      { id: 'c', text: 'Guess the right side pass', quality: 'risky', feedback: 'Risky — guessing the side before the pass is made opens the other option.' },
      { id: 'd', text: 'Slow jog back', quality: 'poor', feedback: 'Poor — jogging back in transition gives the attack a numerical advantage.' },
    ],
  },
  {
    type: 'Set Play',
    description: 'The opposition runs a rehearsed set play from a free throw. The pivot screens your defender while the left back cuts to the centre.',
    pressure: 'Moderate',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Read around the screen, track the cutter', quality: 'optimal', feedback: 'Correct — reading around the screen keeps you aligned with the real threat.' },
      { id: 'b', text: 'Follow the pivot', quality: 'risky', feedback: 'Risky — following the pivot loses track of the cutting back, who is the real threat.' },
      { id: 'c', text: 'Hold position and react late', quality: 'good', feedback: 'Good — holding is safe but the screen may delay your reaction.' },
      { id: 'd', text: 'Call timeout', quality: 'poor', feedback: 'Poor — you cannot call a timeout during the opposition\'s set play.' },
    ],
  },
];

// ── Centre Back Scenarios ───────────────────────────────────────────────────────

const CB_SCENARIOS: ScenarioTemplate[] = [
  {
    type: 'Reading 6:0',
    description: 'The opposition sets up a flat 6:0 defence. Your back players are marked man-to-man on the 9m line. You receive the ball at the top of the circle.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Probe the gap between the two middle defenders, look for the pivot', quality: 'optimal', feedback: 'Correct — a 6:0 has gaps between defenders. Probing forces a reaction and opens space.' },
      { id: 'b', text: 'Shoot immediately from 10m', quality: 'risky', feedback: 'Risky — a flat 6:0 blocks the shooting lane. Shooting early wastes the possession.' },
      { id: 'c', text: 'Pass to the wing without probing', quality: 'good', feedback: 'Good — the wing may have space, but you have not tested the central gap first.' },
      { id: 'd', text: 'Hold the ball and wait for movement', quality: 'poor', feedback: 'Poor — holding allows the defence to settle and close all gaps.' },
    ],
  },
  {
    type: 'Reading 5:1',
    description: 'The opposition plays an aggressive 5:1 defence with a forward defender marking you closely. You receive the ball and the forward defender steps out to press.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Pass quickly to the player left free by the pressing defender', quality: 'optimal', feedback: 'Correct — the 5:1 leaves a player free. Quick passing exploits the space before the defence recovers.' },
      { id: 'b', text: 'Try to beat the pressing defender one-on-one', quality: 'risky', feedback: 'Risky — the pressing defender is close and ready. Beating them one-on-one is low probability.' },
      { id: 'c', text: 'Retreat and reset the attack', quality: 'good', feedback: 'Good — resetting is safe but surrenders the advantage created by the press.' },
      { id: 'd', text: 'Shoot from 10m under pressure', quality: 'poor', feedback: 'Poor — shooting under close pressure from the forward defender is low quality.' },
    ],
  },
  {
    type: 'Playing With Pivot',
    description: 'Your pivot has positioned themselves between the two middle defenders. The pass to the pivot is available but the defence is shifting to cover.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Pass to the pivot before the defence fully shifts', quality: 'optimal', feedback: 'Correct — timing the pass before the shift completes gives the pivot the best chance to finish.' },
      { id: 'b', text: 'Hold the ball and wait for a better angle', quality: 'good', feedback: 'Good — waiting is safe but the defence will close the gap.' },
      { id: 'c', text: 'Shoot from 9m instead', quality: 'risky', feedback: 'Risky — the pivot has a better scoring position. Shooting from distance wastes the setup.' },
      { id: 'd', text: 'Pass to the wing', quality: 'poor', feedback: 'Poor — the wing is not the better option here. The pivot is free and in scoring position.' },
    ],
  },
  {
    type: 'Controlling Tempo',
    description: 'Your team has scored three quick goals. The opposition is on the back foot and disorganised. You have the ball at the top of the circle.',
    pressure: 'Low',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Accelerate the attack — exploit the disorganisation with a quick pass to the pivot', quality: 'optimal', feedback: 'Correct — when the opposition is disorganised, accelerating catches them before they recover.' },
      { id: 'b', text: 'Slow down and reset the play', quality: 'risky', feedback: 'Risky — slowing down gives the opposition time to reorganise their defence.' },
      { id: 'c', text: 'Shoot from distance while they are disorganised', quality: 'good', feedback: 'Good — shooting is an option, but a structured attack has a higher probability.' },
      { id: 'd', text: 'Pass sideways and hold possession', quality: 'poor', feedback: 'Poor — sideways passing wastes the momentum and lets the defence settle.' },
    ],
  },
  {
    type: 'Player Advantage',
    description: 'A defender is sent off for two minutes. Your team has a 7-on-6 numerical advantage. The defence is stretched and gaps are opening.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Move the ball quickly around the perimeter to find the gap', quality: 'optimal', feedback: 'Correct — with a player advantage, quick ball movement forces the defence to shift and opens gaps.' },
      { id: 'b', text: 'Isolate one side and drive one-on-one', quality: 'risky', feedback: 'Risky — driving one-on-one ignores the numerical advantage and plays into the defence\'s hands.' },
      { id: 'c', text: 'Shoot immediately from 9m', quality: 'good', feedback: 'Good — shooting is an option, but exploiting the advantage with passing is higher quality.' },
      { id: 'd', text: 'Hold the ball and wait', quality: 'poor', feedback: 'Poor — holding wastes the power play and lets the defence adjust to being one player short.' },
    ],
  },
  {
    type: 'Final Attack',
    description: '20 seconds remain in the first half. The score is level. Your team has the last possession. The defence is set in a 6:0.',
    pressure: 'Critical',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Probe the defence, create a high-quality shot in the final 5 seconds', quality: 'optimal', feedback: 'Correct — probing forces the defence to react and creates a better shot than rushing.' },
      { id: 'b', text: 'Shoot immediately from 10m', quality: 'risky', feedback: 'Risky — shooting early against a set defence wastes the last possession.' },
      { id: 'c', text: 'Hold until the final 3 seconds then shoot', quality: 'good', feedback: 'Good — holding for the last shot is safe but may not create a high-quality opportunity.' },
      { id: 'd', text: 'Pass to the wing and hope they finish', quality: 'poor', feedback: 'Poor — passing without a plan puts pressure on the wing with no time to react.' },
    ],
  },
  {
    type: 'Defensive Transition',
    description: 'You lose the ball in attack. The opposition launches a counter-attack. You are the last player back and two attackers are approaching.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Retrace immediately, communicate with your defenders, delay the attack', quality: 'optimal', feedback: 'Correct — immediate retraction and communication slows the counter and lets your defence recover.' },
      { id: 'b', text: 'Stop and complain about the turnover', quality: 'poor', feedback: 'Poor — complaining leaves your team short-handed in transition.' },
      { id: 'c', text: 'Foul the ball carrier to stop the break', quality: 'risky', feedback: 'Risky — a tactical foul may result in a 7m throw or a suspension.' },
      { id: 'd', text: 'Jog back slowly', quality: 'poor', feedback: 'Poor — jogging back gives the opposition a numerical advantage.' },
    ],
  },
  {
    type: 'Reading 3:2:1',
    description: 'The opposition plays a complex 3:2:1 defence. The forward defender is marking you, and the back three are shifting aggressively. You receive the ball.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the shift direction, pass to the side the defence is vacating', quality: 'optimal', feedback: 'Correct — a 3:2:1 creates gaps on the side the defence shifts away from. Read and exploit.' },
      { id: 'b', text: 'Try to beat the forward defender one-on-one', quality: 'risky', feedback: 'Risky — the forward defender is close and the back three are ready to help.' },
      { id: 'c', text: 'Hold the ball and wait for the defence to settle', quality: 'good', feedback: 'Good — waiting is safe but a 3:2:1 is designed to pressure, not settle.' },
      { id: 'd', text: 'Shoot from distance', quality: 'poor', feedback: 'Poor — the 3:2:1 blocks shooting lanes. Distance shots are low quality here.' },
    ],
  },
  {
    type: 'Power Play',
    description: 'Two opposition players are suspended. Your team has a 7-on-5 advantage for 30 seconds. The defence is completely stretched.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Move the ball rapidly to create a 2-on-1 on one side', quality: 'optimal', feedback: 'Correct — with a two-player advantage, rapid ball movement creates an easy finish.' },
      { id: 'b', text: 'Shoot from 9m immediately', quality: 'good', feedback: 'Good — shooting is an option, but passing creates a higher-percentage shot.' },
      { id: 'c', text: 'Hold the ball and run down the clock', quality: 'risky', feedback: 'Risky — holding wastes the advantage and lets the defence regroup.' },
      { id: 'd', text: 'Pass slowly around the perimeter', quality: 'poor', feedback: 'Poor — slow passing lets the defence shift and cover despite being short-handed.' },
    ],
  },
  {
    type: 'Counter-Attack',
    description: 'Your goalkeeper saves a shot and immediately throws a long pass to you. You are alone at the halfway line with one defender between you and the goal.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Drive at the defender, commit them, then pass to the trailing wing', quality: 'optimal', feedback: 'Correct — committing the defender creates a 2-on-1 and an easy finish for the wing.' },
      { id: 'b', text: 'Shoot immediately from 9m', quality: 'risky', feedback: 'Risky — shooting one-on-one against a set defender is low percentage.' },
      { id: 'c', text: 'Slow down and wait for teammates', quality: 'good', feedback: 'Good — waiting is safe but wastes the counter-attack advantage.' },
      { id: 'd', text: 'Pass backwards to a trailing player', quality: 'poor', feedback: 'Poor — passing backwards surrenders the numerical advantage and lets the defence recover.' },
    ],
  },
  {
    type: 'Set Play',
    description: 'Your team runs a rehearsed set play from a free throw. The pivot screens a defender while the left back cuts to the centre. You have the ball at the top.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Time the pass to the cutting left back around the screen', quality: 'optimal', feedback: 'Correct — timing the pass to the cutter around the screen creates a high-quality shot.' },
      { id: 'b', text: 'Shoot from the free throw position', quality: 'risky', feedback: 'Risky — shooting ignores the set play and wastes the rehearsed movement.' },
      { id: 'c', text: 'Pass to the pivot instead', quality: 'good', feedback: 'Good — the pivot is an option, but the cutting back is the primary target of the play.' },
      { id: 'd', text: 'Hold and improvise a new play', quality: 'poor', feedback: 'Poor — abandoning a rehearsed set play wastes preparation and creates confusion.' },
    ],
  },
  {
    type: 'Last Minute',
    description: 'Your team is down by one goal with 40 seconds remaining. You have the ball. The defence is set in a 6:0. This may be your last attack.',
    pressure: 'Critical',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Probe the defence patiently, create the best possible shot in the final 10 seconds', quality: 'optimal', feedback: 'Correct — patience creates a high-quality shot. Rushing against a set defence is low percentage.' },
      { id: 'b', text: 'Shoot immediately from 10m to tie the score', quality: 'risky', feedback: 'Risky — shooting early against a set 6:0 is low percentage and may waste the last possession.' },
      { id: 'c', text: 'Pass to the wing and hope for the best', quality: 'good', feedback: 'Good — the wing is an option, but without a plan it is low quality.' },
      { id: 'd', text: 'Hold the ball until the buzzer', quality: 'poor', feedback: 'Poor — holding until the buzzer means no shot at all. You must attempt to score.' },
    ],
  },
];

// ── Left/Right Back Scenarios (shared) ──────────────────────────────────────────

const BACK_SCENARIOS: ScenarioTemplate[] = [
  {
    type: 'Long Range Shot',
    description: 'You receive the ball at 9m with space for a jump shot. The defender is two steps behind and closing. You are right-handed and your strong corner is far post.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the defender\'s closing speed, shoot if they cannot reach you, pass if they commit', quality: 'optimal', feedback: 'Correct — reading the defender before deciding gives you the highest-quality option.' },
      { id: 'b', text: 'Shoot immediately to the far corner', quality: 'good', feedback: 'Good — shooting to your strong corner is reasonable, but reading the defender first is better.' },
      { id: 'c', text: 'Drive toward the goal regardless', quality: 'risky', feedback: 'Risky — driving into a closing defender risks a charge or a blocked shot.' },
      { id: 'd', text: 'Pass sideways to the other back', quality: 'poor', feedback: 'Poor — you have space for a shot. Passing sideways wastes the opportunity.' },
    ],
  },
  {
    type: 'One Against One',
    description: 'You are isolated one-on-one with your defender at the 9m line. The defender is in a low stance, ready for your drive. The pivot is available for a pass.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the defender\'s stance — if they lean, drive past them; if they retreat, shoot', quality: 'optimal', feedback: 'Correct — reading the defender\'s stance tells you whether to drive or shoot.' },
      { id: 'b', text: 'Drive hard to the goal regardless', quality: 'risky', feedback: 'Risky — driving without reading the defender risks a block or a charge.' },
      { id: 'c', text: 'Pass to the pivot immediately', quality: 'good', feedback: 'Good — the pivot is an option, but you have a one-on-one that could be exploited.' },
      { id: 'd', text: 'Hold the ball and wait', quality: 'poor', feedback: 'Poor — holding lets the defence recover and close the space.' },
    ],
  },
  {
    type: 'Crossing Action',
    description: 'You and the centre back are running a crossing action near the 9m line. The defence is following the crossing. You will receive the ball after the cross.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Time your run to receive the ball in space, then read the defence and shoot or pass', quality: 'optimal', feedback: 'Correct — timing the crossing creates space. Reading the defence after the cross gives you the best option.' },
      { id: 'b', text: 'Shoot immediately after receiving the ball', quality: 'good', feedback: 'Good — shooting after the crossing is reasonable, but reading the defence first is higher quality.' },
      { id: 'c', text: 'Pass back to the centre back', quality: 'risky', feedback: 'Risky — passing back undoes the crossing and wastes the created space.' },
      { id: 'd', text: 'Stop and hold the ball', quality: 'poor', feedback: 'Poor — stopping lets the defence recover from the crossing movement.' },
    ],
  },
  {
    type: 'Playing With Pivot',
    description: 'Your pivot is fronted by a defender but has inside position. You have the ball at 9m. The pass to the pivot is available but tight.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Draw your defender, then pass to the pivot\'s inside hand', quality: 'optimal', feedback: 'Correct — drawing your defender before passing creates the angle for the pivot pass.' },
      { id: 'b', text: 'Shoot from 9m', quality: 'risky', feedback: 'Risky — the pivot has a better scoring position. Shooting wastes the setup.' },
      { id: 'c', text: 'Pass to the pivot immediately', quality: 'good', feedback: 'Good — the pass is available, but drawing the defender first creates a better angle.' },
      { id: 'd', text: 'Pass to the wing', quality: 'poor', feedback: 'Poor — the wing is not the better option. The pivot is in scoring position.' },
    ],
  },
  {
    type: 'Defensive Transition',
    description: 'Your team loses the ball. The opposition transitions quickly. You are the nearest back player and must decide how to respond.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Sprint back immediately, pick up the trailing attacker', quality: 'optimal', feedback: 'Correct — immediate retraction and picking up the trailing runner prevents a numerical disadvantage.' },
      { id: 'b', text: 'Jog back and let others handle it', quality: 'poor', feedback: 'Poor — jogging back gives the opposition a fast break advantage.' },
      { id: 'c', text: 'Try to foul the ball carrier', quality: 'risky', feedback: 'Risky — a tactical foul may result in a 7m or a suspension.' },
      { id: 'd', text: 'Stop and watch', quality: 'poor', feedback: 'Poor — watching leaves your team short-handed in transition.' },
    ],
  },
  {
    type: 'Shot Selection',
    description: 'You receive the ball at 10m with a clear shooting lane. However, the pivot is wide open at the 6m line. The defence has not shifted to cover.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Pass to the open pivot for a high-percentage finish', quality: 'optimal', feedback: 'Correct — the pivot is wide open at 6m. This is a higher-percentage shot than your 10m jump shot.' },
      { id: 'b', text: 'Shoot from 10m since you have a clear lane', quality: 'good', feedback: 'Good — you have a shot, but the pivot has a better one. Passing is higher quality.' },
      { id: 'c', text: 'Hold the ball and wait for the defence to shift', quality: 'risky', feedback: 'Risky — holding lets the defence recover and close the pivot\'s space.' },
      { id: 'd', text: 'Pass to the wing', quality: 'poor', feedback: 'Poor — the wing is not open. The pivot is the better option.' },
    ],
  },
  {
    type: 'Fast Break',
    description: 'Your goalkeeper saves a shot and throws the ball to you. You are at the halfway line with one defender between you and the goal. The right wing is sprinting alongside.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Drive at the defender, commit them, then pass to the wing', quality: 'optimal', feedback: 'Correct — committing the defender creates a 2-on-1 and an easy finish for the wing.' },
      { id: 'b', text: 'Shoot from 9m one-on-one', quality: 'risky', feedback: 'Risky — shooting one-on-one against a set defender is lower percentage than the 2-on-1.' },
      { id: 'c', text: 'Pass to the wing immediately', quality: 'good', feedback: 'Good — passing to the wing is an option, but the defender may intercept. Commit first.' },
      { id: 'd', text: 'Slow down and wait for teammates', quality: 'poor', feedback: 'Poor — slowing down wastes the fast break advantage.' },
    ],
  },
  {
    type: 'Power Play',
    description: 'An opposition defender is suspended for two minutes. Your team has a 7-on-6 advantage. You have the ball at 9m with the defence stretched.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Move the ball to the side with the numerical advantage', quality: 'optimal', feedback: 'Correct — with a player advantage, attacking the short-handed side creates an easy finish.' },
      { id: 'b', text: 'Shoot from 9m immediately', quality: 'good', feedback: 'Good — shooting is an option, but exploiting the advantage is higher quality.' },
      { id: 'c', text: 'Hold the ball and wait', quality: 'risky', feedback: 'Risky — holding wastes the power play and lets the defence adjust.' },
      { id: 'd', text: 'Pass slowly around the perimeter', quality: 'poor', feedback: 'Poor — slow passing lets the defence shift despite being short-handed.' },
    ],
  },
  {
    type: 'Counter-Attack',
    description: 'You intercept a pass at the 9m line and break forward. Two teammates are sprinting alongside you. One defender is between you and the goal.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Drive at the defender, commit them, pass to the better-positioned teammate', quality: 'optimal', feedback: 'Correct — committing the defender creates a 3-on-1 and an easy finish.' },
      { id: 'b', text: 'Shoot from 9m one-on-one', quality: 'risky', feedback: 'Risky — you have a 3-on-1. Shooting wastes the numerical advantage.' },
      { id: 'c', text: 'Pass immediately to the nearest teammate', quality: 'good', feedback: 'Good — passing is safe, but committing the defender first is higher quality.' },
      { id: 'd', text: 'Slow down and wait', quality: 'poor', feedback: 'Poor — slowing down lets the defence recover.' },
    ],
  },
  {
    type: 'Last Minute',
    description: 'Your team is down by one with 30 seconds remaining. You have the ball at 9m. The defence is set. The centre back calls for the ball.',
    pressure: 'Critical',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Pass to the centre back to orchestrate the final attack', quality: 'optimal', feedback: 'Correct — the centre back controls the tempo and can create the best final shot.' },
      { id: 'b', text: 'Shoot from 9m immediately to tie the score', quality: 'risky', feedback: 'Risky — shooting early against a set defence is low percentage.' },
      { id: 'c', text: 'Drive one-on-one', quality: 'good', feedback: 'Good — driving is an option, but with 30 seconds left, a structured attack is better.' },
      { id: 'd', text: 'Hold the ball', quality: 'poor', feedback: 'Poor — holding wastes the remaining time.' },
    ],
  },
  {
    type: 'Passing to Wing',
    description: 'You have the ball at 9m on the left side. The right wing is completely open after a defensive shift. The pass across the court is available but long.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Make the long pass to the open wing for a high-percentage finish', quality: 'optimal', feedback: 'Correct — the wing is completely open. The long pass is the highest-quality option.' },
      { id: 'b', text: 'Shoot from 9m instead of risking the long pass', quality: 'risky', feedback: 'Risky — shooting ignores the open wing and takes a lower-percentage shot.' },
      { id: 'c', text: 'Pass to the centre back to relay to the wing', quality: 'good', feedback: 'Good — relaying through the centre back is safe but slower, giving the defence time to recover.' },
      { id: 'd', text: 'Hold the ball and wait', quality: 'poor', feedback: 'Poor — holding lets the defence close the wing\'s space.' },
    ],
  },
  {
    type: 'Set Play',
    description: 'Your team runs a rehearsed set play. You are supposed to receive a screen from the pivot, then shoot from 9m. The defence seems to anticipate the screen.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the defence — if they anticipate the screen, pass to the pivot who is now open', quality: 'optimal', feedback: 'Correct — if the defence anticipates the screen, the pivot becomes the open option.' },
      { id: 'b', text: 'Follow the set play exactly and shoot', quality: 'risky', feedback: 'Risky — the defence is ready. Following the play into a trap is low percentage.' },
      { id: 'c', text: 'Abandon the play and improvise', quality: 'good', feedback: 'Good — improvising is reasonable, but reading and adapting the play is higher quality.' },
      { id: 'd', text: 'Hold the ball and reset', quality: 'poor', feedback: 'Poor — holding wastes the set play and lets the defence settle.' },
    ],
  },
];

// ── Wing Scenarios (shared for Left and Right Wing) ────────────────────────────

const WING_SCENARIOS: ScenarioTemplate[] = [
  {
    type: 'Wing Finishing',
    description: 'You receive the ball on the wing at a narrow angle. The goalkeeper is covering the near post. You have scored twice today, once near post and once with a lob.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the goalkeeper — if they step forward, lob; if they stay deep, shoot far post', quality: 'optimal', feedback: 'Correct — reading the goalkeeper before choosing your finish gives you the best option.' },
      { id: 'b', text: 'Shoot near post since you scored there before', quality: 'risky', feedback: 'Risky — the goalkeeper is already covering the near post. Repeating is predictable.' },
      { id: 'c', text: 'Pass back to the back player', quality: 'good', feedback: 'Good — passing is safe, but you have a finishing opportunity on the wing.' },
      { id: 'd', text: 'Hold the ball and wait', quality: 'poor', feedback: 'Poor — holding lets the defence recover and close your angle.' },
    ],
  },
  {
    type: 'Fast Break Timing',
    description: 'Your team wins the ball in defence. You are on the wing and see the opportunity to sprint. The goalkeeper has the ball and is looking for a long pass.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Sprint immediately, signal for the long pass, time your run to stay onside', quality: 'optimal', feedback: 'Correct — sprinting immediately and timing your run creates a fast break opportunity.' },
      { id: 'b', text: 'Wait to see if the goalkeeper throws before sprinting', quality: 'risky', feedback: 'Risky — waiting loses the timing advantage of the fast break.' },
      { id: 'c', text: 'Jog forward slowly', quality: 'poor', feedback: 'Poor — jogging wastes the fast break opportunity.' },
      { id: 'd', text: 'Stay back in case of a turnover', quality: 'poor', feedback: 'Poor — staying back surrenders the offensive advantage entirely.' },
    ],
  },
  {
    type: 'Narrow Angle',
    description: 'You receive the ball at an extremely narrow angle, almost behind the goal line. The goalkeeper has the near post covered. The far post is open but requires a precise shot.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the goalkeeper — if they commit to the near post, shoot far post with precision', quality: 'optimal', feedback: 'Correct — reading the goalkeeper and finishing to the open far post is the highest-quality option.' },
      { id: 'b', text: 'Shoot near post hard and hope it goes in', quality: 'risky', feedback: 'Risky — the goalkeeper is already covering the near post. A hard near-post shot is low percentage.' },
      { id: 'c', text: 'Pass back to the back player', quality: 'good', feedback: 'Good — passing is safe, but you have a finishing opportunity, even from a narrow angle.' },
      { id: 'd', text: 'Hold the ball and wait for a better angle', quality: 'poor', feedback: 'Poor — your angle will not improve. Holding lets the defence close you down.' },
    ],
  },
  {
    type: 'Playing Without Ball',
    description: 'Your team is in attack. The ball is on the opposite side of the court. You are on the wing with your defender marking you closely.',
    pressure: 'Low',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Make a smart run to create a passing lane or draw the defender away', quality: 'optimal', feedback: 'Correct — off-ball movement creates options for your team even when you do not receive the ball.' },
      { id: 'b', text: 'Stand still and wait for the ball to come to your side', quality: 'poor', feedback: 'Poor — standing still makes you easy to mark and does not help the attack.' },
      { id: 'c', text: 'Call for the ball loudly', quality: 'risky', feedback: 'Risky — calling for the ball without creating space puts pressure on the ball carrier to force a pass.' },
      { id: 'd', text: 'Move toward the centre to get the ball', quality: 'good', feedback: 'Good — moving toward the centre is reasonable, but a structured run is better.' },
    ],
  },
  {
    type: 'Goalkeeper Reading',
    description: 'You are about to receive the ball on the wing for a finish. The goalkeeper is positioned well, covering the near post and slightly advanced. You have a split second to decide.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the goalkeeper — they are advanced, so a lob over them is the best option', quality: 'optimal', feedback: 'Correct — an advanced goalkeeper is vulnerable to a lob. Reading their position tells you this.' },
      { id: 'b', text: 'Shoot hard to the near post', quality: 'risky', feedback: 'Risky — the goalkeeper is already covering the near post. A hard shot there is low percentage.' },
      { id: 'c', text: 'Pass to the pivot', quality: 'good', feedback: 'Good — passing is safe, but you have a finishing opportunity with a clear read.' },
      { id: 'd', text: 'Hold the ball and wait for the goalkeeper to move', quality: 'poor', feedback: 'Poor — holding gives the defence time to recover and close your angle.' },
    ],
  },
  {
    type: 'Player Advantage',
    description: 'Your team has a one-player advantage after a suspension. You are on the wing and the defence is stretched. The ball is with the centre back who is looking for the open player.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Make a run to the open space and signal for the pass', quality: 'optimal', feedback: 'Correct — with a player advantage, moving to the open space and receiving the pass creates an easy finish.' },
      { id: 'b', text: 'Stay in your position and wait', quality: 'risky', feedback: 'Risky — staying static lets the defence cover you despite being short-handed.' },
      { id: 'c', text: 'Move toward the centre to help', quality: 'good', feedback: 'Good — helping is reasonable, but exploiting the wing space is the better option.' },
      { id: 'd', text: 'Call for the ball without moving', quality: 'poor', feedback: 'Poor — calling without moving does not create a passing lane.' },
    ],
  },
  {
    type: 'Pressure Finishing',
    description: '30 seconds remain. Your team is down by one. You receive the ball on the wing with a narrow angle. The goalkeeper is set and ready. This may be your last attack.',
    pressure: 'Critical',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the goalkeeper and finish to the open corner with precision', quality: 'optimal', feedback: 'Correct — in the final attack, reading the goalkeeper and finishing precisely gives you the best chance.' },
      { id: 'b', text: 'Shoot hard and hope', quality: 'risky', feedback: 'Risky — shooting without reading the goalkeeper is a guess in the most critical moment.' },
      { id: 'c', text: 'Pass back to the centre back', quality: 'good', feedback: 'Good — passing is safe, but with 30 seconds left, this may be the best finishing opportunity.' },
      { id: 'd', text: 'Hold the ball and wait for a better angle', quality: 'poor', feedback: 'Poor — your angle will not improve. Holding wastes the remaining time.' },
    ],
  },
  {
    type: 'Defensive Transition',
    description: 'Your team loses the ball in attack. You are the furthest forward. The opposition counter-attacks toward your goal. You must decide how to respond.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Sprint back immediately, pick up the trailing attacker', quality: 'optimal', feedback: 'Correct — immediate retraction and picking up the trailing runner prevents a numerical disadvantage.' },
      { id: 'b', text: 'Jog back slowly', quality: 'poor', feedback: 'Poor — jogging back gives the opposition a fast break advantage.' },
      { id: 'c', text: 'Try to foul the ball carrier', quality: 'risky', feedback: 'Risky — a tactical foul may result in a 7m or a suspension.' },
      { id: 'd', text: 'Stop and watch', quality: 'poor', feedback: 'Poor — watching leaves your team short-handed in transition.' },
    ],
  },
  {
    type: 'Counter-Attack',
    description: 'Your goalkeeper saves a shot and throws a long ball to you on the wing. You catch it at the halfway line with one defender between you and the goal.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Drive at the defender, commit them, then finish to the open corner', quality: 'optimal', feedback: 'Correct — committing the defender before finishing gives you a 1-on-0 and an easy goal.' },
      { id: 'b', text: 'Shoot from 9m immediately', quality: 'risky', feedback: 'Risky — shooting one-on-one against a set defender is lower percentage than committing them first.' },
      { id: 'c', text: 'Pass back to a trailing teammate', quality: 'good', feedback: 'Good — passing is safe, but you have a counter-attack advantage to exploit.' },
      { id: 'd', text: 'Slow down and wait', quality: 'poor', feedback: 'Poor — slowing down wastes the counter-attack advantage.' },
    ],
  },
  {
    type: 'Set Play',
    description: 'Your team runs a rehearsed set play from a free throw. You are supposed to receive a screen from the pivot, then finish at the near post. The defence seems to anticipate the screen.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the defence — if they anticipate the screen, cut to the far post instead', quality: 'optimal', feedback: 'Correct — if the defence anticipates the screen, the far post becomes the open option.' },
      { id: 'b', text: 'Follow the set play exactly and shoot near post', quality: 'risky', feedback: 'Risky — the defence is ready. Following the play into a trap is low percentage.' },
      { id: 'c', text: 'Abandon the play and pass', quality: 'good', feedback: 'Good — improvising is reasonable, but reading and adapting the play is higher quality.' },
      { id: 'd', text: 'Hold the ball and reset', quality: 'poor', feedback: 'Poor — holding wastes the set play and lets the defence settle.' },
    ],
  },
  {
    type: 'Power Play',
    description: 'An opposition defender is suspended. Your team has a 7-on-6 advantage. You are on the wing and the defence has shifted to cover the centre, leaving you with space.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Signal for the pass and move into the open space for a finish', quality: 'optimal', feedback: 'Correct — the defence has left you open. Signalling and moving into space creates an easy finish.' },
      { id: 'b', text: 'Stay in position and wait for the ball', quality: 'risky', feedback: 'Risky — waiting lets the defence recover and close your space.' },
      { id: 'c', text: 'Move toward the centre to help', quality: 'good', feedback: 'Good — helping is reasonable, but exploiting your open space is better.' },
      { id: 'd', text: 'Hold position and watch', quality: 'poor', feedback: 'Poor — watching wastes the numerical advantage.' },
    ],
  },
  {
    type: 'Last Minute',
    description: 'Your team is down by one with 20 seconds remaining. You receive the ball on the wing with a narrow angle. The goalkeeper is covering the near post. This is the last attack.',
    pressure: 'Critical',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the goalkeeper — they cover near post, so finish far post with precision', quality: 'optimal', feedback: 'Correct — the goalkeeper covers the near post. Finishing to the open far post is the highest-quality option.' },
      { id: 'b', text: 'Shoot hard to the near post and hope', quality: 'risky', feedback: 'Risky — the goalkeeper is already there. Shooting into coverage is a guess.' },
      { id: 'c', text: 'Pass back to the centre back', quality: 'good', feedback: 'Good — passing is safe, but with 20 seconds left, this may be the last finishing opportunity.' },
      { id: 'd', text: 'Hold the ball', quality: 'poor', feedback: 'Poor — holding wastes the remaining time.' },
    ],
  },
];

// ── Pivot Scenarios ─────────────────────────────────────────────────────────────

const PIVOT_SCENARIOS: ScenarioTemplate[] = [
  {
    type: 'Blocking',
    description: 'Your back player is preparing a jump shot from 9m. The goalkeeper has a clear view. You are positioned between the two middle defenders.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Move to screen the goalkeeper\'s view at the right moment', quality: 'optimal', feedback: 'Correct — timing the screen to block the goalkeeper\'s view at the moment of the shot gives your back the best chance.' },
      { id: 'b', text: 'Stay still and let the back shoot', quality: 'risky', feedback: 'Risky — without a screen, the goalkeeper sees the shot clearly and has a good chance to save.' },
      { id: 'c', text: 'Move toward the defender to draw contact', quality: 'good', feedback: 'Good — drawing contact is reasonable, but screening the goalkeeper is the primary role here.' },
      { id: 'd', text: 'Ask for the ball instead', quality: 'poor', feedback: 'Poor — the back has a shooting opportunity. Asking for the ball disrupts the attack.' },
    ],
  },
  {
    type: 'Positioning',
    description: 'The defence is in a 6:0 formation. You are at the 6m line deciding where to position yourself between the two middle defenders.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Position in the gap between the two middle defenders, ready to receive', quality: 'optimal', feedback: 'Correct — positioning in the gap gives you the best chance to receive and finish, and forces the defence to react.' },
      { id: 'b', text: 'Stand directly in front of one defender', quality: 'risky', feedback: 'Risky — standing in front of one defender makes you easy to mark and does not create space.' },
      { id: 'c', text: 'Move wide toward the wing', quality: 'good', feedback: 'Good — moving wide is reasonable, but the gap between the middle defenders is the better position.' },
      { id: 'd', text: 'Stay at the 9m line', quality: 'poor', feedback: 'Poor — staying at 9m removes you from the scoring zone and wastes your position.' },
    ],
  },
  {
    type: 'Receiving Under Pressure',
    description: 'The centre back passes you the ball at the 6m line. A defender is behind you, ready to push and disrupt your reception. You have a split second to decide how to receive.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Use your body to shield the defender, receive with one hand ready to finish', quality: 'optimal', feedback: 'Correct — shielding the defender with your body and receiving with one hand ready to finish is the highest-quality option.' },
      { id: 'b', text: 'Receive with both hands and then turn', quality: 'risky', feedback: 'Risky — receiving with both hands gives the defender time to push you off balance before you can turn.' },
      { id: 'c', text: 'Jump to catch the ball in the air', quality: 'good', feedback: 'Good — jumping to catch is reasonable, but shielding and finishing is the better option.' },
      { id: 'd', text: 'Let the pass go and reset', quality: 'poor', feedback: 'Poor — letting the pass go wastes a scoring opportunity and surrenders possession.' },
    ],
  },
  {
    type: 'Creating Space',
    description: 'Your left back has the ball at 9m and is looking for a shooting lane. The defender in front of you is blocking the shooting angle. You can move to create space.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Move laterally to pull the defender away and open the shooting lane', quality: 'optimal', feedback: 'Correct — moving laterally draws the defender and opens the shooting lane for your back.' },
      { id: 'b', text: 'Stay still and let the back figure it out', quality: 'risky', feedback: 'Risky — staying still keeps the shooting lane blocked and limits your back\'s options.' },
      { id: 'c', text: 'Move toward the back to offer a passing option', quality: 'good', feedback: 'Good — offering a pass is reasonable, but creating space for the shot is the primary role.' },
      { id: 'd', text: 'Ask for the ball', quality: 'poor', feedback: 'Poor — the back has a shooting opportunity. Asking for the ball disrupts the attack.' },
    ],
  },
  {
    type: 'Reading Defensive Rotation',
    description: 'The defence shifts from a 6:0 to a 5:1, with a forward defender stepping out. You are at the 6m line. The shift creates a gap behind the forward defender.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the shift, move into the gap behind the forward defender, signal for the pass', quality: 'optimal', feedback: 'Correct — the defensive shift creates a gap. Moving into it and signalling gives you an easy finish.' },
      { id: 'b', text: 'Stay in your original position', quality: 'risky', feedback: 'Risky — staying still means the defence completes the shift and closes the gap.' },
      { id: 'c', text: 'Move toward the wing', quality: 'good', feedback: 'Good — moving toward the wing is reasonable, but the gap behind the forward defender is the better option.' },
      { id: 'd', text: 'Hold and wait for the defence to settle', quality: 'poor', feedback: 'Poor — waiting lets the defence complete the shift and eliminate the advantage.' },
    ],
  },
  {
    type: 'Finishing at Six Metres',
    description: 'You receive the ball at the 6m line with your back to the goal. The goalkeeper is set and ready. You have a split second to decide how to finish.',
    pressure: 'High',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Spin and shoot low to the far corner — pivots have the best angle low and away', quality: 'optimal', feedback: 'Correct — spinning and shooting low to the far corner is the highest-percentage finish for a pivot.' },
      { id: 'b', text: 'Shoot high to the near corner', quality: 'risky', feedback: 'Risky — high shots from close range are easier for the goalkeeper to see and react to.' },
      { id: 'c', text: 'Pass back to the back player', quality: 'good', feedback: 'Good — passing is safe, but you are in a scoring position at 6m.' },
      { id: 'd', text: 'Hold the ball and wait for the goalkeeper to move', quality: 'poor', feedback: 'Poor — holding gives the defence time to recover and close you down.' },
    ],
  },
  {
    type: 'Defensive Work',
    description: 'Your team loses the ball. The opposition counter-attacks. You are the furthest forward and must decide how to help in transition.',
    pressure: 'High',
    attackOrDefence: 'Defence',
    decisions: [
      { id: 'a', text: 'Sprint back immediately, communicate with your defenders, delay the attack', quality: 'optimal', feedback: 'Correct — immediate retraction and communication slows the counter and lets your defence recover.' },
      { id: 'b', text: 'Jog back slowly', quality: 'poor', feedback: 'Poor — jogging back gives the opposition a fast break advantage.' },
      { id: 'c', text: 'Try to foul the ball carrier', quality: 'risky', feedback: 'Risky — a tactical foul may result in a 7m or a suspension.' },
      { id: 'd', text: 'Stop and watch', quality: 'poor', feedback: 'Poor — watching leaves your team short-handed in transition.' },
    ],
  },
  {
    type: 'Counter-Attack',
    description: 'Your team wins the ball. You are at the 6m line and see the counter-attack developing. The ball is with the centre back at the halfway line.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Sprint forward to the 6m line, signal for the pass, ready to finish', quality: 'optimal', feedback: 'Correct — sprinting to the 6m line and signalling gives you a scoring position in the counter-attack.' },
      { id: 'b', text: 'Jog forward slowly', quality: 'poor', feedback: 'Poor — jogging wastes the counter-attack advantage.' },
      { id: 'c', text: 'Stay back in case of a turnover', quality: 'risky', feedback: 'Risky — staying back surrenders the offensive advantage.' },
      { id: 'd', text: 'Move toward the wing', quality: 'good', feedback: 'Good — moving toward the wing is reasonable, but the 6m line is your primary position.' },
    ],
  },
  {
    type: 'Set Play',
    description: 'Your team runs a rehearsed set play from a free throw. You are supposed to screen a defender, then roll to the 6m line for a pass. The defence seems to anticipate the screen.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Read the defence — if they anticipate the screen, roll to the opposite side for the pass', quality: 'optimal', feedback: 'Correct — if the defence anticipates the screen, rolling to the opposite side creates an open passing lane.' },
      { id: 'b', text: 'Follow the set play exactly', quality: 'risky', feedback: 'Risky — the defence is ready. Following the play into a trap is low percentage.' },
      { id: 'c', text: 'Abandon the play and hold position', quality: 'good', feedback: 'Good — holding is reasonable, but reading and adapting is higher quality.' },
      { id: 'd', text: 'Move toward the wing', quality: 'poor', feedback: 'Poor — moving toward the wing abandons your position and the set play.' },
    ],
  },
  {
    type: 'Power Play',
    description: 'An opposition defender is suspended. Your team has a 7-on-6 advantage. You are at the 6m line with the defence stretched.',
    pressure: 'Moderate',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Position in the gap created by the suspension, signal for the pass, ready to finish', quality: 'optimal', feedback: 'Correct — the suspension creates a gap. Positioning in it and signalling gives you an easy finish.' },
      { id: 'b', text: 'Stay in your original position', quality: 'risky', feedback: 'Risky — staying still means the defence can cover despite being short-handed.' },
      { id: 'c', text: 'Move toward the wing to help', quality: 'good', feedback: 'Good — helping is reasonable, but exploiting the gap is the better option.' },
      { id: 'd', text: 'Hold and watch', quality: 'poor', feedback: 'Poor — watching wastes the numerical advantage.' },
    ],
  },
  {
    type: 'Last Minute',
    description: 'Your team is down by one with 25 seconds remaining. You are at the 6m line fronted by a defender. The centre back has the ball and is looking for a passing option.',
    pressure: 'Critical',
    attackOrDefence: 'Attack',
    decisions: [
      { id: 'a', text: 'Use your body to create a passing lane, shield the defender, signal for the ball', quality: 'optimal', feedback: 'Correct — creating a passing lane and shielding gives the centre back a clear option for a high-percentage finish.' },
      { id: 'b', text: 'Stay in position and hope for the pass', quality: 'risky', feedback: 'Risky — the defender is fronting you. Without creating a lane, the pass cannot reach you.' },
      { id: 'c', text: 'Move toward the wing', quality: 'good', feedback: 'Good — moving is reasonable, but the 6m line is your best scoring position in the final attack.' },
      { id: 'd', text: 'Hold and wait', quality: 'poor', feedback: 'Poor — waiting wastes the remaining time.' },
    ],
  },
];

// ── Scenario Selection by Position ─────────────────────────────────────────────

const SCENARIO_MAP: Record<HandballPosition, ScenarioTemplate[]> = {
  Goalkeeper: GK_SCENARIOS,
  'Centre Back': CB_SCENARIOS,
  'Left Back': BACK_SCENARIOS,
  'Right Back': BACK_SCENARIOS,
  'Left Wing': WING_SCENARIOS,
  'Right Wing': WING_SCENARIOS,
  Pivot: PIVOT_SCENARIOS,
};

// ── Match Generation ───────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function distributeGoals(totalGoals: number, slots: number): number[] {
  const result = new Array(slots).fill(0);
  if (totalGoals <= 0 || slots <= 0) return result;
  let remaining = totalGoals;
  while (remaining > 0) {
    const idx = Math.floor(Math.random() * slots);
    result[idx]++;
    remaining--;
  }
  return result;
}

const FALLBACK: ScenarioTemplate = GK_SCENARIOS[0];

function adminScenarioToMatchSituation(s: AdminScenario, index: number, minute: number, scoreTeam: number, scoreOpp: number): MatchSituation {
  const qualityOrder = ['optimal', 'good', 'risky', 'poor'] as const;
  const decisions: MatchDecision[] = s.answerOptions.map((text, i) => ({
    id: String.fromCharCode(97 + i),
    text,
    quality: i === s.recommendedAnswer ? 'optimal' : (i === s.recommendedAnswer + 1 ? 'good' : qualityOrder[2 + (i % 2)] as any),
    feedback: i === s.recommendedAnswer ? s.explanation : s.commonMistake || `This is not the optimal response for this situation.`,
  }));
  const shuffledDecisions = shuffle(decisions);
  const correct = shuffledDecisions.find((d) => d.quality === 'optimal') ?? shuffledDecisions[0];
  return {
    index,
    minute,
    second: Math.floor(Math.random() * 60),
    scoreTeam,
    scoreOpp,
    pressure: s.pressureLevel,
    formation: `${s.defensiveSystem} defence`,
    description: s.situation,
    scenarioType: s.category,
    decisions: shuffledDecisions,
    correctDecisionId: correct.id,
  };
}

export async function generatePositionMatchAsync(position: HandballPosition): Promise<MatchSituation[]> {
  const adminScenarios = await loadPublishedScenariosForPositionAsync(position);
  return generatePositionMatchFromScenarios(position, adminScenarios);
}

export function generatePositionMatch(position: HandballPosition): MatchSituation[] {
  const adminScenarios = loadPublishedScenariosForPosition(position);
  return generatePositionMatchFromScenarios(position, adminScenarios);
}

function generatePositionMatchFromScenarios(position: HandballPosition, adminScenarios: AdminScenario[]): MatchSituation[] {
  const pool = SCENARIO_MAP[position] ?? GK_SCENARIOS;
  const shuffled = shuffle(pool);

  const TOTAL_SITUATIONS = 15;
  const targetTotalGoals = 28 + Math.floor(Math.random() * 5);
  const teamShare = 0.45 + Math.random() * 0.1;
  const finalTeamGoals = Math.round(targetTotalGoals * teamShare);
  const finalOppGoals = targetTotalGoals - finalTeamGoals;

  const teamIncrements = distributeGoals(finalTeamGoals, TOTAL_SITUATIONS);
  const oppIncrements = distributeGoals(finalOppGoals, TOTAL_SITUATIONS);

  let scoreTeam = 0;
  let scoreOpp = 0;
  const situations: MatchSituation[] = [];

  // If we have enough admin-published scenarios, use them to replace built-in ones
  const useAdminScenarios = adminScenarios.length >= 5;

  for (let i = 0; i < TOTAL_SITUATIONS; i++) {
    const template = shuffled[i % shuffled.length] ?? FALLBACK;
    const isSecondHalf = i >= 7;
    // First half: minutes 1-29, Second half: minutes 31-59
    const minute = isSecondHalf
      ? 31 + Math.floor(((i - 7) / 7) * 28)
      : 1 + Math.floor((i / 7) * 28);
    const second = Math.floor(Math.random() * 60);

    scoreTeam += teamIncrements[i];
    scoreOpp += oppIncrements[i];

    let pressure = template.pressure;
    if (minute >= 28 && minute <= 30) pressure = 'High';
    if (minute >= 57) pressure = 'Critical';
    if (minute <= 5) pressure = 'Low';

    const formation = pickRandom(FORMATIONS);
    const decisions = shuffle(template.decisions);
    const correct = decisions.find((d) => d.quality === 'optimal') ?? decisions[0];

    // Use admin scenario if available, otherwise fall back to built-in template
    if (useAdminScenarios && i < adminScenarios.length) {
      situations.push(
        adminScenarioToMatchSituation(adminScenarios[i], i, minute, scoreTeam, scoreOpp)
      );
    } else {
      situations.push({
        index: i,
        minute,
        second,
        scoreTeam,
        scoreOpp,
        pressure,
        formation,
        description: template.description,
        scenarioType: template.type,
        decisions,
        correctDecisionId: correct.id,
      });
    }
  }

  return situations;
}
