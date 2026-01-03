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
import EditConfirmationDialog from "./waiter/EditConfirmationDialog";
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
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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
    setIsClosing(false);
    // Close add form if open
    if (showCreateForm) {
      handleCloseAddForm();
    }
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
      // Close form with animation
      handleCloseAddForm();
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
      // Show success dialog
      setShowEditSuccess(true);
      // Don't close form here - it will close when dialog is dismissed
    } catch (error) {
      console.error("Failed to update waiter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Close add form with animation
  const handleCloseAddForm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowCreateForm(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  // Close edit form with animation
  const handleCloseEditForm = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowEditForm(false);
      setEditingWaiter(null);
      setIsClosing(false);
    }, 300); // Match animation duration
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
      <WaiterManagementHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddWaiter={() => {
          setShowCreateForm(true);
          setIsClosing(false);
          // Close edit form if open
          if (showEditForm) {
            handleCloseEditForm();
          }
        }}
        onToggleSidebar={toggleSidebar}
      />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}{" "}
      <div className="space-y-6 lg:space-y-0 lg:flex lg:gap-6">
        {" "}
        {(showCreateForm || showEditForm || isClosing) && (
          <div
            className={`lg:order-2 lg:w-1/3 w-full transition-all duration-300 ${
              (showCreateForm || showEditForm) && !isClosing
                ? "max-h-250 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {showCreateForm && (
              <div
                className={`transform transition-all duration-300 ease-in-out ${
                  isClosing
                    ? "scale-95 opacity-0 -translate-y-4 lg:translate-y-0 lg:translate-x-4"
                    : "scale-100 opacity-100 translate-y-0 lg:translate-x-0"
                }`}
              >
                <WaiterForm
                  mode="add"
                  onSubmit={handleCreateWaiter}
                  onClose={handleCloseAddForm}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}

            {showEditForm && editingWaiter && (
              <div
                className={`transform transition-all duration-300 ease-in-out ${
                  isClosing
                    ? "scale-95 opacity-0 -translate-y-4 lg:translate-y-0 lg:translate-x-4"
                    : "scale-100 opacity-100 translate-y-0 lg:translate-x-0"
                }`}
              >
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
              </div>
            )}
          </div>
        )}
        <div
          className={`lg:order-1 transition-all duration-300 ${
            (showCreateForm || showEditForm) && !isClosing
              ? "lg:w-2/3 w-full"
              : "w-full"
          }`}
        >
          <Card
            className={`border-0 transition-all duration-300 ${
              (showCreateForm || showEditForm) && !isClosing
                ? "h-[calc(100vh-500px)] sm:h-[calc(100vh-480px)] md:h-[calc(100vh-460px)] lg:h-[calc(100vh-100px)]"
                : "h-[calc(100vh-160px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] lg:h-[calc(100vh-100px)]"
            }`}
            style={{ borderRadius: "30px", backgroundColor: "#fcfeff" }}
          >
            <CardContent className="h-full overflow-hidden p-4 sm:p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-lg text-gray-500">
                    Cargando meseros...
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-x-auto">
                  <DataTable<Waiter, any>
                    columns={columns}
                    data={waiters}
                    globalFilter={searchTerm}
                    onGlobalFilterChange={setSearchTerm}
                    useCardStyle={true}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteWaiter}
      />
      <EditConfirmationDialog
        isOpen={showEditSuccess}
        onClose={() => {
          setShowEditSuccess(false);
          // Close the edit form when dialog is closed
          if (showEditForm) {
            handleCloseEditForm();
          }
        }}
      />
    </div>
  );
}
