import Button from "@/components/ui/Button"
import { useMutation } from "@/hooks/useMutation"
import { createProduct } from "@/api/products"


function AddProduct({handleAddProduct, product, isSubmitting}) {
  const {mutate, loading, error} = useMutation(createProduct)
  
  
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