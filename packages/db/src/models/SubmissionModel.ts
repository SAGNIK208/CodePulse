import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: "Pending" | "Success" | "RE" | "TLE" | "MLE" | "WA";
}

const submissionSchema: Schema = new Schema({
  userId: {
    type: String,
    required: [true, "User id for the submission is missing"],
  },
  problemId: {
    type: String,
    required: [true, "Problem id for the submission is missing"],
  },
  code: {
    type: String,
    required: [true, "Code for the submission is missing"],
  },
  language: {
    type: String,
    required: [true, "Language for the submission is missing"],
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "RE", "TLE", "MLE", "WA"],
    default: "Pending",
  },
});

const Submission: Model<ISubmission> = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);
export default Submission;
