import {
  publications,
  projects,
  experience,
  education,
  contributions,
} from './content';
import Companion from './companion';
import Demo from './demo';
import PageMotion from './page-motion';

const sections = [
  ['about', 'About'],
  ['work', 'Work'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['writing', 'Blog'],
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

        <section id="work" className="content-section work-section">
          <Heading title="Work" kind="experience" />
          <div className="featured-work-list">
            <article className="work-row" id="nurec">
              <figure className="work-preview">
                <Demo
                  src="/research/nurec.gif"
                  poster="/research/nurec-poster.jpg"
                  width={800}
                  height={450}
                  label="NuRec carline adaptation: the original and shifted camera rigs"
                />
                <figcaption>
                  The same recorded drive, from two camera rigs.
                </figcaption>
              </figure>
              <div className="work-copy">
                <h3>
                  <a href={nurecUrl}>NVIDIA Omniverse NuRec</a>
                </h3>
                <p className="work-meta">
                  NVIDIA · Neural reconstruction · 2026
                </p>
                <p>
                  Generate new camera viewpoints from recorded drives to adapt
                  AV perception across sensor configurations and vehicle
                  platforms.
                </p>
                <p>
                  I work on neural reconstruction and simulation pipelines at
                  NVIDIA, and coauthored this technical walkthrough on carline
                  adaptation.
                </p>
                <Authors names="Apurv Naman, Mingfei Guo, Dominik Froehlich, Wonsik Han" />
                <div className="paper-links">
                  <a href={nurecUrl}>Technical blog ↗</a>
                  <a href="https://www.youtube.com/watch?v=tP_nNXsDE80">
                    Livestream replay ↗
                  </a>
                </div>
              </div>
            </article>
            <article className="work-row" id="asset-harvester">
              <figure className="work-preview asset-preview">
                <Demo
                  src="/research/asset-harvester.gif"
                  poster="/research/asset-harvester-poster.jpg"
                  width={1000}
                  height={406}
                  label="Asset Harvester: extracting 3D assets from driving logs for simulation"
                />
                <figcaption>
                  Driving observations → 3D assets → simulation.
                </figcaption>
              </figure>
              <div className="work-copy">
                <h3>
                  <a href={featured.project}>Asset Harvester</a>
                </h3>
                <p className="work-meta">NVIDIA · Coauthor · 2026</p>
                <p>
                  Extracting complete 3D assets from sparse observations in
                  autonomous driving logs, ready to use in simulation.
                </p>
                <div className="paper-links">
                  <a href={featured.project}>Project & results ↗</a>
                  <a href={featured.url}>Paper ↗</a>
                </div>
              </div>
            </article>
          </div>
        </section>
        <section id="projects" className="content-section projects-section">
          <Heading title="Projects" kind="projects" />
          <p className="projects-intro">
            ML systems, GPU performance, and training infrastructure.
          </p>
          <div className="project-grid">
            <article className="project-card">
              <figure className="work-preview">
                <a
                  href="/projects/vrl-sd35-text.jpg"
                  aria-label="View the full SD3.5 text generation comparison"
                >
                  <img
                    className="vrl-comparison"
                    src="/projects/vrl-sd35-text.jpg"
                    alt="SD3.5 text generation before and after OCR GRPO, with paired fashion show, map, neon sign, and handwriting examples"
                    width="1730"
                    height="2020"
                    loading="lazy"
                  />
                </a>
                <figcaption>
                  SD3.5 · Before / after OCR GRPO ·{' '}
                  <a href="/projects/vrl-sd35-text.jpg">Full comparison ↗</a>
                </figcaption>
              </figure>
              <div className="work-copy">
                <h3>
                  <a href={projects[1].url}>{projects[1].name}</a>
                </h3>
                <p className="work-meta">
                  Training infrastructure · RL post-training
                </p>
                <p>
                  <strong>RL post-training infrastructure</strong> for visual
                  generative models. A shared{' '}
                  <strong>rollout → reward → optimization</strong> loop, with
                  composable model, algorithm, and execution configs.
                </p>
                <p>
                  <strong>
                    Ray rollouts, DDP / FSDP training, weight synchronization,
                  </strong>{' '}
                  and checkpointing. The SD3.5 example uses{' '}
                  <strong>GRPO with an OCR reward</strong>
                  to improve text rendering.
                </p>
                <div className="paper-links">
                  <a href={projects[1].url}>Code ↗</a>
                  <a href="https://github.com/guoriyue/VRL/tree/main/docs/training_examples/sd3_5_ocr_grpo">
                    Training example ↗
                  </a>
                </div>
              </div>
            </article>
            <article className="project-card">
              <figure className="work-preview gaussian-preview">
                <Demo
                  src="/projects/gaussian-splatting.gif"
                  poster="/projects/gaussian-splatting-poster.jpg"
                  width={640}
                  height={640}
                  label="3D Gaussian Splatting training on the Lego scene"
                />
                <figcaption>
                  Training and rendering · Shared CPU / GPU kernels
                </figcaption>
              </figure>
              <div className="work-copy">
                <h3>
                  <a href={projects[0].url}>
                    3D Gaussian Splatting, from scratch
                  </a>
                </h3>
                <p className="work-meta">
                  GPU programming · Differentiable rendering
                </p>
                <p>
                  A from-scratch{' '}
                  <strong>training and rendering pipeline</strong> for 3D
                  Gaussian Splatting, written in Python and{' '}
                  <strong>NVIDIA Warp</strong>. The same kernels run on CPU and
                  GPU.
                </p>
                <div className="paper-links">
                  <a href={projects[0].url}>Code ↗</a>
                </div>
              </div>
            </article>
          </div>
          <div className="project-grid compact-project-grid">
            {[projects[4], projects[5]].map((p) => (
              <article className="small-project" key={p.url}>
                <h3>
                  <a href={p.url}>{p.name} ↗</a>
                </h3>
                <p className="project-keywords">{p.tag}</p>
                <p>{p.description}</p>
                <a className="work-link" href={p.url}>
                  Code ↗
                </a>
              </article>
            ))}
            <article className="small-project tiny-triton">
              <h3>
                TinyTriton <span>In development</span>
              </h3>
              <p className="project-keywords">
                GPU COMPILERS · CUDA · LLVM / PTX
              </p>
              <p>
                A GPU compiler course in six milestones: interpreter, CUDA
                execution, LLVM / PTX lowering, reductions, and attention
                kernels.
              </p>
            </article>
            <article className="small-project">
              <h3>
                <a href={projects[3].url}>{projects[3].name} ↗</a>
              </h3>
              <p className="project-keywords">
                BROWSER AUTOMATION · WORKFLOW RECORDING
              </p>
              <p>{projects[3].description}</p>
              <a className="work-link" href={projects[3].url}>
                Code ↗
              </a>
            </article>
          </div>
          <div className="project-grid secondary-projects">
            <article className="project-card">
              <figure className="work-preview">
                <Demo
                  src="/projects/langcommand.gif"
                  poster="/projects/langcommand-poster.jpg"
                  width={1000}
                  height={649}
                  label="LangCommand turning natural language into shell commands in a terminal"
                />
                <figcaption>
                  Natural language → shell commands · Local inference
                </figcaption>
              </figure>
              <div className="work-copy">
                <h3>
                  <a href={projects[2].url}>{projects[2].name}</a>
                </h3>
                <p className="work-meta">Local inference · C++ · llama.cpp</p>
                <p>{projects[2].description}</p>
                <div className="paper-links">
                  <a href={projects[2].url}>Code ↗</a>
                </div>
              </div>
            </article>
            <article className="project-card" id="nyaicon">
              <figure className="work-preview">
                <Demo
                  src="/projects/nyaicon.gif"
                  poster="/projects/nyaicon-poster.jpg"
                  label="NyaIcon switching between colorful Mac Dock icon themes"
                  width={800}
                  height={450}
                />
              </figure>
              <div className="work-copy">
                <h3>
                  <a href="https://nyaicon.com/">NyaIcon</a>
                </h3>
                <p className="work-meta">macOS app</p>
                <p>
                  An app I’m building to customize Mac app and folder icons.
                  Pick a theme, import your own images, and restore the
                  originals whenever you like.
                </p>
                <div className="paper-links">
                  <a href="https://nyaicon.com/">Website ↗</a>
                </div>
              </div>
            </article>
          </div>
        </section>
        <section
          id="open-source"
          className="content-section open-source-section"
        >
          <Heading title="Open-source Contributions" kind="projects" />
          <div className="project-list">
            {contributions.map((c) => (
              <article className="small-project" key={c.name}>
                <h3>
                  <a href={c.url}>{c.name} ↗</a>
                </h3>
                <p>{c.description}</p>
                <a className="work-link" href={c.example}>
                  Contribution ↗
                </a>
              </article>
            ))}
          </div>
        </section>
        <section id="research" className="content-section research-section">
          <Heading title="Publications" kind="research" />
          <div className="project-list">
            {publications.map((p) => (
              <article className="small-project" key={p.title}>
                <h3>
                  <a href={p.url}>{p.title} ↗</a>
                </h3>
                <p>{p.description}</p>
                <Authors names={p.authors} />
                <div className="compact-meta">
                  <span>
                    {p.venue} · {p.year}
                  </span>
                  <a href={p.url}>Paper ↗</a>
                </div>
              </article>
            ))}
          </div>
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
        <section id="writing" className="content-section writing-section">
          <Heading title="Blog" kind="writing" />
          <p className="blog-note">
            More notes on research and side projects to come.
          </p>
        </section>

        <footer>
          <span>© {new Date().getFullYear()} Mingfei Guo</span>
          <a href="#about">Back to top ↑</a>
        </footer>
      </main>
      <PageMotion />
      <Companion />
    </div>
  );
}
