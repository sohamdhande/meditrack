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
      if (resourceId !== userId) {
        return res.status(403).send('Forbidden');
      }
    }

    next();
  };
};

const validateOwnership = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.cookies.sessionCookie;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  const decoded = decode(token) as User;
  req.user = decoded;

  const resourceId = req.params.id;
  const userId = req.user.id;

  if (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE') {
    if (resourceId !== userId) {
      return res.status(403).send('Forbidden');
    }
  }

  next();
};

export { ownershipValidationMiddleware, validateOwnership };