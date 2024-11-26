export interface Review {
  rating: number;
  comment: string;
}

export interface RouteOption {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: Review;
  value: number;
}

export interface RouteRequestBody {
  customer_id: string;
  origin: string;
  destination: string;
}
