import { SequenceModelArchitecture } from "../types/nlp";

export const SEQUENCE_MODELS_LIST: SequenceModelArchitecture[] = [
  {
    id: "hmm",
    name: "Hidden Markov Model (HMM)",
    category: "Markov / Statistical",
    formula: "P(W, T) = \\prod_{i=1}^n P(t_i | t_{i-1}) P(w_i | t_i)",
    description: "Generative probabilistic sequence model modeling joint probability of observations and hidden state sequence. Uses the Viterbi dynamic programming algorithm for maximum-likelihood state decoding.",
    strengths: ["Fast $O(N \\cdot K^2)$ decoding", "Simple parameter estimation via frequency counts", "Great baseline for POS tagging"],
    limitations: ["Independence assumptions are strict", "Cannot easily condition on rich non-local token features"],
    hyperparameters: [
      { name: "Hidden States (K)", value: 36, description: "Number of unique grammatical POS tags" },
      { name: "Smoothing", value: "Laplace +1", description: "Emission probability denominator smoothing" }
    ]
  },
  {
    id: "crf",
    name: "Linear-Chain Conditional Random Field (CRF)",
    category: "Markov / Statistical",
    formula: "P(Y|X) = \\frac{1}{Z(X)} \\exp\\left(\\sum_{i,k} \\lambda_k f_k(y_{i-1}, y_i, X, i)\\right)",
    description: "Discriminative undirected probabilistic graphical model. Solves the label bias problem of MEMMs by global sequence normalization $Z(X)$ and allows arbitrary overlapping features across the input sentence.",
    strengths: ["Global normalization prevents label bias", "Supports rich arbitrary features (prefixes, capitalization, shapes)", "Industry gold-standard for traditional NER"],
    limitations: ["High training compute cost", "Requires hand-crafted feature engineering templates"],
    hyperparameters: [
      { name: "L2 Regularization (C)", value: 1.0, description: "Weight penalty on feature weights" },
      { name: "Max Iterations", value: 100, description: "L-BFGS optimization epoch count" }
    ]
  },
  {
    id: "rnn",
    name: "Recurrent Neural Network (Vanilla RNN)",
    category: "Recurrent",
    formula: "h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)",
    description: "Neural sequence model processing sequential tokens step-by-step with a recurrent hidden state vector capturing previous context history.",
    strengths: ["Handles variable-length input sequences", "Weight sharing across all time steps", "Learns non-linear representation manifolds"],
    limitations: ["Vanishing & exploding gradients on sequences > 15 tokens", "Sequential processing prevents hardware parallelization"],
    hyperparameters: [
      { name: "Hidden Dim (d_h)", value: 256, description: "Dimensionality of recurrent state vector" },
      { name: "Gradient Clip Norm", value: 5.0, description: "Threshold preventing exploding gradient explosions" }
    ]
  },
  {
    id: "lstm",
    name: "Long Short-Term Memory (LSTM)",
    category: "Recurrent",
    formula: "f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f), \\quad C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t",
    description: "Gated recurrent network featuring a constant error carousel cell state ($C_t$) regulated by Forget ($f_t$), Input ($i_t$), and Output ($o_t$) gating mechanisms.",
    strengths: ["Eliminates vanishing gradients via additive cell highway", "Maintains long-range context dependencies (100+ tokens)", "Excellent for sequence labeling and BiLSTM-CRF NER"],
    limitations: ["Sequential recurrence cannot be fully parallelized across GPU cores", "Higher computational parameter count than GRU"],
    hyperparameters: [
      { name: "Cell State Dim", value: 512, description: "Internal memory highway capacity" },
      { name: "Bidirectional", value: "True", description: "Concatenates forward and backward context states" },
      { name: "Dropout", value: 0.2, description: "Recurrent dropout probability" }
    ]
  },
  {
    id: "transformer_attention",
    name: "Transformer Self-Attention (Multi-Head)",
    category: "Attention & Transformer",
    formula: "\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V",
    description: "Fully parallelizable attention-only architecture computing pairwise relationship scores between every word pair simultaneously via Query, Key, and Value matrix projections.",
    strengths: ["$O(1)$ maximum path length between distant tokens", "Massive parallel training throughput on GPUs/TPUs", "Powers state-of-the-art LLMs (BERT, GPT, Gemini)"],
    limitations: ["$O(N^2)$ quadratic computational and memory complexity with respect to sequence length"],
    hyperparameters: [
      { name: "Attention Heads (h)", value: 8, description: "Number of parallel attention subspaces" },
      { name: "Key Dimension (d_k)", value: 64, description: "Projection dimension per head (total d_model = 512)" },
      { name: "Positional Encoding", value: "RoPE / Sinusoidal", description: "Injects order information into permutation-invariant attention" }
    ]
  }
];
