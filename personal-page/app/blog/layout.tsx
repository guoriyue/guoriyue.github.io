import Companion from '../companion';
import ThemeToggle from '../theme-toggle';
import './blog.css';

// Blog pages keep the site navigation and set their content in the Jekyll
// Minima reading layout.
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="minima">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="navigation" aria-label="Main navigation">
        <div>
          <a href="/">About</a>
          <a href="/#work">Projects</a>
          <a href="/#experience">Experience</a>
          <a href="/#education">Education</a>
          <a href="/#personal">Personal</a>
          <a href="/blog/" aria-current="page">
            Blog
          </a>
          <ThemeToggle />
        </div>
      </nav>
      <main className="page-content" id="main">
        <div className="wrapper">{children}</div>
      </main>
      <Companion />
    </div>
  );
}
