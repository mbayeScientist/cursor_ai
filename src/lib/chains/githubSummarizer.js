import { z } from "zod";
import { BaseChain } from "./base/chain";

// Define the output schema using Zod
const summarizeRepoSchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("List of interesting facts about the repository"),
});

// Define the prompt template
const template = `Analyze the following GitHub repository README content and provide a structured summary.

README Content:
{readme_content}

Provide a comprehensive analysis. Be specific and insightful.`;

// Extend BaseChain for structured summarization
class GithubSummaryChain extends BaseChain {
  constructor() {
    super({
      schema: summarizeRepoSchema,
      template,
      inputVariables: ["readme_content"],
      temperature: 0.7,
    });
  }
}

// Function to run the chain
export async function summarizeRepository(readmeContent) {
  try {
    const chain = await new GithubSummaryChain().initialize();
    // Pass the input with the correct key
    return await chain.invoke({
      readme_content: readmeContent
    });
  } catch (error) {
    console.error("Error in repository summarization:", error);
    throw error;
  }
}
