import DashboardClientWrapper from "./_components/DashboardClientWrapper";

export const metadata = {
  title: "Dashboard | Best Buyers View",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({ children }) {
  return <DashboardClientWrapper>{children}</DashboardClientWrapper>;
}
