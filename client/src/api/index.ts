import { apiRequest } from "./client";

export function registerUser(name: string, email: string, pass: string) {
  return apiRequest("/user/register", "POST", { name, email, password: pass });
}

export function verifyUserOtp(email: string, otp: string) {
  return apiRequest("/user/verify-otp", "POST", { email, otp });
}

export function loginUser(email: string, pass: string) {
  return apiRequest("/user/login", "POST", { email, password: pass });
}

export function getUserProfile() {
  return apiRequest("/user/profile", "GET");
}

export function updateUserProfile(data: { name: string }) {
  return apiRequest("/user/update", "PATCH", data);
}

export function registerVendor(name: string, email: string, pass: string) {
  return apiRequest("/vendor/register", "POST", { name, email, password: pass });
}

export function verifyVendorOtp(email: string, otp: string) {
  return apiRequest("/vendor/verify-otp", "POST", { email, otp });
}

export function loginVendor(email: string, pass: string) {
  return apiRequest("/vendor/login", "POST", { email, password: pass });
}

export function getVendorProfile() {
  return apiRequest("/vendor/profile", "GET");
}

export function updateVendorProfile(data: { name: string }) {
  return apiRequest("/vendor/update", "PATCH", data);
}

export function getAllProducts() {
  return apiRequest("/product/all", "GET");
}

export function searchProducts(query: string) {
  return apiRequest(`/product/search?q=${encodeURIComponent(query)}`, "GET");
}

export function getProductById(productId: string) {
  return apiRequest(`/product/${productId}`, "GET");
}

export function getProductReviews(productId: string) {
  return apiRequest(`/review/${productId}`, "GET");
}

export function addReview(productId: string, comment: string, rating: number) {
  return apiRequest(`/review/${productId}`, "POST", { productId, comment, rating });
}

export function getCart() {
  return apiRequest("/cart", "GET");
}

export function addToCart(productId: string, quantity: number = 1) {
  return apiRequest("/cart/add", "POST", { productId, quantity });
}

export function clearCart() {
  return apiRequest("/cart/clear", "DELETE");
}

export function placeOrder(items: { productId: string; quantity: number }[]) {
  return apiRequest("/order/place", "POST", { items });
}

export function getUserOrders() {
  return apiRequest("/order/my-orders", "GET");
}

export function getVendorOrders() {
  return apiRequest("/order/vendor-orders", "GET");
}

export function getVendorProducts() {
  return apiRequest("/product/my-products", "GET");
}

export function createProduct(data: {
  productName: string;
  productDescription: string;
  productCategory: string;
  productImages?: string[];
  productVideos?: string[];
}) {
  return apiRequest("/product/create", "POST", data);
}

export function setProductPrice(productId: string, price: number) {
  return apiRequest("/price/set-price", "POST", { productId, price, isActive: true });
}

export function getProductPrice(productId: string) {
  return apiRequest(`/price/${productId}`, "GET");
}

export function createOffer(data: {
  offerCode: string;
  discountPercent: number;
  validUntil: string;
}) {
  return apiRequest("/offer/create", "POST", data);
}

export function getVendorOffers() {
  return apiRequest("/offer/vendor-offers", "GET");
}

export function deleteOffer(offerId: string) {
  return apiRequest(`/offer/${offerId}`, "DELETE");
}

export function getVendorReviews() {
  return apiRequest("/review/vendor-reviews", "GET");
}

export function updateOrderStatus(orderId: string, status: string) {
  return apiRequest(`/order/${orderId}/status`, "PATCH", { status });
}

export function getProductPriceHistory(productId: string) {
  return apiRequest(`/price/all/${productId}`, "GET");
}

export function activateExistingPrice(priceId: string, productId: string) {
  return apiRequest(`/price/${priceId}/activate`, "PATCH", { productId });
}

export function requestExport(vendorId?: string) {
  return apiRequest("/export", "POST", { vendorId });
}

export function getExportJobs() {
  return apiRequest("/export/jobs", "GET");
}

export function getExportStatus(jobId: string) {
  return apiRequest(`/export/status/${jobId}`, "GET");
}

export function getDownloadUrl(jobId: string) {
  return `http://localhost:8000/api/v1/export/download/${jobId}`;
}
