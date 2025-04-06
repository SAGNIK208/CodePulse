import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestCase {
  input: string;
  output: string;
}

export interface ICodeStub {
  language: "CPP" | "JAVA" | "PYTHON" | "JAVASCRIPT";
  startSnippet?: string;
  userSnippet?: string;
  endSnippet?: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  testCases: ITestCase[];
  codeStubs: ICodeStub[];
  editorial?: string;
  tags?: string[];
}

const problemSchema: Schema<IProblem> = new Schema(
  {
    title: {
      type: String,
      required: [true, "title cannot be empty"],
    },
    description: {
      type: String,
      required: [true, "description cannot be empty"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Difficulty cannot be empty"],
      default: "easy",
    },
    testCases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
    codeStubs: [
      {
        language: {
          type: String,
          enum: ["CPP", "JAVA", "PYTHON","JAVASCRIPT"],
          required: true,
        },
        startSnippet: { type: String },
        userSnippet: { type: String },
        endSnippet: { type: String },
      },
    ],
    editorial: { type: String },
    tags: {type: Array<String>}
  },
  { timestamps: true }
);

const Problem: Model<IProblem> = mongoose.model<IProblem>("Problem", problemSchema);

export default Problem;
