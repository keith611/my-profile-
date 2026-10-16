/**
 * Storage interface. ExcelStorage implements this today.
 * A future SupabaseStorage can implement the same methods
 * without changing the questionnaire UI or the submit route contract.
 */
export class Storage {
  async saveResponse(_record) {
    throw new Error('saveResponse must be implemented by a storage adapter');
  }
}
