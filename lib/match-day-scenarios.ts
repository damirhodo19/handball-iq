import { PersonalGoal } from './match-day-storage';

export interface TacticalScenario {
  id: string;
  description: string;
  decisions: { id: string; text: string }[];
  correctId: string;
  explanation: string;
  type: string;
}

export interface VisualizationStep {
  title: string;
  instruction: string;
}

export const VISUALIZATION_STEPS: VisualizationStep[] = [
  {
    title: 'First Attack',
    instruction:
      'Imagine the first opponent attack of the match. You are balanced, calm and watching the shooter\'s body before moving. You read the release point and react with a clean save. Feel the confidence of that moment.',
  },
  {
    title: 'After Conceding',
    instruction:
      'Imagine conceding a goal. You immediately reset — take one breath, communicate clearly with your defence and prepare your position for the next attack. The goal is gone. Your focus is entirely on the next action.',
  },
  {
    title: 'Decisive Save',
    instruction:
      'Imagine a decisive save late in the second half. The match is tight. You are patient, your positioning is strong, and you commit only after reading the shooter\'s final arm position. You make the save. Focus on the process, not the result.',
  },
];

const SCENARIOS_BY_GOAL: Record<PersonalGoal, TacticalScenario[]> = {
  'Stay patient': [
    {
      id: 'sp1',
      type: 'Backcourt Shot',
      description:
        'The opponent\'s right back receives the ball at the top of the circle with space for a full jump shot. Your defender is a half-step late closing down.',
      decisions: [
        { id: 'a', text: 'Dive immediately to your strong side to cover the angle' },
        { id: 'b', text: 'Stay balanced, watch the final arm position before committing' },
        { id: 'c', text: 'Step out aggressively before the jump to shorten the angle' },
        { id: 'd', text: 'Focus on the pivot who might receive a pass' },
      ],
      correctId: 'b',
      explanation:
        'Staying balanced and reading the arm position gives you real information before committing. Early movement removes your reaction ability.',
    },
    {
      id: 'sp2',
      type: 'Wing Shot',
      description:
        'The left wing receives at a sharp angle after a quick ball movement. They are one step inside the six-metre line with a difficult shooting angle.',
      decisions: [
        { id: 'a', text: 'Commit hard to cover the near post immediately' },
        { id: 'b', text: 'Hold your position and make yourself large until the release' },
        { id: 'c', text: 'Step out to the six-metre line to force a lob' },
        { id: 'd', text: 'Drop to cover the far post early' },
      ],
      correctId: 'b',
      explanation:
        'Wing shots require you to hold your shape. The angle does the work. Wait for the release cue and react — do not guess a corner.',
    },
    {
      id: 'sp3',
      type: 'Pivot Shot',
      description:
        'The pivot catches a bounce pass close to the six-metre line and spins immediately. You have limited time and your defenders are scrambling.',
      decisions: [
        { id: 'a', text: 'Commit to the most likely shooting side before the spin' },
        { id: 'b', text: 'Stay central and delay your commitment until you see the shooting arm' },
        { id: 'c', text: 'Step forward to close the gap before the pivot completes the spin' },
        { id: 'd', text: 'Drop behind the line and accept the goal probability' },
      ],
      correctId: 'b',
      explanation:
        'Pivot shots are close-range and fast. Staying central means you remain a threat in both directions. Committing early eliminates your chance.',
    },
    {
      id: 'sp4',
      type: 'Seven Metre Throw',
      description:
        'A seven-metre throw is awarded. The shooter is your opponent\'s best scorer and has taken three seven-metres this season, all to the same corner.',
      decisions: [
        { id: 'a', text: 'Dive to the same corner before the throw based on the pattern' },
        { id: 'b', text: 'Stay centred, wait for the throwing motion and react to the release' },
        { id: 'c', text: 'Signal to your bench to ask about the shooter\'s pattern' },
        { id: 'd', text: 'Step forward before the whistle to provoke the shooter' },
      ],
      correctId: 'b',
      explanation:
        'Historical patterns are useful but not certain. Reacting to the actual throwing motion gives you a real chance. A pre-dive surrenders the save.',
    },
    {
      id: 'sp5',
      type: 'Fast Break',
      description:
        'An opponent breaks free one-on-one after an interception. They are running at full speed from the halfway line. You must decide your position.',
      decisions: [
        { id: 'a', text: 'Rush out to the nine-metre line to block the angle immediately' },
        { id: 'b', text: 'Advance steadily to five metres, set your position and wait for the throw' },
        { id: 'c', text: 'Stay on your goal line and wait for the shot' },
        { id: 'd', text: 'Slide to the side you expect the shot to go before they reach range' },
      ],
      correctId: 'b',
      explanation:
        'Controlled advancement shortens the angle without over-committing. Stopping at five metres gives you time to read the final release.',
    },
  ],

  'Read the shooter': [
    {
      id: 'rs1',
      type: 'Backcourt Shot',
      description:
        'The left back has space for a hip shot. You notice the shooter\'s shoulder is slightly open before the ball release.',
      decisions: [
        { id: 'a', text: 'Use the open shoulder as a definitive cue and commit right immediately' },
        { id: 'b', text: 'Note the cue but wait until the arm swings to confirm before reacting' },
        { id: 'c', text: 'Ignore body language and focus only on the ball' },
        { id: 'd', text: 'Communicate to your defender to press before the shot' },
      ],
      correctId: 'b',
      explanation:
        'Body cues are useful context, not certainty. Good shooters can fake open shoulder position. Confirm with the arm swing before committing fully.',
    },
    {
      id: 'rs2',
      type: 'Wing Shot',
      description:
        'A right wing jumps from a sharp angle. You have watched them take three shots this match — all low near post. This jump looks identical.',
      decisions: [
        { id: 'a', text: 'Drop low to near post immediately — the pattern is clear' },
        { id: 'b', text: 'Use the pattern as context but hold your shape until the release' },
        { id: 'c', text: 'Commit to far post to counter their expected shot' },
        { id: 'd', text: 'Stay on your line and wait for the ball to hit you' },
      ],
      correctId: 'b',
      explanation:
        'Patterns inform but do not determine. The fourth shot is the one they save for when you adapt. Hold your shape and read the actual release.',
    },
    {
      id: 'rs3',
      type: 'Pivot Shot',
      description:
        'The pivot receives a lob at the six-metre line and catches it above their head. Their elbow is angled left as they bring the ball down.',
      decisions: [
        { id: 'a', text: 'React immediately to the left based on the elbow angle' },
        { id: 'b', text: 'Track the elbow as a cue and react fully when the wrist position confirms' },
        { id: 'c', text: 'Ignore arm position and rely on reaction time only' },
        { id: 'd', text: 'Step out to eliminate the angle before they turn' },
      ],
      correctId: 'b',
      explanation:
        'Elbow angle is an early read cue, not a final indicator. Use it to prepare, then confirm with wrist position at release.',
    },
    {
      id: 'rs4',
      type: 'Seven Metre Throw',
      description:
        'The seven-metre shooter pauses before stepping to the line. You notice they always look to the left corner before shooting right.',
      decisions: [
        { id: 'a', text: 'Commit right early since you know their look-away pattern' },
        { id: 'b', text: 'Stay central and use the information to lean slightly right as the throw begins' },
        { id: 'c', text: 'Ignore the look and react only after the throw' },
        { id: 'd', text: 'Walk to the right post to influence the shooter\'s perception' },
      ],
      correctId: 'b',
      explanation:
        'A slight weight shift based on pattern information is smart. A full pre-dive gives the shooter the opposite side for free. Stay reactive.',
    },
    {
      id: 'rs5',
      type: 'Fast Break',
      description:
        'A left-handed player breaks one-on-one. You have noticed they always shoot high far post on fast breaks. They gather the ball six metres out.',
      decisions: [
        { id: 'a', text: 'Cover the far post high corner before they release based on the pattern' },
        { id: 'b', text: 'Use the pattern to shift your weight slightly right but hold until the release' },
        { id: 'c', text: 'Go down early to block a low shot — contradict their tendency' },
        { id: 'd', text: 'Step out to reduce the angle and wait for any shot' },
      ],
      correctId: 'b',
      explanation:
        'Preloading your weight based on a pattern gives reaction advantage. A full commitment removes your ability to save the other side.',
    },
  ],

  'Control emotions': [
    {
      id: 'ce1',
      type: 'After Conceding',
      description:
        'You concede a soft goal from a long-range shot you would normally save. Your defenders look frustrated. The score is now level.',
      decisions: [
        { id: 'a', text: 'Shout at your defenders immediately to correct their positioning' },
        { id: 'b', text: 'Take one breath, communicate one clear instruction calmly, and reset your position' },
        { id: 'c', text: 'Say nothing — focus only internally and ignore your team' },
        { id: 'd', text: 'Wave off the goal and sprint back aggressively to show intensity' },
      ],
      correctId: 'b',
      explanation:
        'One calm instruction resets both you and your defence. Shouting raises anxiety. Silence creates distance. One breath is the reset.',
    },
    {
      id: 'ce2',
      type: 'Emotional Pressure',
      description:
        'After three goals in five minutes, the home crowd is very loud. You feel tension building in your chest before the restart.',
      decisions: [
        { id: 'a', text: 'Push the tension away by moving aggressively and making noise' },
        { id: 'b', text: 'Acknowledge the tension, take two slow breaths and return to your pre-shot routine' },
        { id: 'c', text: 'Ask your coach to make a substitution to relieve pressure' },
        { id: 'd', text: 'Block out the crowd by covering your ears between plays' },
      ],
      correctId: 'b',
      explanation:
        'Tension is normal. Acknowledge it without fighting it. Your pre-shot routine is the anchor that returns you to the present.',
    },
    {
      id: 'ce3',
      type: 'Referee Decision',
      description:
        'The referee awards a seven-metre throw you strongly believe should not have been given. Your team captain is already arguing.',
      decisions: [
        { id: 'a', text: 'Join your captain in protesting the decision loudly' },
        { id: 'b', text: 'Leave the argument to others, focus on your seven-metre routine immediately' },
        { id: 'c', text: 'Say something short to the referee to register your disagreement, then reset' },
        { id: 'd', text: 'Turn away and take an unusually long time to set your position' },
      ],
      correctId: 'b',
      explanation:
        'You cannot change the decision. Your next action — saving the seven-metre — is the only thing within your control. Focus there.',
    },
    {
      id: 'ce4',
      type: 'Backcourt Shot',
      description:
        'You are already frustrated from earlier mistakes. The opponent\'s right back catches you off-balance with a shot from distance.',
      decisions: [
        { id: 'a', text: 'Dive early to cover the strong side since you feel off today' },
        { id: 'b', text: 'Reset your stance, use your pre-shot cue word and treat this as shot one' },
        { id: 'c', text: 'Lean forward to signal aggression and try to intimidate the shooter' },
        { id: 'd', text: 'Take more time in setting your position to slow the game down' },
      ],
      correctId: 'b',
      explanation:
        'Your cue word and stance reset your state. Every shot is shot one when you are mentally reset. The previous mistakes are information, not identity.',
    },
    {
      id: 'ce5',
      type: 'Fast Break',
      description:
        'After an emotional high from a great save, the opponent immediately launches a fast break. You are still processing the previous play.',
      decisions: [
        { id: 'a', text: 'Stay on your emotional high — ride the momentum and commit aggressively' },
        { id: 'b', text: 'Exhale and reset your position quickly — neutral focus on the new situation' },
        { id: 'c', text: 'Shout for your defenders to stop the break and avoid having to save it' },
        { id: 'd', text: 'Advance all the way out to the nine-metre line while still excited' },
      ],
      correctId: 'b',
      explanation:
        'Emotional highs are as disruptive as lows. A quick exhale and reset returns you to a clear, present state for the next situation.',
    },
  ],

  'Improve communication': [
    {
      id: 'ic1',
      type: 'Defensive Organisation',
      description:
        'Your 6-0 defence has a gap opening on the left side. The opponent is building up and you can see it before your defenders do.',
      decisions: [
        { id: 'a', text: 'Call the name of the left-back defender and point to the gap clearly' },
        { id: 'b', text: 'Wave generally to your defence and hope they see it' },
        { id: 'c', text: 'Do nothing — the defenders should see it themselves' },
        { id: 'd', text: 'Shout a general instruction like "close down" to everyone' },
      ],
      correctId: 'a',
      explanation:
        'A specific name and a clear direction is always more effective than a general instruction. Specific communication is fast and actionable.',
    },
    {
      id: 'ic2',
      type: 'Fast Break',
      description:
        'After a turnover, you see your team transition into defence and two defenders are unsure who is picking up which opponent.',
      decisions: [
        { id: 'a', text: 'Shout to the nearest defender and point to both opponents clearly' },
        { id: 'b', text: 'Wait for the defenders to sort it themselves — it is not your job' },
        { id: 'c', text: 'Scream general panic warnings to raise awareness' },
        { id: 'd', text: 'Advance to the nine-metre line to narrow the angle for both opponents' },
      ],
      correctId: 'a',
      explanation:
        'As goalkeeper you have the best view. A clear, fast instruction saves the situation. Two words and a point can organise the entire defence.',
    },
    {
      id: 'ic3',
      type: 'Pivot Shot',
      description:
        'The opponent\'s pivot is finding space in front of your defenders repeatedly. Your team has not closed this situation in three attacks.',
      decisions: [
        { id: 'a', text: 'During the next break in play, call your two central defenders and explain the problem calmly' },
        { id: 'b', text: 'Shout criticism at your defenders every time the pivot finds space' },
        { id: 'c', text: 'Say nothing and hope the coach instructs at halftime' },
        { id: 'd', text: 'Gesture to the pivot every time you see the space to warn your defenders mid-play' },
      ],
      correctId: 'a',
      explanation:
        'A calm, specific conversation during a break is far more effective than reactive criticism. It also maintains team trust and focus.',
    },
    {
      id: 'ic4',
      type: 'Seven Metre Throw',
      description:
        'Before a seven-metre throw, your defenders are standing in various positions. You need them positioned correctly for the rebound.',
      decisions: [
        { id: 'a', text: 'Quickly and calmly place your defenders in the correct positions with short instructions' },
        { id: 'b', text: 'Focus entirely on the shooter and trust your defenders will position themselves' },
        { id: 'c', text: 'Step forward and wave your arms to try to distract the shooter' },
        { id: 'd', text: 'Ask the referee for more time to get organised' },
      ],
      correctId: 'a',
      explanation:
        'You are the organiser at seven-metre situations. Clear positioning before the throw gives your team the best chance at the rebound.',
    },
    {
      id: 'ic5',
      type: 'Backcourt Shot',
      description:
        'A defender is consistently leaving their mark to double up on another opponent. This is creating gaps on the right side repeatedly.',
      decisions: [
        { id: 'a', text: 'Tell the defender specifically what you are seeing after the play, without blame' },
        { id: 'b', text: 'Accept the situation — the defender is trying to help' },
        { id: 'c', text: 'Criticise the defender loudly in front of the team to make the point' },
        { id: 'd', text: 'Cover the right side yourself and say nothing' },
      ],
      correctId: 'a',
      explanation:
        'Constructive, specific feedback given calmly creates learning. Blame creates defensive behaviour and destroys communication.',
    },
  ],

  'Fast break saves': [
    {
      id: 'fb1',
      type: 'Fast Break',
      description:
        'A right-handed attacker breaks free one-on-one from the halfway line. They are at full speed with no defender within five metres.',
      decisions: [
        { id: 'a', text: 'Rush to the nine-metre line immediately to eliminate the angle' },
        { id: 'b', text: 'Advance in control to five metres, set your position and wait for the decision' },
        { id: 'c', text: 'Stay on your goal line and react to the shot' },
        { id: 'd', text: 'Drop to the ground early to make yourself seem larger' },
      ],
      correctId: 'b',
      explanation:
        'Controlled advancement to five metres shortens the angle while preserving your reaction time. Over-advancing eliminates the lob defence.',
    },
    {
      id: 'fb2',
      type: 'Fast Break',
      description:
        'A left-handed attacker has a fast break and is moving at full pace. You notice they slow slightly at seven metres — a sign they might pass.',
      decisions: [
        { id: 'a', text: 'Commit to the save as if it is a shot — the slowdown might be a fake' },
        { id: 'b', text: 'Maintain your position and read whether they stop or continue to shoot' },
        { id: 'c', text: 'Drop back quickly to cover a possible pass to the wing' },
        { id: 'd', text: 'Shout for your defender to come and cover the option' },
      ],
      correctId: 'b',
      explanation:
        'Maintaining position while reading the play keeps you effective in both outcomes. Premature commitment hands the attacker control.',
    },
    {
      id: 'fb3',
      type: 'Fast Break',
      description:
        'Two attackers break against one defender. The ball carrier is on the left, the wing is open on the right. Your defender is between them.',
      decisions: [
        { id: 'a', text: 'Cover the ball carrier\'s side fully and leave the wing to your defender' },
        { id: 'b', text: 'Stay central, defend against the ball carrier first and react if there is a pass' },
        { id: 'c', text: 'Advance to the nine-metre line to force a quick decision' },
        { id: 'd', text: 'Commit to the wing since the ball carrier is more likely to pass' },
      ],
      correctId: 'b',
      explanation:
        'Staying central keeps you relevant to both options. Your defender must force the pass decision. React to what actually happens.',
    },
    {
      id: 'fb4',
      type: 'Fast Break',
      description:
        'An attacker breaks free and slows to a walk at four metres before shooting. You are tempted to rush out and meet them.',
      decisions: [
        { id: 'a', text: 'Rush out to close the gap while they are slow' },
        { id: 'b', text: 'Hold your position — the walk is a technique to draw you forward' },
        { id: 'c', text: 'Drop back to your line to give yourself reaction distance' },
        { id: 'd', text: 'Shout at your defenders to sprint back and cover' },
      ],
      correctId: 'b',
      explanation:
        'Walking towards goal is a deliberate technique. If you rush out, you open the lob and the far post. Hold position and read the release.',
    },
    {
      id: 'fb5',
      type: 'Fast Break',
      description:
        'After saving a one-on-one fast break, the same player gets the ball again on a second fast break thirty seconds later. You saved low right last time.',
      decisions: [
        { id: 'a', text: 'Shade to your left since they will likely go away from where you just saved' },
        { id: 'b', text: 'Use the previous save as context but hold your central position until the release' },
        { id: 'c', text: 'Go low right again — players often repeat under pressure' },
        { id: 'd', text: 'Advance more aggressively since you saved them last time' },
      ],
      correctId: 'b',
      explanation:
        'A slight positional shade based on information is smart. A full pre-commitment is a guess. React to the actual release.',
    },
  ],

  'Seven metre saves': [
    {
      id: 'sm1',
      type: 'Seven Metre Throw',
      description:
        'The opponent\'s seven-metre specialist steps to the line. You have no scouting information on this player.',
      decisions: [
        { id: 'a', text: 'Pick a side based on intuition and pre-dive' },
        { id: 'b', text: 'Stay central, keep eye contact and react to the throwing motion' },
        { id: 'c', text: 'Step to the right post to invite the left side and then cover left' },
        { id: 'd', text: 'Jump up and down to break the shooter\'s concentration' },
      ],
      correctId: 'b',
      explanation:
        'Without information, reaction is your best tool. Staying central and reading the throwing motion gives you a real chance in both directions.',
    },
    {
      id: 'sm2',
      type: 'Seven Metre Throw',
      description:
        'The shooter runs up with a fast approach. You know fast-approach shooters tend to shoot low and hard to the preferred side.',
      decisions: [
        { id: 'a', text: 'Drop to your knees early to block the low shot' },
        { id: 'b', text: 'Stay upright, use the information to load weight lower but react to the actual throw' },
        { id: 'c', text: 'Ignore the approach and treat it as your first seven-metre ever' },
        { id: 'd', text: 'Step forward before the release to reduce the angle' },
      ],
      correctId: 'b',
      explanation:
        'Loading weight lower based on a pattern is smart preparation. Dropping early means you cannot cover a high shot. Prepare, then react.',
    },
    {
      id: 'sm3',
      type: 'Seven Metre Throw',
      description:
        'The shooter steps to the line confidently after scoring on you in the first half with a high cross shot.',
      decisions: [
        { id: 'a', text: 'Cover high cross shot immediately — they will repeat the confidence shot' },
        { id: 'b', text: 'Stay centred with slight preparation for height, read the actual throw' },
        { id: 'c', text: 'Show aggression by stepping out before the whistle' },
        { id: 'd', text: 'Ask your bench for advice before the throw' },
      ],
      correctId: 'b',
      explanation:
        'A confident shooter might repeat or deliberately change. Use the information but react — do not guess. Slight height awareness is fine.',
    },
    {
      id: 'sm4',
      type: 'Seven Metre Throw',
      description:
        'The score is level in the final minute. An unexpected player steps up for the seven-metre — not the usual specialist.',
      decisions: [
        { id: 'a', text: 'Pre-dive to the strong side since non-specialists often shoot predictably' },
        { id: 'b', text: 'Treat this like any throw — stay reactive and read the motion' },
        { id: 'c', text: 'Step forward to intimidate the less experienced shooter' },
        { id: 'd', text: 'Go to the centre and crouch to make yourself look larger' },
      ],
      correctId: 'b',
      explanation:
        'Non-specialists are unpredictable in different ways. Staying reactive gives you the best chance. A pre-dive is still a guess.',
    },
    {
      id: 'sm5',
      type: 'Seven Metre Throw',
      description:
        'You are in a penalty shootout. It is the third throw. You have already saved one and conceded one in this shootout.',
      decisions: [
        { id: 'a', text: 'Continue your pattern of alternating sides between throws' },
        { id: 'b', text: 'Reset completely for each throw — read each shooter as if it is the first' },
        { id: 'c', text: 'Change your position on the line to try something new' },
        { id: 'd', text: 'Focus on the scoreboard and calculate what you need' },
      ],
      correctId: 'b',
      explanation:
        'Each throw is independent. Patterns during shootouts lead to predictable behaviour that skilled shooters will exploit. Reset and read.',
    },
  ],
};

export function getScenariosForGoals(goals: PersonalGoal[], count: number): TacticalScenario[] {
  const pool: TacticalScenario[] = [];
  for (const goal of goals) {
    const scenarios = SCENARIOS_BY_GOAL[goal] ?? [];
    pool.push(...scenarios);
  }
  // De-duplicate by id
  const seen = new Set<string>();
  const unique = pool.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
  // Shuffle deterministically enough for display
  const shuffled = unique.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
