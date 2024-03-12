'use client';

import CircuitBreaker from 'opossum';
import { useEffect, useState } from 'react';

// Define an interface for the product data
interface Product {
	id: number;
	title: string;
	// Add other product properties as needed
}

function useProducts(): {
	products: Product[];
	error: Error | null;
	isLoading: boolean;
} {
	const [products, setProducts] = useState<Product[]>([]);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const options = {
			timeout: 3000, // Milliseconds to wait for response before considering failure
			errorThresholdPercentage: 50, // Number of failures to tolerate before tripping the circuit breaker
			resetTimeout: 10000, // Milliseconds to wait before trying again after failures
		};

		const breaker = new CircuitBreaker(async () => {
			const response = await fetch('https://fakestoreapi.com/products');
			if (response.status !== 200) {
				throw new Error(`Failed to fetch products: ${response.statusText}`);
			}
			return response.json();
		}, options);

		const fetchData = async () => {
			setIsLoading(true);
			try {
				const data = await breaker.fire();
				setProducts(data);
			} catch (error: any) {
				if (error.name === 'CircuitBreakerError') {
					console.error('Failed to fetch products:', error);
					setError(
						new Error('Products could not be fetched. Try again later.')
					);
				} else {
					console.error('Error fetching products:', error);
					setError(error);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return { products, error, isLoading };
}

export default useProducts;
