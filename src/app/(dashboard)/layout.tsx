import DashboardLayout from "@/components/layout/DashBoardLayout"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}

export default layout