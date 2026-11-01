import type { Request, Response } from "express";
declare function vendorRegister(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function verifyVendorOtp(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function vendorLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function forgotVendorPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function resetVendorPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function vendorLogout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function getVendorProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
declare function vendorUpdate(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export { vendorRegister, verifyVendorOtp, vendorLogin, forgotVendorPassword, resetVendorPassword, vendorLogout, getVendorProfile, vendorUpdate };
//# sourceMappingURL=vendor-controller.d.ts.map