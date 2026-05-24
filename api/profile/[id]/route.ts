import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
}

interface RequestWithUser extends Request {
  user: User;
}

const ownershipValidationMiddleware = (resourceType: string) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const resourceId = req.params.id;
    const userId = req.user.id;

    if (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE') {
      if (!resourceId) {
        return res.status(400).send({ error: 'Resource ID is required' });
      }

      const resourceOwner = getResourceOwner(resourceType, resourceId);

      if (resourceOwner !== userId) {
        return res.status(403).send({ error: 'Forbidden' });
      }
    }

    next();
  };
};

const getResourceOwner = (resourceType: string, resourceId: string) => {
  // Replace this with your actual database or data storage query
  // For example, using a MongoDB model:
  // return User.findById(resourceId).then(user => user.id);
  // For this example, we'll just return a hardcoded value
  return 'cmpjx814a0000i40xodaftkbs';
};

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.sessionCookie;

  if (!token) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const decoded = decode(token) as User;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ error: 'Invalid token' });
  }
};

const protectedRoute = [authenticate, ownershipValidationMiddleware('profile')];

export { protectedRoute };