import type { Request, Response } from "express";
declare function userRegister(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function verifyOtp(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function userLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function userLogout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function getUserProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function userUpdate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function findUsersByIdsController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export { userRegister, verifyOtp, userLogin, forgotPassword, resetPassword, userLogout, getUserProfile, userUpdate, findUsersByIdsController };
//# sourceMappingURL=user-controller.d.ts.map