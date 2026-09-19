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
