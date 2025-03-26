import { CustomField } from '~/mongo/connect/custom-field.schema';

export const predefinedFields: Partial<CustomField>[] = [
  {
    type: 'TEXT',
    name: 'name',
    label: 'Full Name',
    custom: false,
    status: 'ACTIVE',
    showInChat: true,
  },
  {
    type: 'EMAIL',
    name: 'emailId',
    label: 'Email',
    custom: false,
    status: 'ACTIVE',
    showInChat: true,
  },
];

// export const encryptedFields = ['phoneNumber', 'emailId'];
