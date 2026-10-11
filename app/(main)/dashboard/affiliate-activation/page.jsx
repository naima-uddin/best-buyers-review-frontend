import AffiliateActivation from "@/page-components/DashboardPage/AffiliateActivation";

// Hidden route: not linked anywhere in the dashboard navigation.
// Access is restricted to the hidden super-admin account; the page component
// guards itself and redirects anyone else away.
export const metadata = {
  title: "Affiliate Activation | Best Buyers View",
  robots: { index: false, follow: false },
};

export default function AffiliateActivationPage() {
  return <AffiliateActivation />;
}
