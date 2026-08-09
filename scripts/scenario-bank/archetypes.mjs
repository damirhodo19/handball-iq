import { getGoalkeeperArchetypes } from './data/goalkeeper.mjs';
import { getLeftWingArchetypes, getRightWingArchetypes } from './data/wings.mjs';
import {
  getLeftBackArchetypes,
  getRightBackArchetypes,
  getCentreBackArchetypes,
} from './data/backs.mjs';
import {
  getPivotArchetypes,
  getDefenceArchetypes,
  getFastBreakArchetypes,
  getPowerPlayArchetypes,
  getShortHandedArchetypes,
  getMatchEndingArchetypes,
  getDecisionMakingArchetypes,
} from './data/team-tactics.mjs';

export function getAllArchetypes() {
  return [
    ...getGoalkeeperArchetypes(),
    ...getLeftWingArchetypes(),
    ...getRightWingArchetypes(),
    ...getLeftBackArchetypes(),
    ...getCentreBackArchetypes(),
    ...getRightBackArchetypes(),
    ...getPivotArchetypes(),
    ...getDefenceArchetypes(),
    ...getFastBreakArchetypes(),
    ...getPowerPlayArchetypes(),
    ...getShortHandedArchetypes(),
    ...getMatchEndingArchetypes(),
    ...getDecisionMakingArchetypes(),
  ];
}

export {
  getGoalkeeperArchetypes,
  getLeftWingArchetypes,
  getRightWingArchetypes,
  getLeftBackArchetypes,
  getCentreBackArchetypes,
  getRightBackArchetypes,
  getPivotArchetypes,
  getDefenceArchetypes,
  getFastBreakArchetypes,
  getPowerPlayArchetypes,
  getShortHandedArchetypes,
  getMatchEndingArchetypes,
  getDecisionMakingArchetypes,
};
