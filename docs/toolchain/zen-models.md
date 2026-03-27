# OpenCode Zen Free Models

No API key required. No rate limit.

| Model ID | Strengths | Use for |
|---|---|---|
| opencode/big-pickle-max | Best Zen quality | Primary Tier 1 fallback |
| opencode/big-pickle-high | Good quality, faster | General coding fallback |
| opencode/big-pickle | Fast, reliable | Simple tasks |
| opencode/minimax-m2.5-free | Best tool-calling in Zen | API routes, structured output |
| opencode/mimo-v2-pro-free | General purpose | Boilerplate |
| opencode/mimo-v2-omni-free | Fast | Very simple tasks only |
| opencode/nemotron-3-super-free | Weakest | Last resort |

NVIDIA Build (free at 40 RPM — higher quality than Zen):
| nvidia/kimi-k2.5 | Strong complex code | Integration tasks |
| nvidia/glm-5 | Strong visual reasoning | Design rule checking |
| nvidia/qwen-3.5-397b | Fast, reliable | Boilerplate |

Dispatch syntax:
  opencode run --model opencode/big-pickle-max "[prompt]" > output.md
  opencode run --model nvidia/kimi-k2.5 "[prompt]" > output.md
