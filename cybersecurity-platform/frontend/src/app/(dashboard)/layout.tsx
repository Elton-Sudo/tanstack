import { SecurityChatbot } from '@/components/security-chatbot';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <SecurityChatbot />
    </>
  );
}
