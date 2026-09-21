// Only public, source-verified material belongs in this file.
// A future writing collection can replace the intentional empty blog state.
export const publications = [
  {
    year: '2026',
    venue: 'Preprint',
    title:
      'Asset Harvester: Extracting 3D Assets from Autonomous Driving Logs for Simulation',
    authors:
      'Tianshi Cao, Jiawei Ren, Yuxuan Zhang, Jaewoo Seo, Jiahui Huang, Shikhar Solanki, Haotian Zhang, Mingfei Guo, Haithem Turki, Muxingzi Li, Yue Zhu, Sipeng Zhang, Zan Gojcic, Sanja Fidler, Kangxue Yin',
    description:
      'An image-to-3D pipeline — SparseViewDiT for sparse-view-conditioned multiview generation, then 3D Gaussian lifting — that turns the few, limited-angle views a driving log has of an object into a complete, simulation-ready asset.',
    url: 'https://arxiv.org/abs/2604.18468',
    project: 'https://research.nvidia.com/labs/sil/projects/asset-harvester/',
  },
  {
    year: '2024',
    venue: 'CVPR',
    title: 'PromptCoT: Align Prompt Distribution via Adapted Chain-of-Thought',
    authors:
      'Junyi Yao, Yijiang Liu, Zhen Dong, Mingfei Guo, Helan Hu, Kurt Keutzer, Li Du, Daquan Zhou, Shanghang Zhang',
    description:
      'Prompts that read like the captions of high-quality training images generate better images. PromptCoT fine-tunes an LLM on such captions and uses chain-of-thought to align each user prompt with its refined version, using per-dataset adapters on one shared LLM instead of a model per dataset.',
    url: 'https://openaccess.thecvf.com/content/CVPR2024/papers/Yao_PromptCoT_Align_Prompt_Distribution_via_Adapted_Chain-of-Thought_CVPR_2024_paper.pdf',
  },
  {
    year: '2023',
    venue: 'Applied Sciences',
    title:
      'SANA: Sensitivity-Aware Neural Architecture Adaptation for Uniform Quantization',
    authors: 'Mingfei Guo, Zhen Dong, Kurt Keutzer',
    description:
      'Mixed-precision quantization protects sensitive layers but runs poorly on GPUs and CPUs. SANA instead adapts the architecture itself from a per-layer sensitivity analysis so uniform low-bit quantization keeps accuracy, with four channel-initialization strategies to shorten fine-tuning. ResNet-50-SANA at W4A8 (24.4 MB) reaches 77.8% ImageNet top-1, above the 77.6% of full-precision ResNet-50 (97.8 MB).',
    url: 'https://doi.org/10.3390/app131810329',
  },
  {
    year: '2023',
    venue: 'Preprint',
    title: 'Analyzing Quantization in TVM',
    authors: 'Mingfei Guo',
    description:
      '8-bit inference in TVM ran about 2× slower than FP32 instead of faster. I traced it to a graph-construction bug, then optimized the quantized path to finish 164% faster than the TVM baseline on a compute-bound workload and 195% faster on a memory-bound one.',
    url: 'https://arxiv.org/abs/2308.10905',
  },
  {
    year: '2022',
    venue: 'Preprint',
    title: 'UnrealNAS: Can We Search Neural Architectures with Unreal Data?',
    authors:
      'Zhen Dong, Kaicheng Zhou, Guohao Li, Qiang Zhou, Mingfei Guo, Bernard Ghanem, Kurt Keutzer, Shanghang Zhang',
    description:
      'Does NAS need real data? Searching on randomly labeled real images, generated images, or even Gaussian noise with random labels yields architectures that match conventional NAS on CIFAR, ImageNet, and CheXpert.',
    url: 'https://arxiv.org/abs/2205.02162',
  },
  {
    year: '2021',
    venue: 'WWW Workshop',
    title:
      'How does Truth Evolve into Fake News? An Empirical Study of Fake News Evolution',
    authors: 'Mingfei Guo, Xiuying Chen, Juntao Li, Dongyan Zhao, Rui Yan',
    description:
      'The Fake News Evolution dataset: 950 article triples tracing a story from truth to fake news to evolved fake news, with an analysis of how disinformation techniques, keywords, sentiment, and part-of-speech distributions shift at each step.',
    url: 'https://arxiv.org/abs/2103.05944',
  },
];
export const projects = [
  {
    name: '3D Gaussian Splatting',
    tag: 'GRAPHICS · PYTHON',
    description:
      '3D Gaussian Splatting training and rendering in Python and NVIDIA Warp, running on CPU or GPU.',
    url: 'https://github.com/guoriyue/3dgs-warp-scratch',
  },
  {
    name: 'VRL / visual-rl',
    tag: 'VISUAL GENERATION · RL',
    description:
      'A shared post-training loop for visual generative models, with configurable rollouts, rewards, and algorithms.',
    url: 'https://github.com/guoriyue/VRL',
  },
  {
    name: 'LangCommand',
    tag: 'LOCAL AI · C++',
    description:
      'Describe what you want in plain language and get a runnable shell command back, with an optional explanation, entirely on-device via llama.cpp. Single-shot or loop mode; ships with Qwen2.5-Coder-7B, Qwen2.5-7B, Llama-3.2-1B / 3B, and CodeLlama-13B configs, or bring your own model and system prompt.',
    url: 'https://github.com/guoriyue/LangCommand',
  },
  {
    name: 'InverseUI',
    tag: 'AUTOMATION · TOOLS',
    description:
      'Record a browser workflow once in the Chrome extension and get Playwright code back with detected intent, typed parameters, and reusable functions. The CLI runs recordings locally with your own credentials, and an AI fix command retries failing scripts with AI-generated patches.',
    url: 'https://github.com/InverseUI/InverseUI-Recorder',
  },
  {
    name: 'Flash Attention in Slang',
    tag: 'TENSOR CORES · VULKAN · SLANG',
    description:
      'Forward and backward flash attention in Slang on Vulkan. VK_NV_cooperative_matrix2 drives the QKᵀ and PV GEMMs on tensor cores — S and O stay in cooperative-matrix registers across the softmax — and Split-K spreads work across SMs. On an RTX 5090 (head dim 64, fwd+bwd) it is 1.7–2.7× faster than PyTorch SDPA at sequence lengths 128–2048, and ahead of flash_attn up to 512.',
    url: 'https://github.com/guoriyue/flash-attention-slang',
  },
  {
    name: 'Llama 3, in Warp',
    tag: 'LLM INFERENCE · NVIDIA WARP · PROFILING',
    description:
      'Llama 3 inference with everything but tokenization and weight loading written as NVIDIA Warp kernels, plus tiled variants. FP32 outputs match the PyTorch reference; profiling (1.06 s vs 0.31 s per run) showed tiling barely helps because the kernels are already SIMT — a useful negative result.',
    url: 'https://github.com/guoriyue/warp-llama3-scratch',
  },
];

