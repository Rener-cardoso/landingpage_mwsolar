import { stripe } from "@/lib/stripe"
import axios from "axios"
import { GetStaticProps } from "next"
import Stripe from "stripe"

interface ProductProps {
  product: {
    defaultPriceId: string;
  }
}

export default function Home({ product }: ProductProps) {

  async function handleBuyProduct() {
    try {
      const response = await axios.post("/api/checkout", {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl
    } catch (error) {
      console.log(error)

      alert("Falha ao redirecionar ao checkout!")
    }
  }

  return (
    <div className="flex justify-center py-[5rem]">
      <button 
        onClick={handleBuyProduct} 
        className="bg-[#00B37E] rounded-[4px] px-[1rem] py-[0.5rem] text-[#fff] font-bold uppercase"
      >
        Comprar curso
      </button>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const productId = "prod_Pe8USvREtyhEAr"

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1,
  }
}