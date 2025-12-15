import Button from '@/components/ui/Button'
import { useMutation } from '@/hooks/useMutation'
import type { CreateCustomerDTO } from '@/api/customers'
import { createCustomer } from '@/api/customers'

export interface AddCustomerProps {
  handleAddCustomer: () => void;
  newCustomer: CreateCustomerDTO;
}

function AddCustomer({handleAddCustomer, newCustomer}:AddCustomerProps){
  const { loading, mutate } = useMutation(createCustomer)
  
  
  const handleSubmit = async () => {
    console.log(newCustomer)
    mutate({...newCustomer, shopId: '69243c8f00b1f56bd2724e3a', clientId: 'client1234'})
      .then(()=>{
        handleAddCustomer()
      })
  }
  
  
  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={handleSubmit}
        disabled={loading}
      >
        Add Customer
      </Button>
    </>
  )
  
}


export default AddCustomer