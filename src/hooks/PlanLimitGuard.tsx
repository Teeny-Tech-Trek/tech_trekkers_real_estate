// src/components/PlanLimitGuard.tsx
import { ReactNode } from 'react';
import { usePlanLimits, PlanLimits } from '@/hooks/usePlanLimits';
import { PlanLimitAlert } from './PlanLimitAlert';
import { Loader2 } from 'lucide-react';

interface PlanLimitGuardProps {
  type: 'agent' | 'property' | 'team';
  children: ReactNode;
  fallback?: ReactNode;
}

export const PlanLimitGuard: React.FC<PlanLimitGuardProps> = ({
  type,
  children,
  fallback
}) => {
  const limits = usePlanLimits();

  if (limits.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const isAtLimit = limits.isAtLimit[type === 'team' ? 'teamMembers' : `${type}s`];

  if (isAtLimit) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const current = limits[type === 'team' ? 'teamMembers' : `${type}s`].used;
    const limit = limits[type === 'team' ? 'teamMembers' : `${type}s`].limit;

    return (
      <PlanLimitAlert
        type={type}
        current={current}
        limit={limit}
        planName={limits.planName}
      />
    );
  }

  return <>{children}</>;
};