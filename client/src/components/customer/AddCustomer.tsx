import Button from '@/components/ui/Button'

export interface AddCustomerProps {
  handleAddCustomer: () => void;
  loading?: boolean;
}

function AddCustomer({ handleAddCustomer, loading }: AddCustomerProps) {
  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={handleAddCustomer}
        disabled={loading}
      >
        Add Customer
      </Button>
    </>
  )
  
}


export default AddCustomer