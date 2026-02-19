// Frontend: Settings Page with Delete Account Button
// Place in: frontend/src/pages/Settings.jsx
// Add this section to your existing settings page

import React, { useState } from "react";
import DeleteAccountModal from "../components/DeleteAccountModal";
import useAuth from "../hooks/useAuth";

export const SettingsPage = () => {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* ... Your existing settings sections ... */}

        {/* DANGER ZONE - Account Deletion */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-gray-600 mb-6">
            Irreversible and destructive actions
          </p>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Account
            </h3>
            <p className="text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          user={user}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => {
            // User will be redirected by modal
          }}
        />
      )}
    </div>
  );
};

export default SettingsPage;
