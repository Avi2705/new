export class ApiHandler extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiHandler.prototype);
    }
}
export default ApiHandler;
//# sourceMappingURL=error-handler.js.map