import DashboardMain from '@/app/[locale]/manage/dashboard/dashboard-main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
export default async function Dashboard() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:pl-24 sm:pr-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Phân tích các chỉ số</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardMain />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
