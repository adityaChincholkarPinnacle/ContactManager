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

    case 'PATCH': {
      const { id } = req.query;
      const index = contacts.findIndex((c) => c.id === id);
      if (index === -1) return res.status(404).json({ message: 'Not found' });
      contacts[index] = { ...contacts[index], ...req.body };
      return res.status(200).json(contacts[index]);
    }

    case 'DELETE': {
      const { id } = req.query;
      contacts = contacts.filter((c) => c.id !== id);
      return res.status(204).end();
    }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
