// Only public, source-verified material belongs in this file.
// A future writing collection can replace the intentional empty blog state.
export const publications = [
    {
        year: '2026',
        venue: 'Preprint',
        title: 'Asset Harvester: Extracting 3D Assets from Autonomous Driving Logs for Simulation',
        authors:
            'Tianshi Cao, Jiawei Ren, Yuxuan Zhang, Jaewoo Seo, Jiahui Huang, Shikhar Solanki, Haotian Zhang, Mingfei Guo, Haithem Turki, Muxingzi Li, Yue Zhu, Sipeng Zhang, Zan Gojcic, Sanja Fidler, Kangxue Yin',
        description:
            'Turning sparse observations from real driving logs into complete, simulation-ready 3D assets.',
        url: 'https://arxiv.org/abs/2604.18468',
        project:
            'https://research.nvidia.com/labs/sil/projects/asset-harvester/',
    },
    {
        year: '2024',
        venue: 'CVPR',
        title: 'PromptCoT: Align Prompt Distribution via Adapted Chain-of-Thought',
        authors:
            'Junyi Yao, Yijiang Liu, Zhen Dong, Mingfei Guo, Helan Hu, Kurt Keutzer, Li Du, Daquan Zhou, Shanghang Zhang',
        description:
            'Refining text prompts to better align with the training distribution of visual generative models.',
        url: 'https://openaccess.thecvf.com/content/CVPR2024/papers/Yao_PromptCoT_Align_Prompt_Distribution_via_Adapted_Chain-of-Thought_CVPR_2024_paper.pdf',
    },
    {
        year: '2023',
        venue: 'Applied Sciences',
        title: 'SANA: Sensitivity-Aware Neural Architecture Adaptation for Uniform Quantization',
        authors: 'Mingfei Guo, Zhen Dong, Kurt Keutzer',
        description:
            'Adapting network architectures to preserve sensitive components and improve the accuracy of low-bit uniform quantization.',
        url: 'https://doi.org/10.3390/app131810329',
    },
    {
        year: '2023',
        venue: 'Preprint',
        title: 'Analyzing Quantization in TVM',
        authors: 'Mingfei Guo',
        description:
            'Investigating why low-bit inference can underperform, and finding compiler-level opportunities to make it faster.',
        url: 'https://arxiv.org/abs/2308.10905',
    },
    {
        year: '2022',
        venue: 'Preprint',
        title: 'UnrealNAS: Can We Search Neural Architectures with Unreal Data?',
        authors:
            'Zhen Dong, Kaicheng Zhou, Guohao Li, Qiang Zhou, Mingfei Guo, Bernard Ghanem, Kurt Keutzer, Shanghang Zhang',
        description:
            'Exploring neural architecture search with synthetic images, random labels, and even Gaussian noise.',
        url: 'https://arxiv.org/abs/2205.02162',
    },
    {
        year: '2021',
        venue: 'WWW Workshop',
        title: 'How does Truth Evolve into Fake News? An Empirical Study of Fake News Evolution',
        authors: 'Mingfei Guo, Xiuying Chen, Juntao Li, Dongyan Zhao, Rui Yan',
        description:
            'Introducing the Fake News Evolution dataset to study how truthful reporting changes into misinformation as it spreads.',
        url: 'https://arxiv.org/abs/2103.05944',
    },
];
export const projects = [
    {
        name: '3D Gaussian Splatting',
        tag: 'GRAPHICS · PYTHON',
        description:
            'A from-scratch implementation in NVIDIA Warp. One readable codebase, on CPU and GPU.',
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
            'Describe what you want to do. Turn natural language into shell commands with local inference.',
        url: 'https://github.com/guoriyue/LangCommand',
    },
    {
        name: 'InverseUI',
        tag: 'AUTOMATION · TOOLS',
        description:
            'Record browser workflows and turn them into reusable, intent-aware automation scripts.',
        url: 'https://github.com/InverseUI/InverseUI-Recorder',
    },
    {
        name: 'Flash Attention in Slang',
        tag: 'GPU KERNELS · VULKAN',
        description:
            'An experimental forward and backward attention implementation using tensor cores through Vulkan.',
        url: 'https://github.com/guoriyue/flash-attention-slang',
    },
    {
        name: 'Llama 3, in Warp',
        tag: 'FROM SCRATCH · INFERENCE',
        description:
            'Rebuilding Llama 3 inference with NVIDIA Warp, with a PyTorch implementation for comparison.',
        url: 'https://github.com/guoriyue/warp-llama3-scratch',
    },
];

export const experience = [
    {
        organization: 'NVIDIA',
        role: 'Software Engineer · Synthetic Data & Autonomous Driving',
        period: 'Apr 2024 — Present',
        description:
            'Building neural reconstruction and synthetic-data pipelines with NuRec and DRIVE Sim. My work includes dynamic Gaussian pedestrian animation and faster visual-data preprocessing with GPU codecs and TensorRT.',
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
        detail: 'Teaching assistant for Data Mining, Spring 2022. Designed a term project on quantization of GANs.',
        url: 'https://github.com/guoriyue/PKU-Data-Mining-2022-TA',
        linkLabel: 'Teaching materials',
    },
];
export const contributions = [
    {
        name: 'Triton',
        description:
            'GPU compiler correctness and performance, plus batched TMA GEMM test coverage on SM120.',
        url: 'https://github.com/triton-lang/triton/pulls?q=is%3Apr+author%3Aguoriyue+is%3Amerged',
        example: 'https://github.com/triton-lang/triton/pull/10839',
    },
    {
        name: 'vLLM',
        description:
            'Cosmos3-Super model registration and registry test coverage.',
        url: 'https://github.com/vllm-project/vllm/pull/48211',
        example: 'https://github.com/vllm-project/vllm/pull/48211',
    },
];
