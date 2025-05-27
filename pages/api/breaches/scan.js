import { checkBreaches } from '../../../services/breachDetectionService';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, userId } = JSON.parse(req.body);
    if (!email || !userId) {
      return res.status(400).json({ message: 'Email and UserId are required' });
    }
    const breaches = await checkBreaches(userId, email);
    return res.status(200).json(breaches);
  } catch (error) {
    console.error('Error in scan endpoint:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
