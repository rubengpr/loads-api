import { EquipmentType } from '@prisma/client';

// Validation constants
const MAX_CITY_NAME_LENGTH = 100;
const MAX_EQUIPMENT_TYPE_LENGTH = 50;
const MIN_CITY_NAME_LENGTH = 2;

// Pagination constants
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 1;

export interface InboundCallValidationData {
  outcome?: string;
  caller_sentiment?: string;
  carrier_name?: string;
  mc_number?: number | string;
  notes?: string;
}

export interface ValidatedInboundCallData {
  outcome: 'transferred' | 'canceled';
  caller_sentiment: 'positive' | 'neutral' | 'negative';
  carrier_name?: string;
  mc_number?: number;
  notes?: string;
}

export interface LoadFilterValidationData {
  origin_city?: string;
  destination_city?: string;
  equipment_type?: string;
  page?: string;
  limit?: string;
}

export interface ValidatedLoadFilterData {
  origin_city?: string;
  destination_city?: string;
  equipment_type?: EquipmentType;
  page?: number;
  limit?: number;
}

export const validateInboundCallData = (
  data: InboundCallValidationData,
): ValidatedInboundCallData => {
  const { outcome, caller_sentiment, carrier_name, mc_number, notes } = data;

  // Check for required fields
  if (!outcome || !caller_sentiment) {
    throw new Error('Missing required fields: outcome, caller_sentiment');
  }

  // Validate enums
  const VALID_OUTCOMES = ['transferred', 'canceled'];
  const VALID_SENTIMENTS = ['positive', 'neutral', 'negative'];

  if (!VALID_OUTCOMES.includes(outcome)) {
    throw new Error('Invalid outcome. Must be transferred or canceled');
  }

  if (!VALID_SENTIMENTS.includes(caller_sentiment)) {
    throw new Error(
      'Invalid caller_sentiment. Must be positive, neutral, or negative',
    );
  }

  return {
    outcome: outcome as 'transferred' | 'canceled',
    caller_sentiment: caller_sentiment as 'positive' | 'neutral' | 'negative',
    carrier_name: carrier_name ? carrier_name.toLowerCase() : undefined,
    mc_number: mc_number
      ? typeof mc_number === 'string'
        ? parseInt(mc_number.replace(/\D/g, ''), 10)
        : mc_number
      : undefined,
    notes: notes || undefined,
  };
};

export const validateLoadFilterData = (
  data: LoadFilterValidationData,
): ValidatedLoadFilterData => {
  const { origin_city, destination_city, equipment_type, page, limit } = data;

  // Check that at least 2 of the 3 filter parameters are provided
  const activeFilterParams = [
    origin_city,
    destination_city,
    equipment_type,
  ].filter((param) => param && param.trim() !== '');

  if (activeFilterParams.length < 2) {
    throw new Error(
      'At least 2 of the following parameters must be provided: origin_city, destination_city, equipment_type',
    );
  }

  const validatedFilters: ValidatedLoadFilterData = {};

  // Validate and add origin_city if provided
  if (origin_city && origin_city.trim() !== '') {
    const trimmedOrigin = origin_city.trim();

    if (trimmedOrigin.length < MIN_CITY_NAME_LENGTH) {
      throw new Error(
        `origin_city must be at least ${MIN_CITY_NAME_LENGTH} characters`,
      );
    }

    if (trimmedOrigin.length > MAX_CITY_NAME_LENGTH) {
      throw new Error(
        `origin_city must not exceed ${MAX_CITY_NAME_LENGTH} characters`,
      );
    }

    validatedFilters.origin_city = trimmedOrigin;
  }

  // Validate and add destination_city if provided
  if (destination_city && destination_city.trim() !== '') {
    const trimmedDestination = destination_city.trim();

    if (trimmedDestination.length < MIN_CITY_NAME_LENGTH) {
      throw new Error(
        `destination_city must be at least ${MIN_CITY_NAME_LENGTH} characters`,
      );
    }

    if (trimmedDestination.length > MAX_CITY_NAME_LENGTH) {
      throw new Error(
        `destination_city must not exceed ${MAX_CITY_NAME_LENGTH} characters`,
      );
    }

    validatedFilters.destination_city = trimmedDestination;
  }

  // Validate equipment_type if provided
  if (equipment_type && equipment_type.trim() !== '') {
    const trimmedEquipment = equipment_type.trim();

    if (trimmedEquipment.length > MAX_EQUIPMENT_TYPE_LENGTH) {
      throw new Error(
        `equipment_type must not exceed ${MAX_EQUIPMENT_TYPE_LENGTH} characters`,
      );
    }

    const validEquipmentTypes = Object.values(EquipmentType);

    if (!validEquipmentTypes.includes(trimmedEquipment as EquipmentType)) {
      throw new Error(
        `Invalid equipment_type. Must be one of: ${validEquipmentTypes.join(', ')}`,
      );
    }

    validatedFilters.equipment_type = trimmedEquipment as EquipmentType;
  }

  // Validate pagination parameters
  if (page !== undefined && page !== '') {
    const pageNum = parseInt(page, 10);

    if (isNaN(pageNum)) {
      throw new Error('page must be a valid number');
    }

    if (pageNum < 1) {
      throw new Error('page must be at least 1');
    }

    validatedFilters.page = pageNum;
  } else {
    validatedFilters.page = 1; // Default to first page
  }

  if (limit !== undefined && limit !== '') {
    const limitNum = parseInt(limit, 10);

    if (isNaN(limitNum)) {
      throw new Error('limit must be a valid number');
    }

    if (limitNum < MIN_PAGE_SIZE) {
      throw new Error(`limit must be at least ${MIN_PAGE_SIZE}`);
    }

    if (limitNum > MAX_PAGE_SIZE) {
      throw new Error(`limit must not exceed ${MAX_PAGE_SIZE}`);
    }

    validatedFilters.limit = limitNum;
  } else {
    validatedFilters.limit = DEFAULT_PAGE_SIZE; // Default page size
  }

  return validatedFilters;
};
