import { ArrowUpRight } from 'lucide-react';
import {
  publications,
  projects,
  experience,
  education,
  contributions,
} from './content';
import Companion from './companion';

const sections = [
  ['about', 'About'],
  ['research', 'Publications'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['writing', 'Blog'],
];
const figures: Record<string, { src: string; alt: string }> = {
  '2026': {
    src: '/research/asset-harvester.jpg',
    alt: 'Asset Harvester: reconstruction of 3D assets from driving observations',
  },
  'Analyzing Quantization in TVM': {
    src: '/research/tvm.png',
    alt: 'Tensor memory layout diagram from Analyzing Quantization in TVM',
  },
  '2022': {
    src: '/research/unrealnas.png',
    alt: 'UnrealNAS architecture search pipeline',
  },
  '2021': {
    src: '/research/fake-news.png',
    alt: 'Diagram from the Fake News Evolution study',
  },
};
function Art({ kind, className = '' }: { kind: string; className?: string }) {
  return (
    <span
      className={`section-art art-${kind} ${className}`}
      aria-hidden="true"
    />
  );
}
function Heading({
  title,
  kind,
  children,
}: {
  title: string;
  kind: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="section-heading">
      <div>
        <h2>{title}</h2>
        {children}
      </div>
      <Art kind={kind} />
    </header>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="navigation" aria-label="On this page">
        <a className="home-link" href="#about">
          MG<span>.</span>
        </a>
        <div>
          {sections.map(([id, title]) => (
            <a key={id} href={`#${id}`}>
              {title}
            </a>
          ))}
        </div>
      </nav>
      <main id="main">
        <section id="about" className="about-section">
          <div className="about-copy">
            <div className="name-row">
              <h1>Mingfei Guo</h1>
              <Art kind="about" />
            </div>
            <p className="position">
              Software Engineer at <a href="https://www.nvidia.com/">NVIDIA</a>{' '}
              · Bay Area
            </p>
            <p>
              I work on 3D reconstruction, synthetic data, and ML systems. At
              NVIDIA, I build neural reconstruction and simulation pipelines for
              autonomous driving.
            </p>
            <p>
              I received my MS in Electrical Engineering from Stanford and my BS
              from Peking University. Outside work, I write GPU kernels, build
              small tools, and really like border collies.
            </p>
            <div className="social-links">
              <a href="mailto:mingfeiguoo@gmail.com">Email</a>
              <a href="https://github.com/guoriyue">GitHub</a>
              <a href="https://x.com/MingfeiGuo">Twitter / X</a>
              <a href="https://www.linkedin.com/in/mingfeiguo">LinkedIn</a>
            </div>
          </div>
          <img
            className="portrait"
            src="/portrait.jpg"
            alt="Mingfei Guo"
            width="168"
            height="168"
          />
        </section>
        <section id="research" className="content-section research-section">
          <Heading title="Publications" kind="research">
            <p>3D vision, efficient ML, and earlier work in NLP.</p>
          </Heading>
          <div className="section-body paper-list">
            {publications.map((p) => {
              const figure = figures[p.title] || figures[p.year];
              return (
                <article className="paper" key={p.title}>
                  <a
                    className={`paper-preview ${figure ? 'has-figure' : ''}`}
                    href={p.url}
                    aria-label={`Read ${p.title}`}
                  >
                    {figure ? (
                      <img src={figure.src} alt={figure.alt} loading="lazy" />
                    ) : (
                      <div className="paper-type">
                        <span>
                          {p.title.startsWith('SANA') ? 'SANA' : 'PromptCoT'}
                        </span>
                        <small>
                          {p.title.startsWith('SANA')
                            ? 'Uniform quantization'
                            : 'Text → Image'}
                        </small>
                      </div>
                    )}
                  </a>
                  <div className="paper-copy">
                    <div className="paper-meta">
                      <span>{p.venue}</span>
                      <time>{p.year}</time>
                    </div>
                    <h3>
                      <a href={p.url}>{p.title}</a>
                    </h3>
                    <p className="authors">
                      {p.authors.split('Mingfei Guo').map((part, i) => (
                        <span key={i}>
                          {i > 0 && <strong>Mingfei Guo</strong>}
                          {part}
                        </span>
                      ))}
                    </p>
                    <p className="paper-description">{p.description}</p>
                    <div className="paper-links">
                      <a href={p.url}>
                        Paper <ArrowUpRight size={13} />
                      </a>
                      {p.project && (
                        <a href={p.project}>
                          Project <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <section id="projects" className="content-section projects-section">
          <Heading title="Projects" kind="projects">
            <a href="https://github.com/guoriyue">More on GitHub ↗</a>
          </Heading>
          <div className="section-body">
            <div className="project-grid">
              {projects.map((p, i) => (
                <article className="project-card" key={p.url}>
                  <div className="project-top">
                    <span className="project-number">0{i + 1}</span>
                    <span className="project-tag">{p.tag.toLowerCase()}</span>
                  </div>
                  <h3>
                    <a href={p.url}>
                      {p.name} <ArrowUpRight size={15} />
                    </a>
                  </h3>
                  <p>{p.description}</p>
                  <a className="project-code" href={p.url}>
                    Code ↗
                  </a>
                </article>
              ))}
            </div>
            <div className="contributions">
              <h3>Open-source contributions</h3>
              {contributions.map((c) => (
                <div className="contribution" key={c.name}>
                  <a href={c.url}>{c.name}</a>
                  <p>
                    {c.description} <a href={c.example}>Merged PR ↗</a>
                  </p>
                </div>
              ))}
            </div>
            <div className="project-teaser">
              <h3>
                TinyTriton <span>In development</span>
              </h3>
              <p>
                A GPU compiler course in six milestones, from a small
                interpreter to CUDA, LLVM/PTX, reductions, and attention
                kernels.
              </p>
            </div>
          </div>
        </section>
        <section id="experience" className="content-section experience-section">
          <Heading title="Experience" kind="experience" />
          <div className="section-body">
            {experience.map((e) => (
              <article
                className="experience-entry"
                key={e.organization + e.period}
              >
                <div className="experience-top">
                  <h3>{e.organization}</h3>
                  <span>{e.period}</span>
                </div>
                <p className="experience-role">{e.role}</p>
                <p>{e.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="education" className="content-section education-section">
          <Heading title="Education & teaching" kind="education" />
          <div className="section-body">
            {education.map((e) => (
              <article className="education-entry" key={e.school}>
                <div className="experience-top">
                  <h3>{e.school}</h3>
                  <span>{e.period}</span>
                </div>
                <p className="degree">{e.degree}</p>
                <p className="education-focus">{e.focus}</p>
                <p>{e.detail}</p>
                <a className="text-link" href={e.url}>
                  {e.linkLabel} ↗
                </a>
              </article>
            ))}
          </div>
        </section>
        <section id="writing" className="content-section writing-section">
          <Heading title="Blog" kind="writing" />
          <div className="section-body blog-empty">
            <p>No posts yet. I’ll share notes on research and projects here.</p>
          </div>
        </section>
        <footer>
          <span>© {new Date().getFullYear()} Mingfei Guo</span>
          <a href="#about">Back to top ↑</a>
        </footer>
      </main>
      <Companion />
    </div>
  );
}
