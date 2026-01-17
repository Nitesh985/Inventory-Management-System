import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Icon from '@/components/AppIcon'

const AddSaleButton = () => {
  const navigate = useNavigate()

  return (
    <Button className="gap-2" onClick={() => navigate('/sales-recording')}>
      <Icon name="Plus" size={16} />
      New Sale
    </Button>
  )
}

export default AddSaleButton
