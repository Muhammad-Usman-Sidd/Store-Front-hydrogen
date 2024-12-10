import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Fabric Elite | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

// Load critical data for rendering
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

// Load deferred data for collections
function loadDeferredData({context}: LoaderFunctionArgs) {
  const collections = context.storefront
    .query(COLLECTIONS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    collections,
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <FeaturedCollection collection={data.featuredCollection} />
      <CollectionsSection collections={data.collections} />
      <RecommendedProducts products={data.recommendedProducts} />
      {/* Promo Bar */}
      <div className="bg-gray-500 text-white py-8 px-6">
        <div className="container mx-auto flex flex-wrap md:flex-nowrap justify-between items-center gap-8">
          {/* Left Column */}
          <div className="md:w-1/2 text-center md:text-left md:pl-8">
            <h2 className="text-4xl font-bold mb-4">Exclusive Offer!</h2>
            <p className="text-lg mb-6">Get amazing discounts and more:</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              onClick={() => (window.location.href = '/contact')}
            >
              Contact Us
            </button>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2">
            <ul className="space-y-4 text-xl">
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✔</span> 20% off your
                first order!
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✔</span> Free shipping on
                orders over $50
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-3">✔</span> Special offers
                for members
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  const [selectedProduct, setSelectedProduct] = useState<
    RecommendedProductsQuery['products']['nodes'][0] | null
  >(null);

  return (
    <div className="recommended-products my-10 px-6">
      <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>

      <div className="flex">
        {/* Image Section */}
        <div className="w-4/12 h-auto">
          {selectedProduct ? (
            <Image
              data={selectedProduct.images.nodes[0]}
              alt={selectedProduct.title}
              className="rounded-lg object-cover h-full"
            />
          ) : (
            <div className="bg-gray-100 rounded-lg flex items-center justify-center h-full">
              <span className="text-gray-500">Loading...</span>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="w-7/12 ml-4 space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={products}>
              {(response) => {
                const productList = response?.products.nodes.slice(0, 3) || [];

                // Set the first product by default
                if (!selectedProduct && productList.length > 0) {
                  setSelectedProduct(productList[0]);
                }

                return productList.map((product) => (
                  <div
                    key={product.id}
                    className={`p-6 rounded-lg shadow-md cursor-pointer 
                    ${
                      selectedProduct?.id === product.id
                        ? 'bg-blue-100'
                        : 'bg-white'
                    }
                    transition-transform transform hover:scale-105`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <h3 className="text-xl font-semibold">{product.title}</h3>
                    <p className="text-gray-600 mt-2">
                      {product.description || 'No description available'}
                    </p>
                  </div>
                ));
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
// Featured Collection
function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;

  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
    </Link>
  );
}

// Collections Section
function CollectionsSection({
  collections,
}: {
  collections: Promise<{
    collections: {nodes: FeaturedCollectionFragment[]};
  } | null>;
}) {
  return (
    <div className="collections-section">
      <h2 className="flex row">Collections</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={collections}>
          {(response) => (
            <div className="collections-grid">
              {response?.collections.nodes
                .map((collection) => (
                  <Link
                    key={collection.id}
                    className="collection-item"
                    to={`/collections/${collection.handle}`}
                  >
                    <Image
                      data={collection.image}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                    <h4>{collection.title}</h4>
                  </Link>
                ))
                .slice(0, 3)}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

// GraphQL Queries
const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode, 
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...Collection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
