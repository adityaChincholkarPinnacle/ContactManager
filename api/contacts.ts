import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory store as a placeholder. In real usage you would replace
// this with a database or external service.
// The schema matches the Contact type used in the front-end.
let contacts = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    favourite: false,
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      return res.status(200).json(contacts);

    case 'POST':
      const newContact = { id: Date.now().toString(), ...req.body, favourite: false };
      contacts.push(newContact);
      return res.status(201).json(newContact);

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
