import { EquipmentType } from '@prisma/client';

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

export interface LoadFilterValidationData {
  origin_city?: string;
  destination_city?: string;
  equipment_type?: string;
}

export interface ValidatedLoadFilterData {
  origin_city?: string;
  destination_city?: string;
  equipment_type?: EquipmentType;
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

export const validateLoadFilterData = (
  data: LoadFilterValidationData,
): ValidatedLoadFilterData => {
  const { origin_city, destination_city, equipment_type } = data;

  // Check that at least 2 of the 3 parameters are provided
  const providedParams = [origin_city, destination_city, equipment_type].filter(
    (param) => param && param.trim() !== '',
  );

  if (providedParams.length < 2) {
    throw new Error(
      'At least 2 of the following parameters must be provided: origin_city, destination_city, equipment_type',
    );
  }

  const result: ValidatedLoadFilterData = {};

  // Validate and add origin_city if provided
  if (origin_city && origin_city.trim() !== '') {
    result.origin_city = origin_city.trim();
  }

  // Validate and add destination_city if provided
  if (destination_city && destination_city.trim() !== '') {
    result.destination_city = destination_city.trim();
  }

  // Validate equipment_type if provided
  if (equipment_type && equipment_type.trim() !== '') {
    const validEquipmentTypes = Object.values(EquipmentType);

    if (!validEquipmentTypes.includes(equipment_type as EquipmentType)) {
      throw new Error(
        `Invalid equipment_type. Must be one of: ${validEquipmentTypes.join(', ')}`,
      );
    }

    result.equipment_type = equipment_type as EquipmentType;
  }

  return result;
};
