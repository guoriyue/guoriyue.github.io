export default function BlogNavigation() {
  return (
    <>
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
        </div>
      </nav>
    </>
  );
}
