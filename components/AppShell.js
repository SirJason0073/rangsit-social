import Navbar from './Navbar';
import MobileNavigation from './MobileNavigation';
import NavigationContext from './NavigationContext';
import PageTransition from './PageTransition';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" className="app-main container" tabIndex="-1">
        <NavigationContext />
        <PageTransition>{children}</PageTransition>
      </main>
      <MobileNavigation />
    </div>
  );
}
