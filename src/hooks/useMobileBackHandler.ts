import { useEffect, useRef, useState } from 'react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { ActiveTab } from '../components/Navbar';
import { CalcVaultView } from '../types';

export interface UseMobileBackHandlerProps {
  currentApp: CurrentAppType;
  setCurrentApp: (app: CurrentAppType) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAppSwitcherOpen: boolean;
  setIsAppSwitcherOpen: (open: boolean) => void;
  isNavigatorOpen: boolean;
  setIsNavigatorOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isProjectXModalOpen: boolean;
  setIsProjectXModalOpen: (open: boolean) => void;
  isStealthActive: boolean;
  setIsStealthActive: (active: boolean) => void;
  vaultView: CalcVaultView;
  setVaultView: (view: CalcVaultView) => void;
}

export function useMobileBackHandler({
  currentApp,
  setCurrentApp,
  activeTab,
  setActiveTab,
  isAppSwitcherOpen,
  setIsAppSwitcherOpen,
  isNavigatorOpen,
  setIsNavigatorOpen,
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  isSearchOpen,
  setIsSearchOpen,
  isProjectXModalOpen,
  setIsProjectXModalOpen,
  isStealthActive,
  setIsStealthActive,
  vaultView,
  setVaultView,
}: UseMobileBackHandlerProps) {
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackTimeRef = useRef<number>(0);

  // Store latest state in ref to avoid stale closures inside popstate event
  const stateRef = useRef({
    currentApp,
    activeTab,
    isAppSwitcherOpen,
    isNavigatorOpen,
    isSettingsModalOpen,
    isSearchOpen,
    isProjectXModalOpen,
    isStealthActive,
    vaultView,
  });

  useEffect(() => {
    stateRef.current = {
      currentApp,
      activeTab,
      isAppSwitcherOpen,
      isNavigatorOpen,
      isSettingsModalOpen,
      isSearchOpen,
      isProjectXModalOpen,
      isStealthActive,
      vaultView,
    };
  }, [
    currentApp,
    activeTab,
    isAppSwitcherOpen,
    isNavigatorOpen,
    isSettingsModalOpen,
    isSearchOpen,
    isProjectXModalOpen,
    isStealthActive,
    vaultView,
  ]);

  // Ensure initial guard state in browser history on mount
  useEffect(() => {
    try {
      if (!window.history.state || window.history.state.bcaGuard !== 'root') {
        window.history.replaceState({ bcaGuard: 'root' }, '');
        window.history.pushState({ bcaGuard: 'active' }, '');
      }
    } catch (e) {
      console.warn('History API not available:', e);
    }
  }, []);

  // Whenever user opens an app, modal, or tab, push an entry so phone back button steps back
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }
    try {
      // Only push state if not already at base root
      const anyModalOpen =
        isAppSwitcherOpen ||
        isNavigatorOpen ||
        isSettingsModalOpen ||
        isSearchOpen ||
        isProjectXModalOpen ||
        isStealthActive;

      if (anyModalOpen || currentApp !== 'bca' || activeTab !== 'home' || vaultView === 'chat') {
        window.history.pushState(
          {
            bcaGuard: 'step',
            app: currentApp,
            tab: activeTab,
            modal: anyModalOpen,
            chat: vaultView === 'chat',
          },
          ''
        );
      }
    } catch (e) {
      console.warn('Failed to push state:', e);
    }
  }, [
    currentApp,
    activeTab,
    isAppSwitcherOpen,
    isNavigatorOpen,
    isSettingsModalOpen,
    isSearchOpen,
    isProjectXModalOpen,
    isStealthActive,
    vaultView,
  ]);

  // Intercept physical/swipe back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const s = stateRef.current;
      isNavigatingRef.current = true;

      // 1. Close any open modal
      if (s.isNavigatorOpen) {
        setIsNavigatorOpen(false);
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      if (s.isAppSwitcherOpen) {
        setIsAppSwitcherOpen(false);
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      if (s.isProjectXModalOpen) {
        setIsProjectXModalOpen(false);
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      if (s.isSettingsModalOpen) {
        setIsSettingsModalOpen(false);
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      if (s.isSearchOpen) {
        setIsSearchOpen(false);
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      if (s.isStealthActive) {
        setIsStealthActive(false);
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      // 2. Lock secret chat back to calculator
      if (s.currentApp === 'calc' && s.vaultView === 'chat') {
        setVaultView('calculator');
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      // 3. If inside any sub-app (e.g. MediCore, TechNagar, Atlas, Cyber, Linux, etc.), step back to BCA Verse Hub!
      if (s.currentApp !== 'bca') {
        setCurrentApp('bca');
        window.location.hash = '';
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      // 4. If inside a BCA sub-tab (notes, solvers, practice, etc.), step back to Home Overview!
      if (s.activeTab !== 'home') {
        setActiveTab('home');
        try {
          window.history.pushState({ bcaGuard: 'active' }, '');
        } catch {}
        return;
      }

      // 5. Already at Root Home screen with no modals open:
      // Double-back to exit Android pattern
      const now = Date.now();
      if (now - lastBackTimeRef.current < 2000) {
        // User pressed back twice within 2 seconds -> let default browser exit occur
        return;
      }

      // First back press at root: Prevent accidental exit & show toast
      lastBackTimeRef.current = now;
      setShowExitToast(true);
      try {
        window.history.pushState({ bcaGuard: 'active' }, '');
      } catch {}

      setTimeout(() => {
        setShowExitToast(false);
      }, 2000);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    setCurrentApp,
    setActiveTab,
    setIsAppSwitcherOpen,
    setIsNavigatorOpen,
    setIsSettingsModalOpen,
    setIsSearchOpen,
    setIsProjectXModalOpen,
    setIsStealthActive,
    setVaultView,
  ]);

  return { showExitToast };
}
