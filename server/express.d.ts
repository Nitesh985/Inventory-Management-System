export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        activeShopId?: string;
        hasCompletedTour: boolean;
        onBoardingCompleted: boolean;
        emailVerified: boolean;
      };
    }
  }
}
