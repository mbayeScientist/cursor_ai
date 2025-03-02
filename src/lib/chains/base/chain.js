import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

export class BaseChain {
  constructor(options = {}) {
    const {
      modelName = "gemini-1.5-pro",
      temperature = 0.7,
      schema = null,
      template = "",
      inputVariables = []
    } = options;

    this.modelName = modelName;
    this.temperature = temperature;
    this.schema = schema;
    this.template = template;
    this.inputVariables = inputVariables;
  }

  async initialize() {
    // Initialize Gemini model
    this.model = new ChatGoogleGenerativeAI({
      modelName: this.modelName,
      temperature: this.temperature,
      apiKey: process.env.GOOGLE_API_KEY // Make sure to add this to your .env.local
    });

    if (this.schema) {
      // Create parser from schema
      this.parser = StructuredOutputParser.fromZodSchema(this.schema);
      
      // Create the prompt template with all input variables
      const promptTemplate = new PromptTemplate({
        template: `${this.template}\n\n{format_instructions}`,
        inputVariables: [...this.inputVariables, "format_instructions"]
      });

      // Create the chain
      this.chain = RunnableSequence.from([
        {
          // Map input to include both original input and format instructions
          format_instructions: () => this.parser.getFormatInstructions(),
          readme_content: (input) => input.readme_content
        },
        promptTemplate,
        this.model,
        this.parser
      ]);
    } else {
      // Simple chain without parser
      this.promptTemplate = new PromptTemplate({
        template: this.template,
        inputVariables: this.inputVariables
      });
      
      this.chain = RunnableSequence.from([
        this.promptTemplate,
        this.model
      ]);
    }

    return this;
  }

  async invoke(input) {
    try {
      if (!this.chain) {
        await this.initialize();
      }

      // Use the chain's invoke method directly
      return await this.chain.invoke(input);
    } catch (error) {
      console.error("Chain invocation error:", error);
      throw error;
    }
  }
} 