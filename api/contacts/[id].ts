import { VercelRequest, VercelResponse } from '@vercel/node';

// This file shares the in-memory contacts array with the root-level contacts
// handler by importing it. To keep things super-simple we re-declare it here
// as module-local; for a real app move data access into a shared module.
let contacts: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid id' });

  switch (req.method) {
    case 'PATCH': {
      const index = contacts.findIndex((c) => c.id === id);
      if (index === -1) return res.status(404).json({ message: 'Not found' });
      contacts[index] = { ...contacts[index], ...req.body };
      return res.status(200).json(contacts[index]);
    }

    case 'DELETE': {
      contacts = contacts.filter((c) => c.id !== id);
      return res.status(204).end();
    }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
