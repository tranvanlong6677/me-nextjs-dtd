import indicatorApiRequest from '@/apiRequests/indicator'
import { DashboardIndicatorQueryParamsType } from '@/schemaValidations/indicator.schema'
import { useQuery } from '@tanstack/react-query'

export const useDashboardIndicatorQuery = (queryParams: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryFn: () => indicatorApiRequest.getDashboardIndicator(queryParams),
    queryKey: ['dashboardIndicators', queryParams]
  })
}
