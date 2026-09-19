import type { Metadata } from 'next';
import Companion from '../../companion';

export const dynamic = 'force-static';

const title = 'Building VRL: notes on training infrastructure';
const description =
  'An example post about rollouts, rewards, and the systems around visual-model post-training.';
const preview = 'https://guoriyue.github.io/projects/vrl-sd35-text.jpg';
export const metadata: Metadata = {
  title: `${title} · Mingfei Guo`,
  description,
  openGraph: {
    type: 'article',
    title,
    description,
    url: 'https://guoriyue.github.io/blog/building-vrl/',
    images: [
      {
        url: preview,
        width: 1730,
        height: 2020,
        alt: 'SD3.5 OCR GRPO qualitative comparison',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [preview],
  },
};

export default function BlogPost() {
  return (
    <>
      <nav className="navigation" aria-label="Main navigation">
        <div>
          <a href="/">About</a>
          <a href="/#work">Projects</a>
          <a href="/#experience">Experience</a>
          <a href="/#education">Education</a>
          <a href="/#writing" aria-current="location">
            Blog
          </a>
        </div>
      </nav>
      <main className="blog-article" id="main">
        <a className="back-link" href="/#writing">
          ← All notes
        </a>
        <header className="post-header">
          <p className="post-label">Example post · ML infrastructure</p>
          <h1>{title}</h1>
          <p className="post-intro">
            Rollouts, rewards, and the systems around visual-model
            post-training.
          </p>
        </header>
        <aside className="example-note">
          This is a sample article to try out the blog layout. It will be
          replaced with a full write-up.
        </aside>
        <div className="post-body">
          <p>
            A training algorithm is only one part of a usable training system.
            Samples have to be generated, rewards computed, weights
            synchronized, and checkpoints saved. Those pieces need to work
            together before an experiment is easy to repeat or debug.
          </p>
          <p>
            <a href="https://github.com/guoriyue/VRL">VRL / visual-rl</a> brings
            visual generative models into a shared post-training loop, with
            separate configuration for models, rewards, algorithms, and
            execution.
          </p>
          <h2>Start with one loop</h2>
          <p>
            The basic path is{' '}
            <strong>
              collect rollouts → evaluate rewards → update the policy
            </strong>
            . Keeping those steps explicit makes it easier to trace an
            experiment: which model produced a sample, how it was scored, and
            which update consumed it.
          </p>
          <h2>Keep the systems visible</h2>
          <p>
            Ray rollouts, DDP / FSDP training, weight synchronization, and
            checkpointing are infrastructure concerns as well as algorithm
            concerns. Separating them from model and reward configuration helps
            make experiments easier to inspect.
          </p>
          <h2>A concrete example: text in images</h2>
          <p>
            The public SD3.5 example uses GRPO with an OCR reward. The paired
            images below show qualitative changes in text rendering. Some
            examples become more legible; others still contain misspellings.
            These selected images are an illustration, not an aggregate
            benchmark.
          </p>
          <figure className="post-figure">
            <a href="/projects/vrl-sd35-text.jpg">
              <img
                src="/projects/vrl-sd35-text.jpg"
                alt="Paired SD3.5 images before and after OCR GRPO, including signs, maps, and handwriting"
                width="1730"
                height="2020"
                loading="lazy"
              />
            </a>
            <figcaption>
              SD3.5 OCR GRPO · Selected before / after pairs. Click to open the
              full image.
            </figcaption>
          </figure>
          <p>
            The{' '}
            <a href="https://github.com/guoriyue/VRL/tree/main/docs/training_examples/sd3_5_ocr_grpo">
              training example
            </a>{' '}
            documents the recipe and its limitations.
          </p>
          <h2>For a future write-up</h2>
          <p>
            A fuller post could follow one experiment from configuration to
            generated samples, then examine rollout latency, reward evaluation,
            and memory use. This sample leaves that investigation for a future
            article.
          </p>
        </div>
        <a className="back-link" href="/#writing">
          ← Back to the blog
        </a>
      </main>
      <Companion />
    </>
  );
}
