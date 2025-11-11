
import React from 'react';
import { UserRole } from '../types';
import { USER_ROLES } from '../constants';

interface RoleSwitcherProps {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentUserRole, setCurrentUserRole }) => {
  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-1 shadow-inner">
      {USER_ROLES.map((role) => (
        <button
          key={role}
          onClick={() => setCurrentUserRole(role)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
            currentUserRole === role
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
};

export default RoleSwitcher;
