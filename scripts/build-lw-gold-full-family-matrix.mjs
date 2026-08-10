#!/usr/bin/env node
/**
 * Phase 2: design/audit remaining 49 LW Gold families.
 * READ ONLY vs scenarios.json — writes matrix artifacts only.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
const pilots = JSON.parse(
  readFileSync(join(root, 'scripts/scenario-bank/data/lw-pilot-10.json'), 'utf8'),
);
const gap = JSON.parse(readFileSync(join(root, 'scripts/lw-gold-full-bank-gap-audit.json'), 'utf8'));

const hashPos = (pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(bank.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

const locks = {
  LB: {
    count: bank.filter((s) => s.primaryPosition === 'Left Back').length,
    hash: hashPos('Left Back'),
    expectedHash: gap.locks.LB.hash,
    expectedCount: 62,
  },
  RB: {
    count: bank.filter((s) => s.primaryPosition === 'Right Back').length,
    hash: hashPos('Right Back'),
    expectedHash: gap.locks.RB.hash,
    expectedCount: 63,
  },
  CB: {
    count: bank.filter((s) => s.primaryPosition === 'Centre Back').length,
    hash: hashPos('Centre Back'),
    expectedHash: gap.locks.CB.hash,
    expectedCount: 70,
  },
  RW: {
    count: bank.filter((s) => s.primaryPosition === 'Right Wing').length,
    hash: hashPos('Right Wing'),
    expectedHash: gap.locks.RW.hash,
    expectedCount: 65,
  },
};
for (const k of Object.keys(locks)) {
  locks[k].countOk = locks[k].count === locks[k].expectedCount;
  locks[k].hashOk = locks[k].hash === locks[k].expectedHash;
}
locks.allOk = Object.values(locks).every((v) => v.countOk && v.hashOk);

const f = (row) => {
  if (row.perception === true) {
    if (!row.perceptionDetail?.cueObserved) {
      throw new Error(`Missing perceptionDetail for ${row.familyKey}`);
    }
  } else if (row.primaryCue != null) {
    // allow null primaryCue when perception false
  }
  return row;
};

/** @type {any[]} */
const families = [
  f({
    familyKey: 'lw_width_stretch_when_lb_binds',
    teachingArea: 'positional_width',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Beginner',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'When LB has already bound the wing defender, maximize left sideline stretch so the next pass still has width.',
    startingGeometry: 'LW left corner; LB engaged with WD; WD hips on LB.',
    primaryCue: null,
    decisionFork: 'Stretch wider vs drift inside vs cut early.',
    optimalDecision: 'Push to true sideline width and stay available.',
    goodConditionalDecision:
      'Step one metre inside only if LB→LW lane is body-blocked and LB asks for a short angle.',
    whyBNotA: 'Lane is open after bind — inside step not needed.',
    whyLWCurriculum: 'Width ladder after pilot 941 (width before bind).',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_941',
    closestRwGold: 'scn_bank_887 / 884',
    closestOtherGold: 'LB bind/drive families',
    semanticDuplicateAssessment:
      'Related RW width-for-drive; distinct as post-bind stretch after 941.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 2,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_stay_wide_inside_help',
    teachingArea: 'stay_wide',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Beginner',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'When WD turns inside to help on LB, stay wide — do not follow into the crowded half.',
    startingGeometry: 'LW wide left; WD chest/hips rotate toward LB drive.',
    primaryCue: 'WD chest/hips turn inside toward LB.',
    decisionFork: 'Stay wide vs follow inside vs early entry.',
    optimalDecision: 'Hold/maximize width as the release.',
    goodConditionalDecision:
      'Enter only if WD’s second help empties a clear path to six and LB can deliver.',
    whyBNotA: 'Only first inside help stated — six-path not emptied.',
    whyLWCurriculum: 'Core stay-wide; distinct from 943 first-move and 948 6v5.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_943 / 948',
    closestRwGold: 'scn_bank_886 / 895',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not 943/948. Essential wing fundamental.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'WD chest/hips turn inside',
      decisionCaused: 'stay wide',
      changedCueForB: 'second help empties six-path + LB can deliver → entry',
    },
  }),
  f({
    familyKey: 'lw_lb_delay_ask_lane_blocked',
    teachingArea: 'lb_cooperation',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Beginner',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Do not force the ask when WD body already cuts the LB→LW lane — hold width for the next action.',
    startingGeometry: 'LB has ball facing left; WD feet/chest cut pass lane to LW.',
    primaryCue: 'WD feet/chest occupy LB→LW lane.',
    decisionFork: 'Ask now vs delay ask vs cut into traffic.',
    optimalDecision: 'Hold width; delay the ask.',
    goodConditionalDecision: 'Ask now only if WD hips reopen the lane before LB is doubled.',
    whyBNotA: 'Lane currently cut — reopen not stated.',
    whyLWCurriculum: 'Inverse of pilot 942 ask-now.',
    lwNativity: 'STRONGLY LW NATIVE',
    closestLwPilot: 'scn_bank_942',
    closestRwGold: 'scn_bank_872 (opposite fork)',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Opposite decision to 942/872 — unique.',
    mirrorTest: 'CONTEXTUAL',
    coachRisk: 2,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'WD feet/chest cut lane',
      decisionCaused: 'delay ask',
      changedCueForB: 'hips reopen lane → ask now',
    },
  }),
  f({
    familyKey: 'lw_entry_when_not',
    teachingArea: 'entry',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Reject early corner entry when LB still needs left width and WD is recovering/closing the lane.',
    startingGeometry: 'LW tempted to enter; LB still driving; WD recovering toward entry lane.',
    primaryCue: null,
    decisionFork: 'Stay wide vs enter now vs back-door anyway.',
    optimalDecision: 'Stay wide; do not leave the corner.',
    goodConditionalDecision:
      'Enter only if WD overcommits inside again and six-path reopens with LB able to pass.',
    whyBNotA: 'Recovery/closing live; LB still needs width.',
    whyLWCurriculum: 'Set when-NOT-to-enter; distinct from 945 exit and 948 6v5.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_945 / 948',
    closestRwGold: 'scn_bank_873',
    closestOtherGold: null,
    semanticDuplicateAssessment:
      'Closest RW 873. Differentiated by LB-still-driving width need. Essential anti-entry.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_entry_when_space_opens',
    teachingArea: 'entry',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Enter toward six only after WD overcommit empties a real left lane — timed with LB delivery.',
    startingGeometry: 'WD overcommitted; path to left six opens; LB free arm.',
    primaryCue: 'Clear path behind WD + LB can still pass.',
    decisionFork: 'Enter now vs stay wide vs wait one more swing.',
    optimalDecision: 'Timed entry toward six now.',
    goodConditionalDecision: 'Stay wide if LB is doubled with no free arm.',
    whyBNotA: 'LB free arm and open path stated.',
    whyLWCurriculum: 'Positive entry pair with entry_when_not.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_945',
    closestRwGold: 'scn_bank_890 / 893',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW enter-after-help; requires LB delivery co-cue.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'open six-path + LB free arm',
      decisionCaused: 'enter',
      changedCueForB: 'LB doubled/no free arm → stay wide',
    },
  }),
  f({
    familyKey: 'lw_backdoor_ball_watch',
    teachingArea: 'backdoor',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Cut back-door when WD ball-watches far AND LB is about to receive with a deliverable angle.',
    startingGeometry: 'WD head/chest to far ball; LW wide left; LB receiving next.',
    primaryCue: 'WD ball-watch + LB about to receive.',
    decisionFork: 'Back-door cut now vs hold width vs show in front.',
    optimalDecision: 'Cut behind WD toward six on the next pass.',
    goodConditionalDecision: 'Hold width if WD feet reopen to the corner before LB catches.',
    whyBNotA: 'Feet still allow back-door; reopen not stated.',
    whyLWCurriculum: 'Attack back-door; distinct from defence back-door deny.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_943',
    closestRwGold: 'scn_bank_891',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 891; LB-delivery timing required.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'WD ball-watch + LB receiving',
      decisionCaused: 'back-door cut',
      changedCueForB: 'WD feet reopen before catch → hold width',
    },
  }),
  f({
    familyKey: 'lw_takeoff_lane_closed',
    teachingArea: 'takeoff',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Do not force the take-off when half/WD recover into the take-off line — recycle to LB.',
    startingGeometry: 'LW catching left wing; recovering body in take-off line; LB free.',
    primaryCue: 'Recovering body in take-off line; contact imminent.',
    decisionFork: 'Force jump vs short return to LB vs delay without jumping.',
    optimalDecision: 'Short return to free LB; keep width.',
    goodConditionalDecision: 'Take off only if recovering body still >1 full stride outside the line.',
    whyBNotA: 'Recovery already in the line.',
    whyLWCurriculum: 'Closed take-off complement to pilot 944 open take-off.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_944',
    closestRwGold: 'scn_bank_883',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 883; pair with 944 open vs closed.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'body in take-off line',
      decisionCaused: 'recycle to LB',
      changedCueForB: 'recovering body >1 stride out → take off',
    },
  }),
  f({
    familyKey: 'lw_pivot_block_opens_takeoff',
    teachingArea: 'pivot',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'When pivot seals WD recovery on the left half, take off into the freed middle lane — then read GK.',
    startingGeometry: 'Pivot seals left-half recovery; WD delayed; LW ready to jump.',
    primaryCue: 'Pivot seal holds recovery path clear for take-off.',
    decisionFork: 'Take off now vs wait vs feed pivot.',
    optimalDecision: 'Take off into freed lane now; finish from later GK cue.',
    goodConditionalDecision: 'Feed pivot if seal breaks and soft inside lane to pivot opens.',
    whyBNotA: 'Seal holding; take-off lane free.',
    whyLWCurriculum: 'Pivot–LW left-half cooperation; distinct from pivot_feed_vs_finish.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_944',
    closestRwGold: 'scn_bank_874',
    closestOtherGold: 'LB/pivot seal families',
    semanticDuplicateAssessment: 'Related RW 874; distinct from 944 (no pivot seal / 3:2:1).',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'pivot seal frees take-off lane',
      decisionCaused: 'take off',
      changedCueForB: 'seal breaks + soft pivot lane → feed pivot',
    },
  }),
  f({
    familyKey: 'lw_pivot_feed_vs_finish',
    teachingArea: 'pivot',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Feed the sealed pivot instead of forcing an extreme-angle wing shot when WD recovers onto your body.',
    startingGeometry: 'LW extreme angle; WD on body; pivot sealed left half; soft inside open.',
    primaryCue: 'WD contact on LW + sealed pivot with soft inside lane.',
    decisionFork: 'Feed pivot vs force wing shot vs lob.',
    optimalDecision: 'Soft feed to sealed pivot.',
    goodConditionalDecision:
      'Finish only if WD loses contact and a playable skim opens before help arrives.',
    whyBNotA: 'Contact and extreme angle live; skim not stated.',
    whyLWCurriculum: 'Distinct from pivot-block take-off and from 946 soft-inside-to-LB.',
    lwNativity: 'STRONGLY LW NATIVE',
    closestLwPilot: 'scn_bank_946',
    closestRwGold: 'scn_bank_888 / 894',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not 946; requires sealed pivot + WD on body.',
    mirrorTest: 'CONTEXTUAL',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'WD on body + sealed pivot lane',
      decisionCaused: 'feed pivot',
      changedCueForB: 'WD loses contact + playable skim → finish',
    },
  }),
  f({
    familyKey: 'lw_1v1_wing_space',
    teachingArea: 'one_v_one',
    attackOrDefence: 'Attack',
    system: 'Open',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Attack the 1v1 take-off when you own sideline space and help is late — do not recycle out of habit.',
    startingGeometry: 'Open/man; WD isolated; help >2m; feet flat.',
    primaryCue: 'Help distance >2m + WD feet flat/isolated.',
    decisionFork: 'Attack 1v1 vs recycle to LB vs wait.',
    optimalDecision: 'Attack the 1v1 take-off now.',
    goodConditionalDecision: 'Recycle if help closes inside 2m before catch is secure.',
    whyBNotA: 'Help still >2m.',
    whyLWCurriculum: 'Open-defence isolation — system changes decision vs 6:0.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_944',
    closestRwGold: 'no clear RW attack twin (938 is defence)',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Pair opposite of sys_open_man_help; not RW clone.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'help >2m + flat feet',
      decisionCaused: '1v1 attack',
      changedCueForB: 'help <2m → recycle',
    },
  }),
  f({
    familyKey: 'lw_gk_near_post_commit',
    teachingArea: 'goalkeeper',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'After a live take-off is already justified, use GK early near-post commitment to choose the far-side finish — not a standing deterministic rule.',
    startingGeometry: 'Live take-off window from left; GK near foot/arm commit early.',
    primaryCue: 'GK near foot and near arm commit to near post.',
    decisionFork: 'Far-side finish vs near-side force vs soft pass to LB.',
    optimalDecision: 'Far-side finish while near side is abandoned.',
    goodConditionalDecision: 'Soft to LB if far side is also covered by recovering help before release.',
    whyBNotA: 'Far window open; far covered by help not stated.',
    whyLWCurriculum: 'Anti-folklore near-commit; take-off-first gate.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_946',
    closestRwGold: 'scn_bank_875',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 875; take-off-first + B=LB pass differentiates.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 5,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'GK near foot/arm commit',
      decisionCaused: 'far-side finish',
      changedCueForB: 'far also covered by help → soft LB',
    },
  }),
  f({
    familyKey: 'lw_gk_far_side_commit',
    teachingArea: 'goalkeeper',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'When GK shades far early and take-off is live, near-side finish is available — opposite commit family.',
    startingGeometry: 'Live take-off from left; GK weight/far foot shaded far.',
    primaryCue: 'GK far-side weight/foot commitment before release.',
    decisionFork: 'Near-side finish vs far force vs recycle.',
    optimalDecision: 'Near-side finish into the opened window.',
    goodConditionalDecision: 'Recycle to LB if near lane is body-blocked by WD contact.',
    whyBNotA: 'Near window open; WD body block not stated.',
    whyLWCurriculum: 'Pair with near-commit — opposite cue/finish.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_946',
    closestRwGold: 'scn_bank_901 (related cluster, different cue)',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not near-commit; not 946 step-out.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'GK far shade',
      decisionCaused: 'near finish',
      changedCueForB: 'WD body blocks near → recycle LB',
    },
  }),
  f({
    familyKey: 'lw_gk_depth_read',
    teachingArea: 'goalkeeper',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'GK depth plus hands changes finish timing/shape — never automatic lob/power from a single adjective.',
    startingGeometry: 'Live take-off; GK depth and hand height explicitly stated.',
    primaryCue: 'GK depth (deep vs stepped) + hands high/low.',
    decisionFork: 'Carry late vs early skim vs soft inside.',
    optimalDecision: 'Choose from stated depth+hands pair (e.g. deep+high → carry late, not auto-lob).',
    goodConditionalDecision: 'Soft inside if LB free and depth/hands remove a clean skim.',
    whyBNotA: 'Clean finish window from depth+hands available unless stated otherwise.',
    whyLWCurriculum: 'Anti-folklore depth; distinct from 946 step-out and late movement.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_946',
    closestRwGold: 'scn_bank_897 / 898',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Must not teach deep=lob. Multi-cue timing family.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'depth + hands',
      decisionCaused: 'finish timing/shape',
      changedCueForB: 'no clean skim + LB free → soft inside',
    },
  }),
  f({
    familyKey: 'lw_gk_late_movement_patience',
    teachingArea: 'goalkeeper',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Wait through GK’s late first step during take-off when contact is not forcing early release.',
    startingGeometry: 'LW in take-off; GK late first step; no forcing defender contact.',
    primaryCue: 'GK late first step; contact not forcing release.',
    decisionFork: 'Patience to abandoned corner vs early release into hands.',
    optimalDecision: 'Wait through the late move and finish the abandoned corner.',
    goodConditionalDecision: 'Early controlled release only if defender contact forces the arm now.',
    whyBNotA: 'No forcing contact stated.',
    whyLWCurriculum: 'Late-movement patience — distinct from depth/commit.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_946',
    closestRwGold: 'scn_bank_900',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 900; patience framing distinct.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'late GK step, no force contact',
      decisionCaused: 'wait',
      changedCueForB: 'defender contact forces arm → early release',
    },
  }),
  f({
    familyKey: 'lw_gk_extreme_angle_body',
    teachingArea: 'goalkeeper',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'From extreme left angle, decide skim vs recycle from body/help/GK shade together — not a hand sticker or deterministic GK rule.',
    startingGeometry: 'Extreme left angle; sliver of goal; help distance and GK shade stated.',
    primaryCue: 'Sliver goal + help distance + GK shade open a playable skim.',
    decisionFork: 'Playable skim vs recycle to LB vs hope shot.',
    optimalDecision: 'Skim finish when sliver + shade + late help make it playable.',
    goodConditionalDecision: 'Recycle to LB if help arrives or shade covers the remaining sliver.',
    whyBNotA: 'Base picture skim is playable.',
    whyLWCurriculum: 'Extreme-angle first decision quality; handedness none.',
    lwNativity: 'STRONGLY LW NATIVE',
    closestLwPilot: 'scn_bank_946',
    closestRwGold: 'RW extreme-angle sparse',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not deterministic GK→corner rule.',
    mirrorTest: 'CONTEXTUAL',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'sliver + late help + GK shade',
      decisionCaused: 'skim',
      changedCueForB: 'help arrives / shade covers sliver → recycle',
    },
  }),
  f({
    familyKey: 'lw_fw_arrival_timing',
    teachingArea: 'transition_first',
    attackOrDefence: 'Attack',
    system: 'Mixed',
    numerical: 'transition',
    difficulty: 'Beginner',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In first wave, time the sprint so catch and six-metre arrival happen together.',
    startingGeometry: 'Outlet to left wing lane; one recovering body between LW and six.',
    primaryCue: null,
    decisionFork: 'Arrive with catch on six vs stop early vs float behind.',
    optimalDecision: 'Sprint timing so catch and six arrive together.',
    goodConditionalDecision:
      'Short secure catch and return if pressured before six with a free LB/CB available.',
    whyBNotA: 'Pressure forcing early secure not stated.',
    whyLWCurriculum: 'Timing principle — perception false.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_947',
    closestRwGold: 'RW 904 pressured catch is different',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not 876/902 width or 2v1 pass-option families.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 2,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_fw_2v1_finish_or_pass',
    teachingArea: 'transition_first',
    attackOrDefence: 'Attack',
    system: 'Mixed',
    numerical: '2v1',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'In first-wave 2v1, finish or give the extra pass based on which body the recovering defender commits to.',
    startingGeometry: 'LW + teammate vs 1; LW wide left; defender commit stated toward teammate/ball.',
    primaryCue: 'Recovering defender commits to ball carrier (not LW).',
    decisionFork: 'Finish now vs extra pass vs hold.',
    optimalDecision: 'Finish now (defender committed to teammate/ball).',
    goodConditionalDecision: 'Extra pass if defender instead commits to you.',
    whyBNotA: 'Commit is toward teammate/ball.',
    whyLWCurriculum: '2v1 distinct from 3v2 hold-width.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_947',
    closestRwGold: 'scn_bank_902 (stay-wide pass option — different fork)',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Different fork from RW 902.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'defender commit target',
      decisionCaused: 'finish (or pass if flipped)',
      changedCueForB: 'commit flips onto LW → extra pass',
    },
  }),
  f({
    familyKey: 'lw_fw_3v2_hold_width',
    teachingArea: 'transition_first',
    attackOrDefence: 'Attack',
    system: 'Mixed',
    numerical: '3v2',
    difficulty: 'Intermediate',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In 3v2, when middle is occupied, hold left width to six as the pass option — do not crowd middle.',
    startingGeometry: '3v2; middle covered by recovering defender; left lane free.',
    primaryCue: null,
    decisionFork: 'Hold left width vs cut middle vs stop running.',
    optimalDecision: 'Hold width in the left lane to six as pass option.',
    goodConditionalDecision:
      'Cut inside only if both recovering defenders fix on the middle pair and left lane closes.',
    whyBNotA: 'Left lane free; middle occupied.',
    whyLWCurriculum: '3v2 width; distinct from 2v1 and from 947 second-wave.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_947',
    closestRwGold: 'scn_bank_876',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Closest RW 876; essential first-wave family.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_sw_advantage_gone',
    teachingArea: 'transition_second',
    attackOrDefence: 'Attack',
    system: 'Mixed',
    numerical: 'transition',
    difficulty: 'Intermediate',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'When recovering defenders restore numbers and no free left lane remains, stop forcing transition.',
    startingGeometry: 'Second wave; numbers restored; left WD back; no free lane.',
    primaryCue: null,
    decisionFork: 'Stop and hold width vs force one more vs enter anyway.',
    optimalDecision: 'Stay wide and return to positional attack.',
    goodConditionalDecision: 'One more left action only if WD still >2m late (947 condition).',
    whyBNotA: 'Advantage gone; WD not late.',
    whyLWCurriculum: 'Opposite fork to pilot 947.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_947',
    closestRwGold: 'scn_bank_877',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Opposite of 947; related RW 877.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_trans_lane_vs_recovery',
    teachingArea: 'transition_lane',
    attackOrDefence: 'Attack',
    system: 'Mixed',
    numerical: 'transition',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Choose the left running lane against a recovering defender — hold wide until the fixer is fixed, then cut.',
    startingGeometry: 'LW running left transition; recovering defender between ball and LW.',
    primaryCue: 'Whether ball-carrier has fixed the recovering defender’s feet.',
    decisionFork: 'Hold wide lane vs cut behind after fix vs stop.',
    optimalDecision: 'Hold wide until feet are fixed (base: not yet fixed).',
    goodConditionalDecision: 'Immediate cut if defender’s feet are already fixed and back is open.',
    whyBNotA: 'Feet not yet fixed.',
    whyLWCurriculum: 'Lane choice vs recovery — not another hold-width clone.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_947',
    closestRwGold: 'scn_bank_905',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 905; distinct from arrival timing / 3v2 width.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'fixer feet fixed or not',
      decisionCaused: 'hold wide',
      changedCueForB: 'feet already fixed → immediate cut',
    },
  }),
  f({
    familyKey: 'lw_recovering_defender_race',
    teachingArea: 'finish_pressure',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Finish before the recovering defender closes when take-off is free — do not wait for a perfect GK read that arrives too late.',
    startingGeometry: 'LW free catch; recovering WD/half outside contest distance.',
    primaryCue: null,
    decisionFork: 'Finish now vs wait for GK micro-read vs recycle.',
    optimalDecision: 'Take off/finish now.',
    goodConditionalDecision: 'Recycle if defender closes inside contest distance before jump.',
    whyBNotA: 'Still too far to contest.',
    whyLWCurriculum: 'Race-to-finish; distinct from 6v5 free finish and closed take-off.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_944',
    closestRwGold: 'scn_bank_882 / 878',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 882; distinct from numerical 6v5_free_finish.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_6v5_free_finish',
    teachingArea: 'numerical',
    attackOrDefence: 'Attack',
    system: 'Mixed',
    numerical: '6v5',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'In 6v5, when LB has drawn two on the left and you are free with late help, finish.',
    startingGeometry: '6v5; LB drew two; LW free on left; help late.',
    primaryCue: 'Two on LB + LW free + help late.',
    decisionFork: 'Finish now vs enter as second pivot vs recycle.',
    optimalDecision: 'Finish now.',
    goodConditionalDecision: 'Stay wide/ask if help recovers inside contest before catch.',
    whyBNotA: 'You are free with late help.',
    whyLWCurriculum: 'Complements 948 stay-wide-vs-entry with free-finish when advantage is real.',
    lwNativity: 'STRONGLY LW NATIVE',
    closestLwPilot: 'scn_bank_948',
    closestRwGold: 'scn_bank_878 / 917',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not 948; LB-drew-two left picture differentiates from RW 878.',
    mirrorTest: 'CONTEXTUAL',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'LB drew two + free + late help',
      decisionCaused: 'finish',
      changedCueForB: 'help recovers to contest → stay/ask',
    },
  }),
  f({
    familyKey: 'lw_5v6_safe_possession',
    teachingArea: 'numerical',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '5v6',
    difficulty: 'Expert',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In 5v6, do not donate a counter from the corner — hold width as safe release.',
    startingGeometry: 'Short-handed attack; LW on left corner; defence set.',
    primaryCue: null,
    decisionFork: 'Hold safe width vs force corner shot vs speculative entry.',
    optimalDecision: 'Hold width as safe release; do not force.',
    goodConditionalDecision: 'Finish only if a clearly free take-off with no recovery contest is stated.',
    whyBNotA: 'Free take-off not stated — short-handed risk applies.',
    whyLWCurriculum: 'Numerical risk — perception false.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_948',
    closestRwGold: 'scn_bank_910',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 910; essential 5v6 possession.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_7v6_or_empty_opp',
    teachingArea: 'numerical',
    attackOrDefence: 'Attack',
    system: 'Mixed',
    numerical: '7v6',
    difficulty: 'Expert',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'With an extra attacker (or empty opp goal), only finish from the wing if the first action is truly clean — otherwise let the extra work elsewhere.',
    startingGeometry: '7v6 or empty opp; LW receives on left; wing covered in base picture.',
    primaryCue: null,
    decisionFork: 'Short return vs immediate finish vs force covered wing.',
    optimalDecision: 'Short return — let extra attacker work elsewhere.',
    goodConditionalDecision:
      'Finish immediately if catch clean and take-off free (especially empty opp net).',
    whyBNotA: 'Base picture covered / not clean.',
    whyLWCurriculum: 'One 7v6/empty-opp family only — no farm.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_948',
    closestRwGold: 'scn_bank_912 / 913 / 915',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Compresses RW 912/913/915 into one A/B-by-cleanliness family.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_empty_own_safe_return',
    teachingArea: 'empty_goal',
    attackOrDefence: 'Attack',
    system: 'Mixed',
    numerical: '7v6',
    difficulty: 'Expert',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'With own GK out, prefer safe short return to LB unless the wing finish is immediately clean.',
    startingGeometry: 'Own GK out; LW on left with contested/late take-off.',
    primaryCue: null,
    decisionFork: 'Safe return vs force finish vs enter.',
    optimalDecision: 'Short safe return to LB.',
    goodConditionalDecision: 'Finish only if catch clean and take-off free before recovery contests.',
    whyBNotA: 'Extra step/contest stated — return required.',
    whyLWCurriculum: 'Attack empty-own risk — distinct from defence 950.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_950',
    closestRwGold: 'scn_bank_879 / 914',
    closestOtherGold: 'LB own empty goal',
    semanticDuplicateAssessment: 'Related RW 879; distinct phase from 950.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_passive_warning',
    teachingArea: 'passive',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'On passive warning, create a real end: finish a clear left lane — no panic tour.',
    startingGeometry: 'Passive warning active; left wing lane/take-off clear in base picture.',
    primaryCue: 'Left wing lane/take-off is clear under passive.',
    decisionFork: 'Finish clear lane vs immediate short return if closed vs keep swinging.',
    optimalDecision: 'Finish now through the clear wing lane.',
    goodConditionalDecision:
      'Immediate short return if lane closed with time for one more inside action.',
    whyBNotA: 'Base picture lane is clear.',
    whyLWCurriculum: 'Passive uses game state to force end quality.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_948',
    closestRwGold: 'scn_bank_923 / 924',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Combines RW 923/924 via clear-vs-closed cue split.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'lane clear under passive',
      decisionCaused: 'finish',
      changedCueForB: 'lane closed → short return',
    },
  }),
  f({
    familyKey: 'lw_late_lead_risk',
    teachingArea: 'late_game',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Expert',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Protecting a late lead: do not gift a counter from a marginal wing action — safe return.',
    startingGeometry: 'Late lead by 1; LW receives contested/marginal picture.',
    primaryCue: null,
    decisionFork: 'Safe return vs force wing shot vs speculative entry.',
    optimalDecision: 'Safe return to LB; keep possession.',
    goodConditionalDecision: 'Finish only if chance is clearly free.',
    whyBNotA: 'Picture marginal — lead protection applies.',
    whyLWCurriculum: 'Lead risk management — game state changes decision.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_948',
    closestRwGold: 'scn_bank_921',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 921; not short-clock clone.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_late_trail_create',
    teachingArea: 'late_game',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Expert',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Trailing late: take the clean high-percentage left-wing chance — do not recycle a free finish.',
    startingGeometry: 'Late trail; LW has clean catch and free take-off.',
    primaryCue: null,
    decisionFork: 'Take finish now vs recycle vs wait for perfect GK.',
    optimalDecision: 'Take the finish now.',
    goodConditionalDecision: 'Recycle only if take-off is contested/covered.',
    whyBNotA: 'Clean free chance stated.',
    whyLWCurriculum: 'Opposite risk posture to late_lead.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_944',
    closestRwGold: 'scn_bank_922',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 922; distinct from lead/short-clock.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_short_clock',
    teachingArea: 'late_game',
    attackOrDefence: 'Attack',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Expert',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Short clock / last possession: one decision from the stated picture — secure bad catch and return.',
    startingGeometry: 'Few seconds; LW involved; catch bad/pressured in base picture.',
    primaryCue: null,
    decisionFork: 'Secure and return vs force release vs hold for perfect.',
    optimalDecision: 'Secure the ball and short return to LB.',
    goodConditionalDecision:
      'Finish immediately if catch already clean and take-off free with no time to recycle.',
    whyBNotA: 'Base picture bad/pressured catch.',
    whyLWCurriculum: 'Clock control distinct from score-based lead/trail.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_946',
    closestRwGold: 'scn_bank_925 / 926',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Compresses RW late-possession clock families.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_sys_33_pressure_release',
    teachingArea: 'system',
    attackOrDefence: 'Attack',
    system: '3-3',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Under 3:3 man pressure, demand the fast wide release and attack before the next slide.',
    startingGeometry: '3:3; pressure on LB; LW width available; wide defender not yet arrived.',
    primaryCue: null,
    decisionFork: 'Demand fast wide pass/attack vs crowd inside vs wait.',
    optimalDecision: 'Demand fast pass wide and attack before the slide.',
    goodConditionalDecision: 'Hold without asking if the wide defender has already arrived on you.',
    whyBNotA: 'Wide defender has not arrived yet.',
    whyLWCurriculum: '3:3 changes timing vs 6:0 — system-earned.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_942',
    closestRwGold: 'scn_bank_936',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 936; not 6:0/5:1 ask clone.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_sys_42_corridor',
    teachingArea: 'system',
    attackOrDefence: 'Attack',
    system: '4-2',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In 4:2, attack the free left corridor timing created by front/back gap before WD turns back.',
    startingGeometry: '4:2 front/back gap opens left corridor to LW.',
    primaryCue: null,
    decisionFork: 'Take corridor finish now vs wait vs enter deeper.',
    optimalDecision: 'Take off/finish the free corridor now.',
    goodConditionalDecision: 'Recycle if WD has already closed the corridor.',
    whyBNotA: 'Corridor still open.',
    whyLWCurriculum: '4:2 changes gap geometry — system-earned.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_944',
    closestRwGold: 'scn_bank_937',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Related RW 937; sole 4:2 family.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_sys_15_outlet_width',
    teachingArea: 'system',
    attackOrDefence: 'Attack',
    system: '1-5',
    numerical: '6v6',
    difficulty: 'Beginner',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Against 1:5 deep pressure, keep outlet width on the left — do not step into the pressure pocket.',
    startingGeometry: '1:5; deep pressure; LW outlet on left.',
    primaryCue: null,
    decisionFork: 'Hold outlet width vs step into pressure vs early entry.',
    optimalDecision: 'Keep outlet width under deep pressure.',
    goodConditionalDecision: 'Come short only if LB is trapped and needs a short angle escape.',
    whyBNotA: 'Trap/escape need not stated.',
    whyLWCurriculum: '1:5 outlet job — system-earned; perception false.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_941',
    closestRwGold: 'scn_bank_940 is defence 1-5 — different',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not RW 940 defence chase.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 2,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_sys_5plus1_trap',
    teachingArea: 'system',
    attackOrDefence: 'Attack',
    system: '5+1',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Against 5+1, do not walk the long-range trap on the left — refuse the baited wide action into the advanced pair.',
    startingGeometry: '5+1 advanced trap oriented to left side.',
    primaryCue: null,
    decisionFork: 'Refuse trap and recycle/hold vs walk into trap vs force wing.',
    optimalDecision: 'Do not walk into the trap; keep safe left structure.',
    goodConditionalDecision: 'Attack the wing only if the trap has clearly jumped elsewhere.',
    whyBNotA: 'Trap is live on your side.',
    whyLWCurriculum: '5+1 changes threat — system-earned; perception false.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_942',
    closestRwGold: 'no direct RW 5+1 twin',
    closestOtherGold: 'CB/LB trap-awareness',
    semanticDuplicateAssessment: 'No RW semantic twin.',
    mirrorTest: 'CONTEXTUAL',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_sys_4plus2_lane',
    teachingArea: 'system',
    attackOrDefence: 'Attack',
    system: '4+2',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Against 4+2, choose the open left lane between the two advanced defenders — do not force the closed one.',
    startingGeometry: 'Two advanced defenders; one left lane open, one closed.',
    primaryCue: 'Which left lane between advanced pair is open.',
    decisionFork: 'Attack open lane vs force closed lane vs retreat.',
    optimalDecision: 'Attack the open left lane.',
    goodConditionalDecision: 'Recycle if both lanes close before the catch.',
    whyBNotA: 'One lane is open.',
    whyLWCurriculum: '4+2 lane-choice — system-earned; distinct from 4:2 corridor.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_944',
    closestRwGold: 'no clear RW 4+2 twin',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'No RW twin; distinct from 4:2.',
    mirrorTest: 'CONTEXTUAL',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'open vs closed lane between advanced pair',
      decisionCaused: 'attack open lane',
      changedCueForB: 'both close → recycle',
    },
  }),
  f({
    familyKey: 'lw_sys_open_man_help',
    teachingArea: 'system',
    attackOrDefence: 'Attack',
    system: 'Open',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In open/man defence, if help arrives into your isolation, reject crowding — recycle.',
    startingGeometry: 'Open defence; LW had space; help now arrives inside 2m.',
    primaryCue: null,
    decisionFork: 'Recycle vs force 1v1 into help vs enter.',
    optimalDecision: 'Reject crowding; recycle to LB.',
    goodConditionalDecision: 'Continue 1v1 only if help still >2m.',
    whyBNotA: 'Help arrived inside 2m.',
    whyLWCurriculum: 'Opposite condition to lw_1v1_wing_space.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'none direct',
    closestRwGold: 'sparse',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Pair with 1v1; not duplicate.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 2,
    classification: 'STRONG',
    perceptionDetail: null,
  }),

  // Defence 14
  f({
    familyKey: 'lw_def_sys_60_wing_job',
    teachingArea: 'system_defence',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Beginner',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In set 6:0, primary job is the opposing wing — do not freelance to ball first.',
    startingGeometry: 'Set 6:0; ball far; opp wing width on your side.',
    primaryCue: null,
    decisionFork: 'Hold wing responsibility vs chase far ball vs purposeless corner drop.',
    optimalDecision: 'Primary wing job first.',
    goodConditionalDecision: 'Help inside only after half communication/cover is real.',
    whyBNotA: 'No handover/cover stated.',
    whyLWCurriculum: 'Foundation set-defence — perception false.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'none',
    closestRwGold: 'foundation behind 880, not same expert protect+help',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not RW 880 live protect-until-handover.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 2,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_def_protect_opp_wing',
    teachingArea: 'set_defence',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Beginner',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Deny the pass to the opposing wing on your side when the ball path opens toward that skip.',
    startingGeometry: 'LW defends left; ball moving toward opp RW skip.',
    primaryCue: 'Ball path opening toward opp wing on your side.',
    decisionFork: 'Body on wing pass lane vs jump middle ball vs watch from corner.',
    optimalDecision: 'Deny wing pass with body on the lane.',
    goodConditionalDecision: 'Step to ball only after half takes the wing by contact and call.',
    whyBNotA: 'No handover stated.',
    whyLWCurriculum: 'Live lane-deny; distinct from basic job and handover.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'none',
    closestRwGold: 'scn_bank_880',
    closestOtherGold: null,
    semanticDuplicateAssessment:
      'Related RW 880. Beginner lane-deny focus; B=handover release. Coach risk noted.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 5,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'ball path to opp wing',
      decisionCaused: 'deny lane',
      changedCueForB: 'half takes wing by contact+call → help ball',
    },
  }),
  f({
    familyKey: 'lw_def_inside_help_controlled',
    teachingArea: 'set_defence',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Give controlled inside help on a left-side drive without abandoning the wing pass.',
    startingGeometry: 'Opp drive between LW and half; opp wing still a pass threat.',
    primaryCue: 'Drive threat inside + opp wing still pass-threat distance.',
    decisionFork: 'Half-step help with chest on wing lane vs full abandon vs no help.',
    optimalDecision: 'Controlled help distance; keep chest/feel on wing lane.',
    goodConditionalDecision: 'Full leave only after real handover.',
    whyBNotA: 'Handover not stated; wing still threatened.',
    whyLWCurriculum: 'Help-without-abandon — not help-then-recover.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_949',
    closestRwGold: 'scn_bank_928 / 934',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Distinct from 949 and when_not_abandon.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'drive + wing still threatened',
      decisionCaused: 'controlled help',
      changedCueForB: 'real handover → can leave',
    },
  }),
  f({
    familyKey: 'lw_def_handover_timing',
    teachingArea: 'handover',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Release the wing runner only after handover with the half is real (contact + call).',
    startingGeometry: 'LW on opp wing; half arriving without completed contact/call in base picture.',
    primaryCue: 'Half contact/call absent (base) vs present (B).',
    decisionFork: 'Hold wing until real handover vs release early vs never release.',
    optimalDecision: 'Hold until contact+call, then release.',
    goodConditionalDecision: 'Release immediately only if half already has contact and has called ownership.',
    whyBNotA: 'Base picture handover not yet real.',
    whyLWCurriculum: 'Handover timing — distinct from protect and help.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'none',
    closestRwGold: 'scn_bank_880 / 928',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Focus is release timing, not protect-first.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'half contact+call present/absent',
      decisionCaused: 'hold until real handover',
      changedCueForB: 'contact+call present → release',
    },
  }),
  f({
    familyKey: 'lw_def_when_not_abandon',
    teachingArea: 'set_defence',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'When ball reverses to the open opp wing and inside help is already present, do NOT abandon the wing.',
    startingGeometry: 'Ball reversing to opp RW; inside already helped; LW tempted to chase middle.',
    primaryCue: 'Ball reverse to open wing + inside help already present.',
    decisionFork: 'Stay on wing vs chase middle vs foul.',
    optimalDecision: 'Stay; deny the wing.',
    goodConditionalDecision: 'Leave only if half has fully taken the wing and calls you to ball.',
    whyBNotA: 'Half has not taken the wing.',
    whyLWCurriculum: 'Do-not-abandon — opposite temptation to over-help.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_949',
    closestRwGold: 'scn_bank_934',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Distinct from controlled help and 949.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'ball reverse + inside already helped',
      decisionCaused: 'stay on wing',
      changedCueForB: 'half owns wing by call → can leave',
    },
  }),
  f({
    familyKey: 'lw_def_lb_wing_coop',
    teachingArea: 'set_defence',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Defend opposing LB–wing cooperation: when opp LB binds you then looks wing, keep chest on the pass and communicate half.',
    startingGeometry: 'Opp LB engages LW defender then looks to opp RW; half nearby.',
    primaryCue: 'Opp LB bind-then-look to wing.',
    decisionFork: 'Chest on pass + call half vs jump LB ball vs drop early.',
    optimalDecision: 'Body/chest on pass lane + communicate half.',
    goodConditionalDecision: 'Jump ball only if half has taken the wing runner.',
    whyBNotA: 'Half has not taken wing.',
    whyLWCurriculum: 'Left-side LB–wing defensive cooperation.',
    lwNativity: 'STRONGLY LW NATIVE',
    closestLwPilot: 'scn_bank_942 (attack coop inverse)',
    closestRwGold: 'scn_bank_932',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Specific bind-then-look pattern; not generic protect.',
    mirrorTest: 'CONTEXTUAL',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'LB bind then look wing',
      decisionCaused: 'chest on pass + call',
      changedCueForB: 'half takes wing → jump ball',
    },
  }),
  f({
    familyKey: 'lw_def_wing_entry',
    teachingArea: 'set_defence',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Beginner',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Deny the opposing wing’s entry path when he starts behind you — contact/path deny, not ball-watch.',
    startingGeometry: 'Opp wing starts entry behind LW defender toward six.',
    primaryCue: null,
    decisionFork: 'Deny path with contact feel vs ball-watch vs drop without contact.',
    optimalDecision: 'Contact/deny entry path.',
    goodConditionalDecision: 'Release path only after half takes the runner.',
    whyBNotA: 'No takeover stated.',
    whyLWCurriculum: 'Defend entry — distinct from back-door deny during drive.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'none',
    closestRwGold: 'backdoor defence themes',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Distinct from def_backdoor_deny.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_def_backdoor_deny',
    teachingArea: 'set_defence',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'When a drive pulls your eyes, keep contact feel and deny the back-door runner.',
    startingGeometry: 'Opp drive pulls eyes; opp wing starts back-door behind LW.',
    primaryCue: 'Drive pulls eyes + wing starts back-door cut.',
    decisionFork: 'Keep contact deny back-door vs fully chase drive vs drop away.',
    optimalDecision: 'Deny back-door with contact feel.',
    goodConditionalDecision: 'Jump ball only after teammate takeover of runner.',
    whyBNotA: 'No takeover.',
    whyLWCurriculum:
      'Essential set-defence fundamental missing from locked pilot (earlier draft replaced).',
    lwNativity: 'UNIVERSAL',
    closestLwPilot: 'not in 941-950',
    closestRwGold: 'scn_bank_932 / 934 themes',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Not def_wing_entry; not 949. Marked UNIVERSAL but essential.',
    mirrorTest: 'FAILS_NATIVE_STRICT — teaching survives flip; kept as essential UNIVERSAL',
    coachRisk: 5,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'drive pulls eyes + back-door start',
      decisionCaused: 'deny runner',
      changedCueForB: 'teammate takeover → jump ball',
    },
  }),
  f({
    familyKey: 'lw_def_comm_half',
    teachingArea: 'communication',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '6v6',
    difficulty: 'Beginner',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'Communicate with the half before you leave the wing — help only after confirmed cover.',
    startingGeometry: 'Temptation to help inside; half nearby but no confirmed cover call.',
    primaryCue: null,
    decisionFork: 'Call/confirm then help vs silent leave vs never help.',
    optimalDecision: 'Communicate first; leave only after confirmed cover.',
    goodConditionalDecision: 'Leave without call only if half already has clear contact ownership visibly completed.',
    whyBNotA: 'Confirmed cover not stated.',
    whyLWCurriculum: 'Communication responsibility — perception false.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'none',
    closestRwGold: 'implied in 880/928',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Responsibility family; not help/recover clone.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 2,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_def_trans_own_side_lane',
    teachingArea: 'transition_defence',
    attackOrDefence: 'Defence',
    system: 'Mixed',
    numerical: 'transition',
    difficulty: 'Intermediate',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'After a normal-position turnover, close your own-side pass lane first — do not chase the far skip without a map.',
    startingGeometry:
      'Turnover; LW recovering from normal left-wing defensive/attacking width (NOT second-pivot start); own-side outlet live.',
    primaryCue: 'Own-side outlet runner live; far skip also possible.',
    decisionFork: 'Cut own-side lane first vs chase far skip vs freeze.',
    optimalDecision: 'Sprint cut own-side pass lane first.',
    goodConditionalDecision: 'Take far skip only if a teammate already owns your side lane.',
    whyBNotA: 'Teammate does not own your side lane.',
    whyLWCurriculum:
      'Normal-start transition defence — distinct from 949 second-pivot recovery start.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_949',
    closestRwGold: 'scn_bank_929 / 930',
    closestOtherGold: null,
    semanticDuplicateAssessment:
      'Related RW 929/930. Distinct start geometry from 949 (second pivot).',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'own-side outlet live; no teammate on that lane',
      decisionCaused: 'cut own-side first',
      changedCueForB: 'teammate owns own-side → far skip allowed',
    },
  }),
  f({
    familyKey: 'lw_def_trans_far_skip_with_map',
    teachingArea: 'transition_defence',
    attackOrDefence: 'Defence',
    system: 'Mixed',
    numerical: 'transition',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    primaryTeachingObjective:
      'Take the far skip only when teammate map shows your own-side lane is already covered.',
    startingGeometry: 'Transition; far-wing skip real; teammate map stated covering own side.',
    primaryCue: 'Teammate locations: own-side covered; far skip live.',
    decisionFork: 'Cut far skip vs protect own wing vs chase ball carrier.',
    optimalDecision: 'Cut the far skip.',
    goodConditionalDecision: 'Protect own wing if teammate map does NOT cover your side.',
    whyBNotA: 'Map shows own-side covered.',
    whyLWCurriculum: 'Pair with own-side lane — opposite map condition. Not another recover-after-help.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_949',
    closestRwGold: 'scn_bank_931 / 933',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'Requires teammate map; distinct from own-side-first family.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: {
      cueObserved: 'teammate map covers own side + far skip live',
      decisionCaused: 'cut far skip',
      changedCueForB: 'own side not covered → protect own wing',
    },
  }),
  f({
    familyKey: 'lw_def_sys_51_vs_advance',
    teachingArea: 'system_defence',
    attackOrDefence: 'Defence',
    system: '5-1',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In 5:1, the advanced defender changes your wing help/stay job — do not defend it like a flat 6:0.',
    startingGeometry: '5:1; advanced defender interactions with your left side stated.',
    primaryCue: null,
    decisionFork: 'Stay/help pattern required by 5:1 vs 6:0 habit chase.',
    optimalDecision: 'Play the 5:1-specific stay/help from the stated advanced picture.',
    goodConditionalDecision: 'Revert to standard wing deny if advanced defender is out of your side entirely.',
    whyBNotA: 'Advanced defender is affecting your side.',
    whyLWCurriculum: 'System defence — 5:1 changes decision vs 6:0.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_942',
    closestRwGold: 'sparse RW 5:1 defence',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'No RW defence twin with same fork.',
    mirrorTest: 'CONTEXTUAL',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_def_sys_33_switch',
    teachingArea: 'system_defence',
    attackOrDefence: 'Defence',
    system: '3-3',
    numerical: '6v6',
    difficulty: 'Advanced',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In 3:3, apply the stated team switch/stay rule on the wing runner — do not freestyle.',
    startingGeometry: '3:3 man pressure; runner crossing; team switch rule stated in situation.',
    primaryCue: null,
    decisionFork: 'Switch vs stay per stated rule vs ignore rule and chase ball.',
    optimalDecision: 'Execute the stated switch/stay rule.',
    goodConditionalDecision: 'Opposite action only if situation states the opposite team rule.',
    whyBNotA: 'Base picture states one rule.',
    whyLWCurriculum: '3:3 system defence — rule must be in situation text.',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'none',
    closestRwGold: 'scn_bank_936 is attack',
    closestOtherGold: null,
    semanticDuplicateAssessment: 'No RW defence twin; system-earned.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 3,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
  f({
    familyKey: 'lw_def_numerical_5v6',
    teachingArea: 'numerical_defence',
    attackOrDefence: 'Defence',
    system: '6-0',
    numerical: '5v6',
    difficulty: 'Expert',
    perception: false,
    handedness: 'none',
    primaryTeachingObjective:
      'In 5v6 defence, protect the most dangerous stated pass first — do not gamble the wing randomly.',
    startingGeometry: 'Down a defender; most dangerous pass explicitly stated in situation.',
    primaryCue: null,
    decisionFork: 'Cover stated priority pass vs gamble wing chase vs early foul.',
    optimalDecision: 'Protect the stated most dangerous pass first.',
    goodConditionalDecision: 'Shift only if that priority pass is removed and a new priority is stated.',
    whyBNotA: 'Priority pass still live as stated.',
    whyLWCurriculum: 'Numerical defence prioritization — perception false (stated priority/role).',
    lwNativity: 'CONTEXTUALLY LW NATIVE',
    closestLwPilot: 'scn_bank_950',
    closestRwGold: 'scn_bank_931 first-wave themes',
    closestOtherGold: 'CB 5v6/collapse families',
    semanticDuplicateAssessment: 'Priority-from-stated-threat; not empty-own 950.',
    mirrorTest: 'UNIVERSAL_PRINCIPLE_SURVIVES',
    coachRisk: 4,
    classification: 'STRONG',
    perceptionDetail: null,
  }),
];

if (families.length !== 49) {
  throw new Error(`Expected 49 families, got ${families.length}`);
}

const keys = new Set();
for (const fam of families) {
  if (keys.has(fam.familyKey)) throw new Error(`Duplicate key ${fam.familyKey}`);
  keys.add(fam.familyKey);
  if (!['STRONG', 'QUESTIONABLE', 'REJECT'].includes(fam.classification)) {
    throw new Error(`Bad class ${fam.familyKey}`);
  }
  if (fam.perception && !fam.perceptionDetail) {
    throw new Error(`perception detail missing ${fam.familyKey}`);
  }
}

// Internal duplicate clusters (manual flags)
const internalDupPairs = [
  // none unresolved — document checked pairs
];
const checkedInternalPairs = [
  {
    a: 'lw_stay_wide_inside_help',
    b: 'lw_entry_when_not',
    status: 'distinct',
    reason: 'follow-inside temptation vs enter-to-six temptation',
  },
  {
    a: 'lw_1v1_wing_space',
    b: 'lw_sys_open_man_help',
    status: 'distinct',
    reason: 'opposite help-distance conditions',
  },
  {
    a: 'lw_sw_advantage_gone',
    b: 'pilot_947',
    status: 'distinct',
    reason: 'opposite keep/stop second-wave forks',
  },
  {
    a: 'lw_6v5_free_finish',
    b: 'pilot_948',
    status: 'distinct',
    reason: 'free finish vs stay-wide/entry-onto-pivot',
  },
  {
    a: 'lw_def_inside_help_controlled',
    b: 'lw_def_when_not_abandon',
    status: 'distinct',
    reason: 'help distance vs do-not-leave on reverse',
  },
  {
    a: 'lw_def_wing_entry',
    b: 'lw_def_backdoor_deny',
    status: 'distinct',
    reason: 'entry path start vs ball-watch during drive',
  },
  {
    a: 'lw_def_trans_own_side_lane',
    b: 'pilot_949',
    status: 'distinct',
    reason: 'normal start vs second-pivot start',
  },
  {
    a: 'lw_def_trans_own_side_lane',
    b: 'lw_def_trans_far_skip_with_map',
    status: 'distinct',
    reason: 'opposite teammate-map conditions',
  },
  {
    a: 'lw_gk_near_post_commit',
    b: 'lw_gk_far_side_commit',
    status: 'distinct',
    reason: 'opposite commit → opposite finish side',
  },
  {
    a: 'lw_late_lead_risk',
    b: 'lw_late_trail_create',
    status: 'distinct',
    reason: 'opposite score-risk postures',
  },
  {
    a: 'lw_fw_3v2_hold_width',
    b: 'lw_fw_2v1_finish_or_pass',
    status: 'distinct',
    reason: '3v2 width vs 2v1 finish/pass',
  },
  {
    a: 'lw_recovering_defender_race',
    b: 'lw_6v5_free_finish',
    status: 'distinct',
    reason: '6v6 recovery race vs 6v5 LB-drew-two',
  },
];

// RW semantic risk register (related ≠ unresolved duplicate)
const rwRelated = families
  .filter((x) => /scn_bank_8(7[3-9]|8[0-3]|7[5-8]|9[0-3]|1[0-5]|2[1-6])/.test(x.closestRwGold || ''))
  .map((x) => ({
    familyKey: x.familyKey,
    closestRwGold: x.closestRwGold,
    assessment: x.semanticDuplicateAssessment,
    unresolvedDuplicate: false,
  }));

const unresolvedRwDups = rwRelated.filter((x) => x.unresolvedDuplicate);
const unresolvedInternal = checkedInternalPairs.filter((x) => x.status !== 'distinct');
const rejects = families.filter((x) => x.classification === 'REJECT');
const questionable = families.filter((x) => x.classification === 'QUESTIONABLE');
const strong = families.filter((x) => x.classification === 'STRONG');

const pilotNativity = {
  lw_width_hold_true_width: 'CONTEXTUALLY LW NATIVE',
  lw_lb_51_outlet_ask_now: 'STRONGLY LW NATIVE',
  lw_wd_feet_decide_first_move: 'CONTEXTUALLY LW NATIVE',
  lw_takeoff_321_half_steps: 'STRONGLY LW NATIVE',
  lw_second_pivot_release_to_width: 'STRONGLY LW NATIVE',
  lw_gk_stepout_hands_high_soft_inside: 'STRONGLY LW NATIVE',
  lw_sw_left_wd_late_one_more: 'STRONGLY LW NATIVE',
  lw_6v5_stay_wide_vs_entry_pivot: 'STRONGLY LW NATIVE',
  lw_def_recover_wing_from_second_pivot_turnover: 'STRONGLY LW NATIVE',
  lw_def_empty_own_fill_from_second_pivot_turnover: 'STRONGLY LW NATIVE',
};

const pilotMeta = pilots.map((p, i) => ({
  id: `scn_bank_${941 + i}`,
  familyKey: p.familyKey,
  attackOrDefence: p.attackOrDefence,
  difficulty: p.difficulty,
  perception: p.perception,
  handedness: p.handedness || 'none',
  system: p.defensiveSystem,
  numerical: p.numerical,
  lwNativity: pilotNativity[p.familyKey] || 'CONTEXTUALLY LW NATIVE',
}));

const countBy = (arr, keyFn) =>
  arr.reduce((acc, x) => {
    const k = keyFn(x);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

const remainingAttack = families.filter((x) => x.attackOrDefence === 'Attack').length;
const remainingDefence = families.filter((x) => x.attackOrDefence === 'Defence').length;
const finalAttack = remainingAttack + pilotMeta.filter((p) => p.attackOrDefence === 'Attack').length;
const finalDefence = remainingDefence + pilotMeta.filter((p) => p.attackOrDefence === 'Defence').length;

const remDiff = countBy(families, (x) => x.difficulty);
const pilDiff = countBy(pilotMeta, (x) => x.difficulty);
const finalDiff = {
  Beginner: (remDiff.Beginner || 0) + (pilDiff.Beginner || 0),
  Intermediate: (remDiff.Intermediate || 0) + (pilDiff.Intermediate || 0),
  Advanced: (remDiff.Advanced || 0) + (pilDiff.Advanced || 0),
  Expert: (remDiff.Expert || 0) + (pilDiff.Expert || 0),
};

const remPercTrue = families.filter((x) => x.perception).length;
const pilPercTrue = pilotMeta.filter((p) => p.perception).length;
const finalPercTrue = remPercTrue + pilPercTrue;
const finalTotal = families.length + pilotMeta.length;
const finalPercPct = Math.round((finalPercTrue / finalTotal) * 100);

const remHand = countBy(families, (x) => x.handedness);
const pilHand = countBy(pilotMeta, (x) => x.handedness);
const finalHand = {
  none: (remHand.none || 0) + (pilHand.none || 0),
  left: (remHand.left || 0) + (pilHand.left || 0),
  right: (remHand.right || 0) + (pilHand.right || 0),
};

const systems = countBy(
  [...families, ...pilotMeta.map((p) => ({ system: p.system }))],
  (x) => x.system || 'null',
);
const numericals = countBy(families, (x) => x.numerical);
const nativityRem = countBy(families, (x) => x.lwNativity);
const nativityPil = countBy(pilotMeta, (x) => x.lwNativity);
const nativityFinal = {
  'STRONGLY LW NATIVE':
    (nativityRem['STRONGLY LW NATIVE'] || 0) + (nativityPil['STRONGLY LW NATIVE'] || 0),
  'CONTEXTUALLY LW NATIVE':
    (nativityRem['CONTEXTUALLY LW NATIVE'] || 0) + (nativityPil['CONTEXTUALLY LW NATIVE'] || 0),
  UNIVERSAL: (nativityRem.UNIVERSAL || 0) + (nativityPil.UNIVERSAL || 0),
};

const highestRisk = [...families].sort((a, b) => b.coachRisk - a.coachRisk).slice(0, 8);

const blockers = [];
if (!locks.allOk) blockers.push('locked bank hash/count changed');
if (families.length !== 49) blockers.push(`count ${families.length} != 49`);
if (rejects.length) blockers.push(`REJECT=${rejects.length}`);
if (questionable.length) blockers.push(`QUESTIONABLE=${questionable.length}`);
if (unresolvedRwDups.length) blockers.push(`unresolved RW dups=${unresolvedRwDups.length}`);
if (unresolvedInternal.length) blockers.push(`unresolved internal dups=${unresolvedInternal.length}`);
if (finalPercPct < 55 || finalPercPct > 65) {
  blockers.push(`perception projection ${finalPercPct}% outside 55-65`);
}
if (finalDiff.Beginner < 8 || finalDiff.Beginner > 12) {
  blockers.push(`Beginner ${finalDiff.Beginner} outside soft 8-12`);
}
if (finalDiff.Expert > 10) blockers.push(`Expert ${finalDiff.Expert} > 10`);
if (finalDefence < 14) blockers.push(`defence ${finalDefence} < 14`);
if (nativityFinal.UNIVERSAL > 8) blockers.push(`universal ${nativityFinal.UNIVERSAL} dominates`);
if (strong.length !== 49) blockers.push(`STRONG ${strong.length} != 49`);

// A/B ambiguity check: whyBNotA must exist
const abAmbiguous = families.filter((x) => !x.whyBNotA || !x.goodConditionalDecision);
if (abAmbiguous.length) blockers.push(`A/B incomplete=${abAmbiguous.length}`);

const verdict =
  blockers.length === 0 ? 'LW 49 FAMILY MATRIX APPROVED' : 'LW FAMILY MATRIX NEEDS REVISION';

const coverage = {
  positionalAttack: {
    trueWidth: ['pilot_941', 'lw_width_stretch_when_lb_binds'],
    stayWide: ['lw_stay_wide_inside_help'],
    entry: ['lw_entry_when_space_opens', 'lw_entry_when_not'],
    backdoor: ['lw_backdoor_ball_watch'],
    takeoff: ['pilot_944', 'lw_takeoff_lane_closed', 'lw_pivot_block_opens_takeoff'],
    lbCoop: ['pilot_942', 'lw_lb_delay_ask_lane_blocked'],
    pivot: ['lw_pivot_block_opens_takeoff', 'lw_pivot_feed_vs_finish'],
    oneVone: ['lw_1v1_wing_space'],
    secondPivot: ['pilot_945', 'pilot_949', 'pilot_950'],
  },
  goalkeeper: {
    stepOutHands: ['pilot_946'],
    nearCommit: ['lw_gk_near_post_commit'],
    farCommit: ['lw_gk_far_side_commit'],
    depth: ['lw_gk_depth_read'],
    lateMovement: ['lw_gk_late_movement_patience'],
    extremeAngle: ['lw_gk_extreme_angle_body'],
  },
  transitionAttack: {
    arrival: ['lw_fw_arrival_timing'],
    twoV1: ['lw_fw_2v1_finish_or_pass'],
    threeV2: ['lw_fw_3v2_hold_width'],
    secondWaveKeep: ['pilot_947'],
    secondWaveStop: ['lw_sw_advantage_gone'],
    laneVsRecovery: ['lw_trans_lane_vs_recovery'],
    recoveringRace: ['lw_recovering_defender_race'],
  },
  numericalGameState: {
    sixV5: ['pilot_948', 'lw_6v5_free_finish'],
    fiveV6Attack: ['lw_5v6_safe_possession'],
    sevenV6EmptyOpp: ['lw_7v6_or_empty_opp'],
    emptyOwnAttack: ['lw_empty_own_safe_return'],
    emptyOwnDefence: ['pilot_950'],
    passive: ['lw_passive_warning'],
    lateLead: ['lw_late_lead_risk'],
    lateTrail: ['lw_late_trail_create'],
    shortClock: ['lw_short_clock'],
  },
  systemsAttack: {
    '6-0': 'core many',
    '5-1': ['pilot_942'],
    '3-2-1': ['pilot_944'],
    '3-3': ['lw_sys_33_pressure_release'],
    '4-2': ['lw_sys_42_corridor'],
    '1-5': ['lw_sys_15_outlet_width'],
    '5+1': ['lw_sys_5plus1_trap'],
    '4+2': ['lw_sys_4plus2_lane'],
    Open: ['lw_1v1_wing_space', 'lw_sys_open_man_help'],
  },
  defence: {
    set60Job: ['lw_def_sys_60_wing_job'],
    protectWing: ['lw_def_protect_opp_wing'],
    controlledHelp: ['lw_def_inside_help_controlled'],
    handover: ['lw_def_handover_timing'],
    doNotAbandon: ['lw_def_when_not_abandon'],
    lbWingCoop: ['lw_def_lb_wing_coop'],
    wingEntry: ['lw_def_wing_entry'],
    backdoorDeny: ['lw_def_backdoor_deny'],
    commHalf: ['lw_def_comm_half'],
    transOwnSide: ['lw_def_trans_own_side_lane'],
    transFarSkip: ['lw_def_trans_far_skip_with_map'],
    sys51: ['lw_def_sys_51_vs_advance'],
    sys33: ['lw_def_sys_33_switch'],
    numerical5v6: ['lw_def_numerical_5v6'],
    secondPivotRecover: ['pilot_949'],
    emptyOwnFill: ['pilot_950'],
  },
  notes: [
    'No dedicated 3:2:1 defence family — attack 944 already earns 3:2:1 decision change; forcing defence sticker rejected.',
    'No dedicated open-defence defensive 1v1 family — attack open pair + set defence depth preferred over RW938 mirror.',
    '4:2 / 1:5 / 5+1 / 4+2 attack only where system changes LW decision.',
  ],
};

const remainingGaps = [
  'No late-tie-specific family (late lead/trail/short-clock cover game-state needs without score decoration).',
  'No dedicated block+GK cooperation defence family beyond GK attack curriculum — acceptable; block is pivot/attack-side.',
  '3:2:1 defence intentionally omitted (quality over system checklist).',
];

const matrix = {
  phase: 'FULL_LW_GOLD_BANK_BUILD / PHASE_2_FAMILY_MATRIX',
  status: verdict,
  generatedAt: new Date().toISOString(),
  locks: {
    LB: { count: locks.LB.count, hashOk: locks.LB.hashOk },
    RB: { count: locks.RB.count, hashOk: locks.RB.hashOk },
    CB: { count: locks.CB.count, hashOk: locks.CB.hashOk },
    RW: { count: locks.RW.count, hashOk: locks.RW.hashOk },
    allOk: locks.allOk,
  },
  pilotLocked: {
    count: 10,
    ids: pilotMeta.map((p) => p.id),
    rule: 'byte-identical — not redesigned here',
  },
  remainingFamilies: families,
  counts: {
    remaining: families.length,
    remainingAttack,
    remainingDefence,
    projectedFinalTotal: finalTotal,
    projectedAttack: finalAttack,
    projectedDefence: finalDefence,
    remainingDifficulty: remDiff,
    projectedDifficulty: finalDiff,
    remainingPerceptionTrue: remPercTrue,
    projectedPerceptionTrue: finalPercTrue,
    projectedPerceptionPct: finalPercPct,
    projectedHandedness: finalHand,
    systems,
    numericalsRemaining: numericals,
    nativityRemaining: nativityRem,
    nativityProjectedFinal: nativityFinal,
    classification: {
      STRONG: strong.length,
      QUESTIONABLE: questionable.length,
      REJECT: rejects.length,
    },
  },
  blockers,
  verdict,
};

const duplicateAudit = {
  phase: 'PHASE_2_DUPLICATE_AUDIT',
  vsPilot: checkedInternalPairs.filter((x) => String(x.b).startsWith('pilot_')),
  internalPairs: checkedInternalPairs,
  unresolvedInternalDuplicates: unresolvedInternal.length,
  rwRelatedButNotDuplicate: rwRelated,
  unresolvedRwSemanticDuplicates: unresolvedRwDups.length,
  lbRbCbNotes: [
    'LB gold contains empty-own attack and second-pivot themes — LW empty-own attack/defence kept phase-distinct.',
    'CB 5v6 collapse families related to lw_def_numerical_5v6 only at priority principle level; wing-specific framing kept.',
    'No RB semantic twins required for LW–LB partner families.',
  ],
  mirrorUniversalCountRemaining: families.filter((x) => x.lwNativity === 'UNIVERSAL').length,
  highestCoachRisk: highestRisk.map((x) => ({
    familyKey: x.familyKey,
    coachRisk: x.coachRisk,
    closestRwGold: x.closestRwGold,
  })),
};

const coverageDoc = {
  phase: 'PHASE_2_COVERAGE',
  projectedFinalTotal: finalTotal,
  attackDefence: { attack: finalAttack, defence: finalDefence },
  difficulty: finalDiff,
  perception: { true: finalPercTrue, pct: finalPercPct, target: [55, 65] },
  coverage,
  remainingArchitectureGaps: remainingGaps,
  systemCoverageNotes: coverage.notes,
};

writeFileSync(join(root, 'scripts/lw-gold-full-family-matrix.json'), JSON.stringify(matrix, null, 2) + '\n');
writeFileSync(
  join(root, 'scripts/lw-gold-full-family-duplicate-audit.json'),
  JSON.stringify(duplicateAudit, null, 2) + '\n',
);
writeFileSync(
  join(root, 'scripts/lw-gold-full-family-coverage.json'),
  JSON.stringify(coverageDoc, null, 2) + '\n',
);

const mdRows = families
  .map(
    (x) =>
      `| \`${x.familyKey}\` | ${x.teachingArea} | ${x.attackOrDefence} | ${x.system} | ${x.numerical} | ${x.difficulty} | ${x.perception} | ${x.handedness} | ${x.lwNativity} | ${x.coachRisk} | ${x.classification} |`,
  )
  .join('\n');

const md = `# Left Wing Gold — Phase 2 Full Family Matrix (49)

**Verdict: ${verdict}**

${blockers.length ? `### Blockers\n\n${blockers.map((b) => `- ${b}`).join('\n')}` : 'No blockers.'}

## Locks

| Bank | Count | Hash |
|---|---|---|
| LB | ${locks.LB.count} | ${locks.LB.hashOk ? 'unchanged' : 'CHANGED'} |
| RB | ${locks.RB.count} | ${locks.RB.hashOk ? 'unchanged' : 'CHANGED'} |
| CB | ${locks.CB.count} | ${locks.CB.hashOk ? 'unchanged' : 'CHANGED'} |
| RW | ${locks.RW.count} | ${locks.RW.hashOk ? 'unchanged' : 'CHANGED'} |

Pilot \`941–950\` byte-locked (not redesigned).

## Projected final bank (pilot + 49)

| Metric | Value |
|---|---|
| Total | **${finalTotal}** |
| Attack / Defence | **${finalAttack} / ${finalDefence}** |
| Difficulty | B${finalDiff.Beginner} / I${finalDiff.Intermediate} / A${finalDiff.Advanced} / E${finalDiff.Expert} |
| Perception | ${finalPercTrue}/${finalTotal} (**${finalPercPct}%**) |
| Handedness | none ${finalHand.none} |
| Strongly / Contextually / Universal | ${nativityFinal['STRONGLY LW NATIVE']} / ${nativityFinal['CONTEXTUALLY LW NATIVE']} / ${nativityFinal.UNIVERSAL} |
| Unresolved RW semantic dups | ${unresolvedRwDups.length} |
| Unresolved internal dups | ${unresolvedInternal.length} |
| Classification | STRONG ${strong.length} · QUESTIONABLE ${questionable.length} · REJECT ${rejects.length} |

## All 49 familyKeys

| familyKey | area | A/D | system | num | diff | perc | hand | nativity | risk | class |
|---|---|---|---|---|---|---|---|---|---|---|
${mdRows}

## Highest coach-risk

${highestRisk.map((x) => `- \`${x.familyKey}\` risk ${x.coachRisk} — ${x.closestRwGold}`).join('\n')}

## Remaining architecture gaps

${remainingGaps.map((g) => `- ${g}`).join('\n')}

## STOP

Phase 2 only. No scenario text. No \`scenarios.json\` writes. No legacy removal. No commit/tag/push/deploy.
`;

writeFileSync(join(root, 'scripts/lw-gold-full-family-matrix.md'), md);

console.log(
  JSON.stringify(
    {
      verdict,
      blockers,
      remaining: families.length,
      projectedFinal: finalTotal,
      attackDefence: [finalAttack, finalDefence],
      difficulty: finalDiff,
      perception: `${finalPercTrue}/${finalTotal} (${finalPercPct}%)`,
      nativity: nativityFinal,
      strong: strong.length,
      locksOk: locks.allOk,
    },
    null,
    2,
  ),
);
