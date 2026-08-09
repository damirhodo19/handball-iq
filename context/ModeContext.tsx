import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  getActiveMode,
  setActiveMode as persistActiveMode,
  canSwitchMode,
  type ActiveMode,
} from '@/lib/platform/active-mode';
import { resolveAppRole } from '@/lib/platform/personalization';
import { loadProfile } from '@/lib/storage';
import { pullPreferencesFromCloud, syncPreferencesToCloud } from '@/services/preferencesService';
import { useAuth } from '@/context/AuthContext';

interface ModeContextValue {
  activeMode: ActiveMode;
  isCoachMode: boolean;
  canSwitch: boolean;
  setMode: (mode: ActiveMode) => void;
  refreshMode: () => void;
}

const ModeContext = createContext<ModeContextValue | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeMode, setActiveModeState] = useState<ActiveMode>(() => getActiveMode());
  const [role, setRole] = useState(() => resolveAppRole(loadProfile()));

  const refreshMode = useCallback(() => {
    const nextRole = resolveAppRole(loadProfile());
    setRole(nextRole);
    setActiveModeState(getActiveMode());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user?.id) {
        await pullPreferencesFromCloud(user.id);
      }
      if (!cancelled) refreshMode();
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, refreshMode]);

  const setMode = useCallback(
    (mode: ActiveMode) => {
      const currentRole = resolveAppRole(loadProfile());
      if (currentRole === 'coach') {
        persistActiveMode('coach');
      } else if (currentRole === 'player' || currentRole === 'admin') {
        persistActiveMode('player');
      } else if (canSwitchMode(currentRole)) {
        persistActiveMode(mode);
      } else {
        persistActiveMode('player');
      }
      refreshMode();
      if (user?.id) {
        void syncPreferencesToCloud(user.id);
      }
    },
    [user?.id, refreshMode],
  );

  const canSwitch = canSwitchMode(role);
  const resolvedMode: ActiveMode =
    role === 'coach' ? 'coach' : role === 'player' || role === 'admin' ? 'player' : activeMode;
  const isCoachMode = role === 'coach' || (role === 'player_coach' && resolvedMode === 'coach');

  return (
    <ModeContext.Provider
      value={{
        activeMode: resolvedMode,
        isCoachMode,
        canSwitch,
        setMode,
        refreshMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
