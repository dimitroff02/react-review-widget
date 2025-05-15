import React from "react";
import ProductDetails from "@/components/ProductDetails";

const ProductPage = ({ product }) => {
  return (
    <main className="p-6">
      <ProductDetails product={product} />
    </main>
  );
};

export default ProductPage;

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { handle: "apple-pie-cookie" } }],
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { handle } = params;

  const response = await fetch(
    `https://${process.env.SHOPIFY_DOMAIN}/api/2023-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: `
          query GetProductByHandle($handle: String!) {
            productByHandle(handle: $handle) {
              title
              description
              images(first: 2) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                }
              }
            }
          }
        `,
        variables: { handle },
      }),
    }
  );

  const json = await response.json();

  if (!json?.data?.productByHandle) {
    return { notFound: true };
  }

  const product = json.data.productByHandle;

  return {
    props: {
      product: {
        title: product.title,
        description: product.description,
        image: product.images.edges[0]?.node.url || "",
        thumbnail: product.images.edges[1]?.node.url || "",
        price: parseFloat(product.priceRange.minVariantPrice.amount),
      },
    },
  };
};
