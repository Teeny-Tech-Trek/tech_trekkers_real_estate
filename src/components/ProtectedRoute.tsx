// // import React from 'react';
// // import { Navigate } from 'react-router-dom';
// // import { useAuth } from '@/contexts/AuthContext';

// // interface ProtectedRouteProps {
// //   children: React.ReactNode;
// // }

// // const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
// //   const { user, isLoading } = useAuth();

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
// //       </div>
// //     );
// //   }

// //   if (!user) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return <>{children}</>;
// // };

// // export default ProtectedRoute;

// // import { Navigate, Outlet } from 'react-router-dom';
// // import { useAuth } from '@/contexts/AuthContext';


// // const ProtectedRoute = () => {
// //   const { user, isLoading } = useAuth();

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
// //       </div>
// //     );
// //   }

// //   if (!user) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return <Outlet />; // 🔥 THIS FIXES EVERYTHING
// // };

// // export default ProtectedRoute;

// // src/components/ProtectedRoute.tsx
// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { AlertCircle } from 'lucide-react';

// interface ProtectedRouteProps {
//   requireOwner?: boolean;
//   requireOrganization?: boolean;
//   allowedRoles?: ('owner' | 'admin' | 'agent' | 'member' | 'individual')[];
// }

// const ProtectedRoute = ({ 
//   requireOwner = false, 
//   requireOrganization = false,
//   allowedRoles 
// }: ProtectedRouteProps) => {
//   const { user, isLoading } = useAuth();
//   const location = useLocation();

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
//           <div className="text-slate-300 text-lg">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   // Not authenticated
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Check if organization account is required
//   if (requireOrganization && user.accountType !== 'organization') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 text-center">
//           <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="w-8 h-8 text-red-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">Organization Account Required</h2>
//           <p className="text-slate-400 mb-6">
//             This feature is only available for organization accounts. Please upgrade your account or contact your organization administrator.
//           </p>
//           <button
//             onClick={() => window.history.back()}
//             className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check if owner role is required
//   if (requireOwner && user.role !== 'owner') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 text-center">
//           <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="w-8 h-8 text-red-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">Owner Access Required</h2>
//           <p className="text-slate-400 mb-6">
//             Only organization owners can access this page. Please contact your organization owner for assistance.
//           </p>
//           <button
//             onClick={() => window.history.back()}
//             className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Check allowed roles
//   if (allowedRoles && !allowedRoles.includes(user.role as any)) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 text-center">
//           <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="w-8 h-8 text-red-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
//           <p className="text-slate-400 mb-6">
//             You do not have permission to access this page. Your role: <span className="font-semibold text-white">{user.role}</span>
//           </p>
//           <button
//             onClick={() => window.history.back()}
//             className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  requireOwner?: boolean;
  requireAdmin?: boolean;
  requireOrganization?: boolean;
  allowIndividual?: boolean;
  allowedRoles?: ('owner' | 'admin' | 'agent' | 'member' | 'individual')[];
  requireRoles?: ('owner' | 'admin' | 'agent' | 'member' | 'individual')[];
}

const ProtectedRoute = ({
  requireOwner = false,
  requireAdmin = false,
  requireOrganization = false,
  allowIndividual = true,
  allowedRoles,
  requireRoles,
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-slate-300 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validate user has required fields
  if (!user.role || !user.accountType) {
    return (
      <ErrorScreen
        title="Invalid User Data"
        message="Your account data is incomplete. Please contact support or try logging in again."
        onAction={() => window.location.href = '/login'}
        actionLabel="Back to Login"
      />
    );
  }

  // Check if organization account is required
  if (requireOrganization && user.accountType !== 'organization') {
    return (
      <ErrorScreen
        title="Organization Account Required"
        message="This feature is only available for organization accounts. Please upgrade your account or contact your organization administrator."
        showGoBack
      />
    );
  }

  // Check if individual account is allowed
  if (!allowIndividual && user.accountType === 'individual') {
    return (
      <ErrorScreen
        title="Not Available for Individual Accounts"
        message="This feature requires an organization account. Please create or join an organization to access this feature."
        showGoBack
      />
    );
  }

  // Check if owner role is required
  if (requireOwner && user.role !== 'owner') {
    return (
      <ErrorScreen
        title="Owner Access Required"
        message="Only organization owners can access this page. Please contact your organization owner for assistance."
        showGoBack
      />
    );
  }

  // Check if admin or owner role is required
  if (requireAdmin && !['owner', 'admin'].includes(user.role)) {
    return (
      <ErrorScreen
        title="Admin Access Required"
        message="Only organization owners and administrators can access this page."
        showGoBack
      />
    );
  }

  // Check allowed roles (user must have ONE of these roles)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role as any)) {
      return (
        <ErrorScreen
          title="Access Denied"
          message={`You do not have permission to access this page. Your role: ${user.role}`}
          details={`Required roles: ${allowedRoles.join(', ')}`}
          showGoBack
        />
      );
    }
  }

  // Check required roles (user must have ALL of these conditions met)
  if (requireRoles && requireRoles.length > 0) {
    if (!requireRoles.includes(user.role as any)) {
      return (
        <ErrorScreen
          title="Insufficient Permissions"
          message={`This page requires specific permissions that your account does not have.`}
          details={`Your role: ${user.role}`}
          showGoBack
        />
      );
    }
  }

  // Additional validation for organization users
  if (user.accountType === 'organization' || user.workingUnderOrganization) {
    // Organization users should have organization-specific roles
    if (!['owner', 'admin', 'agent', 'member'].includes(user.role)) {
      return (
        <ErrorScreen
          title="Invalid Role Configuration"
          message="Your organization role is not properly configured. Please contact your organization owner."
          showGoBack
        />
      );
    }
  }

  // Additional validation for individual users
  if (user.accountType === 'individual' && !user.workingUnderOrganization) {
    // Individual users should have individual role (only if not in an org)
    if (user.role !== 'individual') {
      return (
        <ErrorScreen
          title="Invalid Account Configuration"
          message="Your account configuration is invalid. Please contact support."
          onAction={() => window.location.href = '/login'}
          actionLabel="Back to Login"
        />
      );
    }
  }

  // All checks passed, render the protected content
  return <Outlet />;
};

// Error Screen Component
interface ErrorScreenProps {
  title: string;
  message: string;
  details?: string;
  showGoBack?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

function ErrorScreen({
  title,
  message,
  details,
  showGoBack = false,
  onAction,
  actionLabel = 'Go Back',
}: ErrorScreenProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (showGoBack) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 text-center backdrop-blur-sm">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 mb-4">{message}</p>
        {details && (
          <div className="mb-6 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-300">{details}</p>
          </div>
        )}
        <button
          onClick={handleAction}
          className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all w-full"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export default ProtectedRoute;