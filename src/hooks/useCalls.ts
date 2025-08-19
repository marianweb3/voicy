import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { callsAPI, managersAPI, AddCommentRequest } from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";

export const useCalls = (
  page: number = 1,
  per_page: number = 10,
  search: string = "",
  manager_id?: number,
  is_checked?: number,
  ai_score?: string,
  reject_reason?: string,
  status?: string
) => {
  // Get calls catalog
  const {
    data: callsData,
    isLoading: isLoadingCalls,
    isFetching: isFetchingCalls,
    error: callsError,
    refetch: refetchCalls,
  } = useQuery({
    queryKey: [
      "calls",
      "catalog",
      page,
      per_page,
      search,
      manager_id,
      is_checked,
      ai_score,
      reject_reason,
      status,
    ],
    queryFn: () =>
      callsAPI.getCatalog(
        page,
        per_page,
        search,
        manager_id,
        is_checked,
        ai_score,
        reject_reason,
        status
      ),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
  });

  return {
    // Data
    callsData,
    calls: callsData?.data?.items || [],
    pagination: callsData?.data?.pagination || null,
    timeUpdate: callsData?.time_update || null,

    // Loading states
    isLoadingCalls,
    isFetchingCalls,

    // Error states
    callsError,

    // Actions
    refetchCalls,
  };
};

export const useManagersForDropdown = (search: string = "") => {
  // Get managers for dropdown options
  const {
    data: managersData,
    isLoading: isLoadingManagers,
    error: managersError,
  } = useQuery({
    queryKey: ["managers", "dropdown", search],
    queryFn: () => managersAPI.getCatalog(1, 100, search), // Get up to 100 managers for dropdown
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });

  return {
    // Data
    managers: managersData?.data?.items || [],

    // Loading states
    isLoadingManagers,

    // Error states
    managersError,
  };
};

export const useCall = (id: number) => {
  const queryClient = useQueryClient();

  const {
    data: callData,
    isLoading: isLoadingCall,
    isFetching: isFetchingCall,
    error: callError,
    refetch: refetchCall,
  } = useQuery({
    queryKey: ["call", "view", id],
    queryFn: () => callsAPI.getView(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Check call mutation
  const checkCallMutation = useMutation({
    mutationFn: (callId: number) => callsAPI.checkCall(callId),
    onSuccess: (response) => {
      showSuccessToast(response.message);
      // Invalidate and refetch call data to update the UI
      queryClient.invalidateQueries({ queryKey: ["call", "view", id] });
      // Also invalidate calls catalog to update the main calls list
      queryClient.invalidateQueries({ queryKey: ["calls"] });
    },
    onError: (error: any) => {
      console.error("Check call failed:", error);
      const message =
        error?.response?.data?.message || "Помилка при відмітці дзвінка";
      showErrorToast(message);
    },
  });

  return {
    // Data
    callData,
    callInfo: callData?.data?.info || null,
    callAI: callData?.data?.ai || null,

    // Loading states
    isLoadingCall,
    isFetchingCall,

    // Error states
    callError,

    // Actions
    refetchCall,
    checkCall: checkCallMutation.mutate,
    isCheckingCall: checkCallMutation.isPending,
  };
};

export const useTranscript = (id: number) => {
  const {
    data: transcriptData,
    isLoading: isLoadingTranscript,
    isFetching: isFetchingTranscript,
    error: transcriptError,
    refetch: refetchTranscript,
  } = useQuery({
    queryKey: ["call", "transcript", id],
    queryFn: () => callsAPI.getTranscript(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - transcripts don't change often
  });


  return {
    // Data
    transcriptData,

    // Loading states
    isLoadingTranscript,
    isFetchingTranscript,

    // Error states
    transcriptError,

    // Actions
    refetchTranscript,
  };
};

export const useComments = (id: number) => {
  const queryClient = useQueryClient();

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["call", "comments", id],
    queryFn: () => callsAPI.getComments(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 2 * 60 * 1000, // 2 minutes - comments can change frequently
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (commentData: AddCommentRequest) =>
      callsAPI.addComment(id, commentData),
    onSuccess: () => {
      // Invalidate and refetch comments to show the new comment
      queryClient.invalidateQueries({ queryKey: ["call", "comments", id] });
    },
    onError: (error: any) => {
      console.error("Add comment failed:", error);
      const message =
        error?.response?.data?.message || "Помилка при додаванні коментаря";
      showErrorToast(message);
    },
  });

  return {
    // Data
    commentsData,
    comments: commentsData?.data?.items || [],

    // Loading states
    isLoadingComments,
    isFetchingComments,

    // Error states
    commentsError,

    // Actions
    refetchComments,
    addComment: addCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,
  };
};
