// This layout ensures that pages within (auth) group use the root layout,
// not the (app) layout with the sidebar.
// It primarily serves to group auth-related pages.
// The actual centering and styling will be handled by individual page components or a shared component.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
