import { useQuery } from "@tanstack/react-query";
import { processesAPI } from "../services/api";

export const useProcesses = () => {
  // Get process statistics
  const {
    data: processData,
    isLoading: isLoadingProcesses,
    error: processError,
    refetch: refetchProcesses,
  } = useQuery({
    queryKey: ["processes", "statistics"],
    queryFn: () => processesAPI.getStatistics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    // Data
    processData,
    processStatistics: processData?.data,
    timeUpdate: processData?.time_update,

    // Loading states
    isLoadingProcesses,

    // Error states
    processError,

    // Actions
    refetchProcesses,
  };
};

// Helper function to convert date from DD-MM-YYYY to YYYY-MM-DD format
const convertDateFormat = (dateString: string): string => {
  if (!dateString) return "";

  // Check if date is already in YYYY-MM-DD format
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  // Convert from DD-MM-YYYY to YYYY-MM-DD
  const [day, month, year] = dateString.split("-");
  if (day && month && year) {
    return `${year}-${month}-${day}`;
  }

  return "";
};

export const useProcessesCatalog = (
  page: number = 1,
  per_page: number = 10,
  search: string = "",
  stage: string = "all",
  status: string = "all",
  date_from: string = "",
  date_to: string = ""
) => {
  // Convert date formats for API
  const formattedDateFrom = convertDateFormat(date_from);
  const formattedDateTo = convertDateFormat(date_to);
  // Get process catalog
  const {
    data: catalogData,
    isLoading: isLoadingCatalog,
    isFetching: isFetchingCatalog,
    error: catalogError,
    refetch: refetchCatalog,
  } = useQuery({
    queryKey: [
      "processes",
      "catalog",
      page,
      per_page,
      search,
      stage,
      status,
      formattedDateFrom,
      formattedDateTo,
    ],
    queryFn: () =>
      processesAPI.getCatalog(
        page,
        per_page,
        search,
        stage,
        status,
        formattedDateFrom,
        formattedDateTo
      ),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
  });

  return {
    // Data
    catalogData,
    tasks: catalogData?.data?.items || [],
    pagination: catalogData?.data?.pagination || null,
    filters: catalogData?.data?.filters || null,
    filtersApplied: catalogData?.data?.filters_applied || null,
    catalogTimeUpdate: catalogData?.time_update || null,

    // Loading states
    isLoadingCatalog,
    isFetchingCatalog,

    // Error states
    catalogError,

    // Actions
    refetchCatalog,
  };
};
