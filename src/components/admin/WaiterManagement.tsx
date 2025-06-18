"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { useState } from "react";
import { Waiter } from "@/services/waitersService";
import { useWaiters } from "@/hooks/useWaiters";
import { useSidebar } from "@/contexts/SidebarContext";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import WaiterForm from "@/components/admin/waiter/WaiterForm";
import WaiterManagementHeader from "./waiter/WaiterManagementHeader";
import DeleteConfirmationDialog from "./waiter/DeleteConfirmationDialog";
import { useWaiterTableColumns } from "./waiter/WaiterTableColumns";

export default function WaiterManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingWaiter, setEditingWaiter] = useState<Waiter | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [waiterToDelete, setWaiterToDelete] = useState<string | null>(null);
  const { waiters, loading, error, deleteWaiter, createWaiter, updateWaiter } =
    useWaiters();
  const { toggleSidebar } = useSidebar();
  const { copiedValues, handleCopyToClipboard } = useCopyToClipboard();

  // Handle waiter deletion with confirmation
  const handleDeleteWaiter = async (id: string) => {
    setWaiterToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle waiter editing
  const handleEditWaiter = (waiter: Waiter) => {
    setEditingWaiter(waiter);
    setShowEditForm(true);
    // Close add form if open
    setShowCreateForm(false);
  };

  // Confirm deletion
  const confirmDeleteWaiter = async () => {
    if (waiterToDelete) {
      try {
        await deleteWaiter(waiterToDelete);
      } catch (error) {
        console.error("Failed to delete waiter:", error);
      } finally {
        setDeleteDialogOpen(false);
        setWaiterToDelete(null);
      }
    }
  };

  // Handle form submission from WaiterForm component for adding
  const handleCreateWaiter = async (formData: {
    firstName: string;
    lastName: string;
    identificationNumber: string;
    phoneNumber: string;
  }) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      // Generate username from firstName and lastName
      const userName = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
      const waiterData = {
        ...formData,
        userName,
      };
      await createWaiter(waiterData);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create waiter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission from WaiterForm component for editing
  const handleUpdateWaiter = async (formData: {
    firstName: string;
    lastName: string;
    identificationNumber: string;
    phoneNumber: string;
  }) => {
    if (isSubmitting || !editingWaiter) return;

    try {
      setIsSubmitting(true);
      // Generate username from firstName and lastName
      const userName = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
      const waiterData = {
        ...formData,
        userName,
      };
      await updateWaiter(editingWaiter.id, waiterData);
      setShowEditForm(false);
      setEditingWaiter(null);
    } catch (error) {
      console.error("Failed to update waiter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close add form
  const handleCloseAddForm = () => {
    setShowCreateForm(false);
  };

  // Close edit form
  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingWaiter(null);
  }; // Toggle password visibility
  const togglePasswordVisibility = (waiterId: string) => {
    const newVisiblePasswords = new Set(visiblePasswords);
    if (newVisiblePasswords.has(waiterId)) {
      newVisiblePasswords.delete(waiterId);
    } else {
      newVisiblePasswords.add(waiterId);
    }
    setVisiblePasswords(newVisiblePasswords);
  };

  // Get table columns
  const columns = useWaiterTableColumns({
    visiblePasswords,
    copiedValues,
    onTogglePasswordVisibility: togglePasswordVisibility,
    onCopyToClipboard: handleCopyToClipboard,
    onEditWaiter: handleEditWaiter,
    onDeleteWaiter: handleDeleteWaiter,
  });
  return (
    <div className="space-y-6">
      {/* Search Input and Add Button */}
      <WaiterManagementHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddWaiter={() => setShowCreateForm(true)}
        onToggleSidebar={toggleSidebar}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Content Area with Side-by-Side Layout */}
      <div className="flex gap-6">
        {/* Data Table Card Container */}
        <div
          className={`transition-all duration-300 ${
            showCreateForm || showEditForm ? "w-2/3" : "w-full"
          }`}
        >
          <Card
            className="border-0 h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)]"
            style={{ borderRadius: "30px", backgroundColor: "#fcfeff" }}
          >
            <CardContent className="h-full overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-lg text-gray-500">
                    Cargando meseros...
                  </div>
                </div>
              ) : (
                <DataTable<Waiter, any>
                  columns={columns}
                  data={waiters}
                  globalFilter={searchTerm}
                  onGlobalFilterChange={setSearchTerm}
                  useCardStyle={true}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Waiter Form */}
        {showCreateForm && (
          <WaiterForm
            mode="add"
            onSubmit={handleCreateWaiter}
            onClose={handleCloseAddForm}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Edit Waiter Form */}
        {showEditForm && editingWaiter && (
          <WaiterForm
            mode="edit"
            initialData={{
              firstName: editingWaiter.firstName,
              lastName: editingWaiter.lastName,
              identificationNumber: editingWaiter.identificationNumber,
              phoneNumber: editingWaiter.phoneNumber,
            }}
            onSubmit={handleUpdateWaiter}
            onClose={handleCloseEditForm}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteWaiter}
      />
    </div>
  );
}
