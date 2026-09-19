import { ArrowUpRight, Code2, Mail, MapPin } from 'lucide-react';
import { publications, projects } from './content';
import Companion from './companion';

export default function Home() {
    return (
        <div className="site-shell">
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <aside className="sidebar">
                <a href="#about" className="identity">
                    <img
                        className="portrait"
                        src="/portrait.jpg"
                        alt="Mingfei Guo"
                    />
                    <h1>
                        Mingfei Guo<span>@guoriyue</span>
                    </h1>
                </a>
                <p className="role">
                    Research & engineering
                    <br />
                    <strong>NVIDIA</strong>
                </p>
                <p className="location">
                    <MapPin size={13} /> San Francisco Bay Area
                </p>
                <div className="socials">
                    <a href="https://github.com/guoriyue" aria-label="GitHub">
                        <Code2 size={18} />
                    </a>
                    <a href="https://x.com/MingfeiGuo" aria-label="X / Twitter">
                        𝕏
                    </a>
                    <a href="mailto:mingfeiguoo@gmail.com" aria-label="Email">
                        <Mail size={18} />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/mingfeiguo"
                        aria-label="LinkedIn"
                    >
                        in
                    </a>
                </div>
                <nav aria-label="On this page">
                    <a href="#about">
                        <span>01</span> About
                    </a>
                    <a href="#research">
                        <span>02</span> Research
                    </a>
                    <a href="#projects">
                        <span>03</span> Projects
                    </a>
                    <a href="#writing">
                        <span>04</span> Writing
                    </a>
                </nav>
                <Companion />
                <p className="sidebar-note">
                    A little corner of the internet.
                    <br />
                    Always a work in progress.
                </p>
            </aside>
            <main id="main">
                <section id="about" className="intro">
                    <p className="eyebrow">
                        <span className="status-dot" /> RESEARCHER, ENGINEER &
                        CURIOUS BUILDER
                    </p>
                    <h2>
                        From pixels to possibilities
                        <span className="accent">.</span>
                    </h2>
                    <p className="lead">
                        Hi, I’m Mingfei. I work on visual computing and build
                        tools that make complex ideas a little more tangible.
                    </p>
                    <p>
                        My work spans{' '}
                        <strong>3D reconstruction and generation</strong>,
                        efficient machine learning, and GPU programming. I’m at{' '}
                        <a href="https://www.nvidia.com">NVIDIA</a>, and
                        previously studied at{' '}
                        <a href="https://www.stanford.edu">Stanford</a> and{' '}
                        <a href="https://english.pku.edu.cn">
                            Peking University
                        </a>
                        .
                    </p>
                    <p>
                        I like understanding things by building them from
                        scratch—and sharing what I learn along the way. I also
                        have a soft spot for border collies.
                    </p>
                    <div className="interests">
                        <span>Visual computing</span>
                        <span>ML systems</span>
                        <span>Useful little tools</span>
                    </div>
                </section>
                <section id="research">
                    <div className="section-heading">
                        <h2>
                            <span className="section-mark">✳</span> Selected
                            research
                        </h2>
                        <span className="section-note">
                            PAPERS & EXPLORATIONS
                        </span>
                    </div>
                    {publications.map((p) => (
                        <article className="paper" key={p.title}>
                            <div className="paper-year">
                                {p.year}
                                <span>{p.venue}</span>
                            </div>
                            <div>
                                <h3>
                                    <a href={p.url}>
                                        {p.title} <ArrowUpRight size={16} />
                                    </a>
                                </h3>
                                <p className="authors">
                                    {p.authors
                                        .split('Mingfei Guo')
                                        .map((part, i) => (
                                            <span key={i}>
                                                {i > 0 && (
                                                    <strong>Mingfei Guo</strong>
                                                )}
                                                {part}
                                            </span>
                                        ))}
                                </p>
                                <p>{p.description}</p>
                                <div className="paper-links">
                                    <a className="text-link" href={p.url}>
                                        Paper ↗
                                    </a>
                                    {p.project && (
                                        <a
                                            className="text-link"
                                            href={p.project}
                                        >
                                            Project page ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
                <section id="projects">
                    <div className="section-heading">
                        <h2>
                            <span className="section-mark">⌘</span> Things I’ve
                            built
                        </h2>
                        <a
                            className="text-link"
                            href="https://github.com/guoriyue"
                        >
                            All projects ↗
                        </a>
                    </div>
                    <div className="project-grid">
                        {projects.map((p) => (
                            <a
                                className="project-card"
                                key={p.url}
                                href={p.url}
                            >
                                <span className="project-tag">{p.tag}</span>
                                <h3>
                                    {p.name}
                                    <ArrowUpRight size={18} />
                                </h3>
                                <p>{p.description}</p>
                                <span className="project-link">
                                    Explore project ↗
                                </span>
                            </a>
                        ))}
                    </div>
                    <aside
                        className="project-teaser"
                        aria-label="TinyTriton, in development"
                    >
                        <div>
                            <span className="tiny-label">ON THE WORKBENCH</span>
                            <h3>
                                TinyTriton <span>In development</span>
                            </h3>
                            <p>
                                A hands-on GPU compiler course in six
                                milestones. Build from a small interpreter
                                toward CUDA, LLVM/PTX, reductions, and attention
                                kernels.
                            </p>
                        </div>
                    </aside>
                    <p className="project-footnote">
                        Built to understand. Shared for others to explore.
                    </p>
                </section>
                <section id="writing">
                    <div className="section-heading">
                        <h2>
                            <span className="section-mark">↳</span> Notes from
                            the workbench
                        </h2>
                        <span className="section-note">BLOG</span>
                    </div>
                    <div className="writing-empty">
                        <span className="tiny-label">A SPACE FOR THOUGHTS</span>
                        <h3>Something is taking shape.</h3>
                        <p>
                            Notes on research, things I’m building, and the
                            occasional rabbit hole.
                            <br />
                            The first post is still brewing. Come back soon.
                        </p>
                        <span className="coming-soon">
                            <span className="status-dot" /> COMING SOON
                        </span>
                    </div>
                </section>
                <footer>
                    <span>© {new Date().getFullYear()} Mingfei Guo</span>
                    <a href="mailto:mingfeiguoo@gmail.com">
                        Say hello <ArrowUpRight size={14} />
                    </a>
                    <a href="#about">Back to top ↑</a>
                </footer>
            </main>
        </div>
    );
}
