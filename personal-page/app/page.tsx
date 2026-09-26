import {
  publications,
  projects,
  experience,
  education,
  contributions,
} from './content';
import Companion from './companion';
import Demo from './demo';
import Sheepdog from './sheepdog';
import PageMotion from './page-motion';
import Portrait from './portrait';
import { formatDate, getPosts } from './posts';

const sections = [
  ['about', 'About'],
  ['work', 'Projects'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['personal', 'Personal'],
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

export default async function Home() {
  const posts = await getPosts();
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
            <p>
              I work on generative video models and 3D reconstruction, with a
              focus on systems ML and GPU performance. At{' '}
              <a href="https://www.nvidia.com/">NVIDIA</a>, I build the
              infrastructure behind neural reconstruction and simulation for
              autonomous driving.
            </p>
            <p>
              I received my MS from Stanford and my BS from Peking University.
              Outside work, I write GPU kernels and make small apps.
            </p>
            <div className="social-links">
              <a href="mailto:mingfeiguoo@gmail.com">Email</a>
              <a href="https://github.com/guoriyue">GitHub</a>
              <a href="https://x.com/MingfeiGuo">Twitter / X</a>
              <a href="https://www.linkedin.com/in/mingfeiguo">LinkedIn</a>
            </div>
          </div>
          <Portrait />
        </section>

        <section
          id="work"
          className="content-section work-section projects-section"
        >
          <Heading title="Selected Projects" kind="projects" />
          <div id="projects" className="project-grid">
            <article className="project-card" id="nurec">
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
                  Re-render a recorded drive through a different camera rig —
                  new mounting positions, intrinsics, and lens models (pinhole,
                  fisheye, f-theta) — so perception for a new vehicle platform
                  can be trained before that platform has real data. Scenes are
                  3D Gaussian splatting reconstructions of six-camera drives;
                  the public Physical AI NuRec Dataset ships 1,500+ of them.
                </p>
                <p>
                  Training on the re-rendered data improved detection precision
                  and recall in every object category over a zero-shot baseline.
                  I work on NuRec’s reconstruction infrastructure and
                  performance, and coauthored this walkthrough.
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
            <article className="project-card" id="asset-harvester">
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
                  Neural reconstruction turns a driving log into a scene, but
                  not into objects you can move or view from a new angle. Asset
                  Harvester takes the few, limited-angle views a log has of a
                  vehicle or pedestrian and produces a complete 3D Gaussian
                  asset: SparseViewDiT generates the missing views, then a
                  lifting stage fits Gaussians to them.
                </p>
                <p>
                  The system-level work is what makes it hold up on real data —
                  large-scale curation of object-centric training tuples,
                  geometry-aware preprocessing across sensors, augmentation,
                  and self-distillation.
                </p>
                <div className="paper-links">
                  <a href={featured.project}>Project & results ↗</a>
                  <a href={featured.url}>Paper ↗</a>
                </div>
              </div>
            </article>
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
                  RL post-training for diffusion and flow models, built because
                  LLM-RL frameworks assume a categorical token action. A visual
                  policy’s step is a denoise transition over latents, its reward
                  is computed on decoded pixels or video, and its conditioning
                  is an image or video rather than a text prefix — so VRL keeps
                  those semantics explicit behind one Collector → Evaluator →
                  Algorithm loop that covers both full-sequence and
                  chunk-autoregressive generation.
                </p>
                <p>
                  Model, reward (OCR, aesthetic, CLIP, PickScore, VideoReward),
                  algorithm (GRPO, DPO, DiffusionNFT, Flow-DPPO), and
                  distributed settings compose from YAML layers. 20+ image and
                  video families are wired in — SD3.5, FLUX, Wan 2.1/2.2,
                  HunyuanVideo, CogVideoX, Cosmos-Predict2 — and a recipe only
                  counts as validated once a real run shows rising reward and
                  changed weights. The SD3.5 OCR-GRPO run above is one.
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
                  The whole 3D Gaussian Splatting method — projection,
                  rasterization, the backward pass, Adam, and densify / prune —
                  reimplemented in Python with NVIDIA Warp instead of the
                  reference CUDA. The same kernels run on CPU or GPU with a
                  one-line config change, so the method fits in a handful of
                  readable files and trains on a laptop.
                </p>
                <p>
                  Forward and backward follow graphdeco-inria’s reference
                  implementation; densification follows
                  gaussian-splatting-lightning, restructured to strip data
                  preparation down to the minimum.
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
                <figcaption>Mac app and folder icon themes</figcaption>
              </figure>
              <div className="work-copy">
                <h3>
                  <a href="https://nyaicon.com/">NyaIcon</a>
                </h3>
                <p className="work-meta">macOS app</p>
                <p>
                  A macOS Tahoe app I’m building to re-theme app and folder
                  icons: pick a theme or import your own PNG / ICNS, apply it to
                  one app or all of them, and restore the originals any time.
                  Every change goes through the system’s IconServices helper, so
                  it never disables SIP or modifies sealed system bundles. Free,
                  no account.
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
          <Heading title="Open Source Contributions" kind="contributions" />
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
        <section id="personal" className="content-section personal-section">
          <Heading title="Personal" kind="personal" />
          <div className="personal-copy">
            <p>
              Away from code, I enjoy playing riichi mahjong. My favorite games
              include the <strong>Hollow Knight</strong> series,
              <strong> Rain World</strong>, and the <strong>Nikki</strong>{' '}
              dress-up games.
            </p>
            <Sheepdog />
          </div>
        </section>
        <section id="writing" className="content-section writing-section">
          <Heading title="Blog" kind="writing" />
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.slug} className="post-list-item">
                <a href={`/blog/${post.slug}/`}>{post.title}</a>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.description ? <p>{post.description}</p> : null}
              </li>
            ))}
          </ul>
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
