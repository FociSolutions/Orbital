/**
 * Model representation of mock definition metadata
 */
export interface Metadata {
  title: string;
  description: string;
}

export const defaultMetadata: Metadata = {
  title: '',
  description: '',
};
