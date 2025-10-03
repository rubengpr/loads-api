export interface InboundCallValidationData {
  outcome?: string;
  caller_sentiment?: string;
  carrier_name?: string;
  notes?: string;
}

export interface ValidatedInboundCallData {
  outcome: 'transferred' | 'canceled';
  caller_sentiment: 'positive' | 'neutral' | 'negative';
  carrier_name?: string;
  notes?: string;
}

export const validateInboundCallData = (
  data: InboundCallValidationData,
): ValidatedInboundCallData => {
  const { outcome, caller_sentiment, carrier_name, notes } = data;

  // Check for required fields
  if (!outcome || !caller_sentiment) {
    throw new Error('Missing required fields: outcome, caller_sentiment');
  }

  // Validate enums
  const validOutcomes = ['transferred', 'canceled'];
  const validSentiments = ['positive', 'neutral', 'negative'];

  if (!validOutcomes.includes(outcome)) {
    throw new Error('Invalid outcome. Must be transferred or canceled');
  }

  if (!validSentiments.includes(caller_sentiment)) {
    throw new Error(
      'Invalid caller_sentiment. Must be positive, neutral, or negative',
    );
  }

  return {
    outcome: outcome as 'transferred' | 'canceled',
    caller_sentiment: caller_sentiment as 'positive' | 'neutral' | 'negative',
    carrier_name: carrier_name || undefined,
    notes: notes || undefined,
  };
};
