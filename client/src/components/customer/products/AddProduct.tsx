import Button from "@/components/ui/Button"
import { useMutation } from "@/hooks/useMutation"
import { createProduct } from "@/api/products"

interface Product {
  _id?: string;
  name?: string;
  [key: string]: unknown;
}

interface AddProductProps {
  handleAddProduct?: () => void;
  product?: Product | null;
  isSubmitting?: boolean;
}

function AddProduct({ handleAddProduct, product, isSubmitting }: AddProductProps) {
  const { mutate, loading, error } = useMutation(createProduct)
  
  
  const handleSubmit = async () => {
    mutate({})
  }
  
  
  return (
    <>
      <Button
        type="submit"
        variant="default"
        loading={isSubmitting}
        iconName="Save"
        iconPosition="left"
      >
        {product ? 'Update Product' : 'Add Product'}
      </Button>
    </>
  )
  
}

export default AddProduct