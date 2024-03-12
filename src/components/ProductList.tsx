'use client';

import useProducts from '@/hooks/use-products';

function ProductList() {
	const { products, error, isLoading } = useProducts();

	// Conditionally render content based on hook state
	if (isLoading) return <p>Loading products...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div>
			<h1>Products</h1>
			<ul>
				{products.map((product) => (
					<li key={product.id}>{product.title}</li>
				))}
			</ul>
		</div>
	);
}

export default ProductList;