export const experience = [
  {
    organization: 'NVIDIA',
    role: 'Software Engineer · Infrastructure, Performance & Simulation',
    period: 'Apr 2024 — Present',
    description:
      'Building and optimizing infrastructure for neural reconstruction and synthetic-data pipelines with NuRec and DRIVE Sim. My work includes dynamic Gaussian pedestrian animation and faster visual-data preprocessing with GPU codecs and TensorRT.',
  },
  {
    organization: 'NVIDIA',
    role: 'Software Engineering Intern · Omniverse',
    period: 'Jun — Sep 2023',
    description:
      'Improved Omniverse Replicator writer throughput by 2× using SIMD data parallelism and an asynchronous task queue.',
  },
  {
    organization: 'Graph Origin',
    role: 'Research Engineering Intern · Graphics & Compilers',
    period: 'Jul — Aug 2022',
    description:
      'Worked on graphics and compiler performance, including optimization of low-bit convolution kernels in TVM.',
  },
  {
    organization: 'Google',
    role: 'Software Engineering Intern · APIs & Data Pipelines',
    period: 'Jun — Oct 2021',
    description:
      'Built an ETL pipeline and an interactive frontend for filtering, querying, and visualizing vendor data.',
  },
];
export const education = [
  {
    school: 'Stanford University',
    period: '2022 — 2024',
    degree: 'MS, Electrical Engineering',
    focus: 'Software / hardware systems',
    detail: 'Teaching assistant for CS149: Parallel Computing, Autumn 2023.',
    url: 'https://github.com/stanford-cs149/cs149gpt',
    linkLabel: 'CS149 project',
  },
  {
    school: 'Peking University',
    period: '2018 — 2022',
    degree: 'BS, Electronic Engineering and Computer Science',
    focus: 'AI / ML · Magna cum laude · Top 10%',
    detail:
      'Teaching assistant for Data Mining, Spring 2022. Designed a term project on quantization of GANs.',
    url: 'https://github.com/guoriyue/PKU-Data-Mining-2022-TA',
    linkLabel: 'Teaching materials',
  },
];
export const contributions = [
  {
    name: 'Triton',
    description:
      'Merged fixes across the compiler: TritonGPU layout selection and loop flattening, frontend condition normalization, JIT cache-key correctness under nonlocal shadowing, and NVIDIA / AMD backend work — hoisting the L2 cache-policy register out of the vectorization loop, unique registers for in-thread layout conversions, and sm120 TMA GEMM test coverage.',
    url: 'https://github.com/triton-lang/triton/pulls?q=is%3Apr+author%3Aguoriyue+is%3Amerged',
    example: 'https://github.com/triton-lang/triton/pull/10839',
  },
  {
    name: 'vLLM',
    description:
      'Turned on the registry-driven initialization, multimodal-processing, and tensor-schema tests for NVIDIA Cosmos3 once its checkpoint went public, and registered Cosmos3-Super after verifying it maps to the same modules (64 layers vs 36).',
    url: 'https://github.com/vllm-project/vllm/pull/48211',
    example: 'https://github.com/vllm-project/vllm/pull/48211',
  },
];
