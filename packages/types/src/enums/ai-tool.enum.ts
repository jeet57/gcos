/**
 * AI development tools tracked in ai_tool_sessions.
 * Mirrors ai_tool_sessions.tool CHECK constraint (M03).
 */
export enum AiTool {
  CLAUDE_CODE = 'claude_code',
  CURSOR = 'cursor',
  MCP = 'mcp',
  OPENAI_API = 'openai_api',
  VERCEL_AI_SDK = 'vercel_ai_sdk',
  OTHER = 'other',
}

export const AI_TOOL_LABELS: Record<AiTool, string> = {
  [AiTool.CLAUDE_CODE]: 'Claude Code',
  [AiTool.CURSOR]: 'Cursor',
  [AiTool.MCP]: 'MCP',
  [AiTool.OPENAI_API]: 'OpenAI API',
  [AiTool.VERCEL_AI_SDK]: 'Vercel AI SDK',
  [AiTool.OTHER]: 'Other',
};
