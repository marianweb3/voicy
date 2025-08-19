import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminsAPI,
  AdminCreateRequest,
  AdminEditRequest,
} from "../services/api";

export const useAdmins = (
  page: number = 1,
  per_page: number = 10,
  search: string = ""
) => {
  const queryClient = useQueryClient();

  // Get admins list
  const {
    data: adminsData,
    isLoading: isLoadingAdmins,
    isFetching: isFetchingAdmins,
    error: adminsError,
    refetch: refetchAdmins,
  } = useQuery({
    queryKey: ["admins", page, per_page, search],
    queryFn: () => adminsAPI.getCatalog(page, per_page, search),
  });

  // Create admin mutation
  const createAdminMutation = useMutation({
    mutationFn: (adminData: AdminCreateRequest) => adminsAPI.create(adminData),
    onSuccess: () => {
      // Invalidate and refetch admins list
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("Create admin failed:", error);
    },
  });

  // Edit admin mutation
  const editAdminMutation = useMutation({
    mutationFn: ({
      id,
      adminData,
    }: {
      id: number;
      adminData: AdminEditRequest;
    }) => adminsAPI.edit(id, adminData),
    onSuccess: () => {
      // Invalidate and refetch admins list
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("Edit admin failed:", error);
    },
  });

  // Delete admin mutation
  const deleteAdminMutation = useMutation({
    mutationFn: (id: number) => adminsAPI.delete(id),
    onSuccess: () => {
      // Invalidate and refetch admins list
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("Delete admin failed:", error);
    },
  });

  // Delete admin photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (id: number) => adminsAPI.deletePhoto(id),
    onSuccess: () => {
      // Invalidate and refetch admins list
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("Delete photo failed:", error);
    },
  });

  return {
    // Data
    admins: adminsData?.data?.items || [],
    pagination: adminsData?.data?.pagination,
    timeUpdate: adminsData?.time_update,

    // Loading states
    isLoadingAdmins,
    isFetchingAdmins,
    isCreatingAdmin: createAdminMutation.isPending,
    isEditingAdmin: editAdminMutation.isPending,
    isDeletingAdmin: deleteAdminMutation.isPending,
    isDeletingPhoto: deletePhotoMutation.isPending,

    // Error states
    adminsError,
    createAdminError: createAdminMutation.error,
    editAdminError: editAdminMutation.error,
    deleteAdminError: deleteAdminMutation.error,
    deletePhotoError: deletePhotoMutation.error,

    // Actions
    refetchAdmins,
    createAdmin: createAdminMutation.mutate,
    createAdminAsync: createAdminMutation.mutateAsync,
    editAdmin: editAdminMutation.mutate,
    editAdminAsync: editAdminMutation.mutateAsync,
    deleteAdmin: deleteAdminMutation.mutate,
    deleteAdminAsync: deleteAdminMutation.mutateAsync,
    deletePhoto: deletePhotoMutation.mutate,
    deletePhotoAsync: deletePhotoMutation.mutateAsync,
  };
};
