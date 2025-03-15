import submissionQueue from '../queues/evaluationQueue';

export default async function (payload: Record<string, unknown>) {
  await submissionQueue.add('EvaluationJob', payload);
  console.log('Successfully added a new evaluation job');
}
