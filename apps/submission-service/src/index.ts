import Fastify from "fastify";
import app from "./app";
import connectToDB from "@repo/db/connect";
import { SUBMISSION_PORT } from "@repo/config/constant";
import evaluationWorker from "@repo/mq/workers/evaluationWorker";

const fastify = Fastify({ logger: true });
fastify.register(app);
const startServer = async () => {
  try {
    await fastify.listen({ port: Number(SUBMISSION_PORT)});
    await connectToDB();
    evaluationWorker("EvaluationQueue");
    console.log(`Server up at port ${SUBMISSION_PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
startServer();
