import {
  publications,
  projects,
  experience,
  education,
  contributions,
} from './content';
import Companion from './companion';
import Demo from './demo';

const sections = [
  ['projects', 'Projects'],
  ['research', 'Publications'],
  ['writing', 'Blog'],
  ['experience', 'Experience'],
  ['education', 'Education'],
];
const nurecUrl =
  'https://developer.nvidia.com/blog/scale-av-perception-across-vehicle-platforms-with-nvidia-omniverse-nurec/';
function Art({ kind }: { kind: string }) {
  return <span className={`section-art art-${kind}`} aria-hidden="true" />;
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
      <div className="heading-title">
        <Art kind={kind} />
        <h2>{title}</h2>
      </div>
      {children}
    </header>
  );
}
function Authors({ names }: { names: string }) {
  return (
    <p className="authors">
      {names.split('Mingfei Guo').map((part, i) => (
        <span key={i}>
          {i > 0 && <strong>Mingfei Guo</strong>}
          {part}
        </span>
      ))}
    </p>
  );
}

export default function Home() {
  const featured = publications[0];
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
              I received my MS from Stanford and my BS from Peking University.
              Outside work, I write GPU kernels, make small apps, and really
              like border collies.
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
            width="208"
            height="208"
          />
        </section>

        <section id="projects" className="content-section projects-section">
          <Heading title="Projects" kind="projects">
            <a href="https://github.com/guoriyue">All projects ↗</a>
          </Heading>
          <article className="nyaicon-project">
            <a
              className="nyaicon-preview"
              href="https://nyaicon.com/"
              aria-label="Explore NyaIcon"
            >
              <img
                src="/projects/nyaicon.webp"
                alt="NyaIcon app showing a library of custom Mac icons and themes"
                width="1100"
                height="720"
              />
            </a>
            <div className="feature-copy">
              <p className="eyebrow">A small app for your Mac</p>
              <h3>
                <a href="https://nyaicon.com/">NyaIcon ↗</a>
              </h3>
              <p>
                Give your Mac a different look. Change app and folder icons,
                pick a whole theme, or bring your own images.
              </p>
              <p className="secondary-copy">
                From classic Mac pixels to pastel cats. You can restore the
                original icons anytime.
              </p>
              <a className="text-link" href="https://nyaicon.com/">
                Try NyaIcon ↗
              </a>
            </div>
          </article>
          <article className="graphics-project">
            <div className="graphics-demo">
              <Demo
                src="/projects/gaussian-splatting.mp4"
                poster="/projects/gaussian-splatting-poster.jpg"
                label="Training a 3D Gaussian Splatting model on the Lego scene"
              />
            </div>
            <div className="feature-copy">
              <p className="eyebrow">Python · NVIDIA Warp</p>
              <h3>
                <a href={projects[0].url}>
                  3D Gaussian Splatting, from scratch ↗
                </a>
              </h3>
              <p>
                A small implementation of the training and rendering pipeline in
                Python and NVIDIA Warp. The same kernels run on CPU and GPU.
              </p>
              <a className="text-link" href={projects[0].url}>
                Read the code ↗
              </a>
            </div>
          </article>
          <div className="project-list">
            {projects.slice(1).map((p) => (
              <article className="small-project" key={p.url}>
                <h3>
                  <a href={p.url}>{p.name} ↗</a>
                </h3>
                <p>{p.description}</p>
              </article>
            ))}
            <article className="small-project tiny-triton">
              <h3>
                TinyTriton <span>In development</span>
              </h3>
              <p>
                A GPU compiler course in six milestones, from a small
                interpreter to CUDA, LLVM/PTX, reductions, and attention
                kernels.
              </p>
            </article>
          </div>
          <div className="contributions">
            <h3>Contributions</h3>
            {contributions.map((c) => (
              <p key={c.name}>
                <a href={c.example}>{c.name} ↗</a>
                <span>{c.description}</span>
              </p>
            ))}
          </div>
        </section>

        <section id="research" className="content-section research-section">
          <Heading title="Publications" kind="research" />
          <article className="featured-paper">
            <div className="paper-meta">
              <span>{featured.venue}</span>
              <time>{featured.year}</time>
            </div>
            <h3>
              <a href={featured.project}>{featured.title}</a>
            </h3>
            <p className="feature-summary">
              Real driving logs → complete 3D assets → editable simulation
              scenes.
            </p>
            <figure>
              <Demo
                src="/research/asset-harvester.mp4"
                poster="/research/asset-harvester-poster.jpg"
                label="Asset Harvester demo: extracting 3D assets from driving logs and using them in simulation"
              />
              <figcaption>
                Asset Harvester demo ·{' '}
                <a href={featured.project}>Project page ↗</a>
              </figcaption>
            </figure>
            <Authors names={featured.authors} />
            <div className="paper-links">
              <a href={featured.url}>Read the paper ↗</a>
              <a href={featured.project}>More results ↗</a>
            </div>
          </article>
          <div className="paper-list">
            {publications.slice(1).map((p) => (
              <article className="paper" key={p.title}>
                <div className="paper-meta">
                  <time>{p.year}</time>
                  <span>{p.venue}</span>
                </div>
                <div>
                  <h3>
                    <a href={p.url}>{p.title} ↗</a>
                  </h3>
                  <Authors names={p.authors} />
                  <p className="paper-description">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="writing" className="content-section writing-section">
          <Heading title="Blog & talks" kind="writing" />
          <article className="nurec-story">
            <div className="paper-meta">
              <span>NVIDIA Technical Blog</span>
              <time dateTime="2026-08-31">Aug 31, 2026</time>
            </div>
            <h3>
              <a href={nurecUrl}>
                Scale AV Perception Across Vehicle Platforms with NVIDIA
                Omniverse NuRec
              </a>
            </h3>
            <p className="feature-summary">
              A new sensor setup doesn’t have to mean starting your dataset
              over.
            </p>
            <figure>
              <Demo
                src="/research/nurec.mp4"
                poster="/research/nurec-poster.jpg"
                label="NuRec carline adaptation: the same recorded drive rendered from the original and shifted camera rigs"
              />
              <figcaption>
                The same drive, rendered from the original and shifted camera
                rigs.
              </figcaption>
            </figure>
            <p>
              Moving cameras changes what a vehicle can see. In this post, we
              show how to reconstruct recorded drives and render new camera
              viewpoints for a different sensor configuration.
            </p>
            <Authors names="Apurv Naman, Mingfei Guo, Dominik Froehlich, Wonsik Han" />
            <div className="paper-links">
              <a href={nurecUrl}>Read the post ↗</a>
              <a href="https://www.youtube.com/watch?v=tP_nNXsDE80">
                Watch the livestream replay ↗
              </a>
            </div>
          </article>
          <p className="blog-note">
            More notes on research and side projects to come.
          </p>
        </section>

        <div className="background-grid">
          <section
            id="experience"
            className="content-section experience-section"
          >
            <Heading title="Experience" kind="experience" />
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
          </section>
          <section id="education" className="content-section education-section">
            <Heading title="Education" kind="education" />
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
          </section>
        </div>
        <footer>
          <span>© {new Date().getFullYear()} Mingfei Guo</span>
          <a href="#about">Back to top ↑</a>
        </footer>
      </main>
      <Companion />
    </div>
  );
}
